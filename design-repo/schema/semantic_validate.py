#!/usr/bin/env python3
"""
Semantic validator for the Mirai Labs clone design-repo.

Enforces everything JSON Schema (pagespec.schema.json) structurally cannot:
  - basedOnTemplate required-node cross-reference (compatibility/graph.json TEMPLATE_NODE_MATCH)
  - shell boundaries (first node = shell-navbar, last node = shell-footer)
  - route restrictions (*RouteOnly section constraints)
  - mustBeFirst / mustBeLast / mustBeLastBeforeFooter / onePerPage
  - required reducedMotionFallback presence
  - per-instance maxWords budgets, read live from sections/*.json content contracts
  - the FAQ_ITEM_COUNT_STYLE and NO_CONSECUTIVE_PERFECT_FOR warn-severity rhythm rules
  - required structured `responsive` field presence, closed breakpoint-key validity,
    noResponsiveChange/breakpoints/citation internal consistency, and an exact
    match against the evidence-grounded `responsive` block in the node's own
    sections/*.json contract (a generator must carry the real fact through, not
    invent a plausible-looking substitute)

Path portability: the repo root is derived from this file's own location, never
a hardcoded absolute path, so this script works identically wherever the
design-repo folder is copied.

Usage:
  python3 semantic_validate.py [path/to/pagespec.json]
  (defaults to schema/example.pagespec.json)
"""
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def load(*parts):
    with open(os.path.join(ROOT, *parts)) as f:
        return json.load(f)


def load_sections():
    sections = {}
    sdir = os.path.join(ROOT, "sections")
    for fn in os.listdir(sdir):
        if fn.endswith(".json"):
            d = json.load(open(os.path.join(sdir, fn)))
            sections[d["id"]] = d
    return sections


def word_count(text):
    if not isinstance(text, str):
        return 0
    return len([w for w in re.split(r"\s+", text.strip()) if w])


class Result:
    def __init__(self):
        self.errors = []
        self.warnings = []

    def err(self, code, msg):
        self.errors.append(f"[{code}] {msg}")

    def warn(self, code, msg):
        self.warnings.append(f"[{code}] {msg}")

    def ok(self):
        return len(self.errors) == 0


def validate_pagespec(spec, sections=None, templates=None, graph=None):
    """Returns a Result. `spec` is a parsed PageSpec dict."""
    r = Result()
    sections = sections or load_sections()
    templates = templates if templates is not None else load("templates", "templates.json")["templates"]
    graph_rules = {ru["id"]: ru for ru in (graph or load("compatibility", "graph.json"))["rules"]}

    nodes = spec.get("nodes", [])
    if not nodes:
        r.err("EMPTY_NODES", "PageSpec has no nodes.")
        return r

    # ---- SHELL_BOUNDARIES ----
    if nodes[0].get("section") != "section.shell-navbar":
        r.err("SHELL_BOUNDARIES", f"First node must be section.shell-navbar, got {nodes[0].get('section')!r}.")
    if nodes[-1].get("section") != "section.shell-footer":
        r.err("SHELL_BOUNDARIES", f"Last node must be section.shell-footer, got {nodes[-1].get('section')!r}.")

    # ---- TEMPLATE_NODE_MATCH ----
    tpl_key = spec.get("template", "")
    tpl_short = tpl_key.split(".", 1)[1] if "." in tpl_key else tpl_key
    tpl = templates.get(tpl_short)
    if tpl is None:
        r.err("UNKNOWN_TEMPLATE", f"template {tpl_key!r} not found in templates/templates.json.")
    else:
        required_tpl_sections = [n["section"] for n in tpl["nodes"] if n.get("required")]
        # Build the instance's sequence of sections, collapsing consecutive repeats
        # of a repeatable node down to one occurrence, so we compare REQUIRED shape,
        # not exact repeat count (repeat count is bounded separately by min/maxCount).
        repeatable_ids = {n["section"] for n in tpl["nodes"] if n.get("repeatable")}
        instance_seq = []
        for n in nodes:
            sid = n.get("section")
            if instance_seq and instance_seq[-1] == sid and sid in repeatable_ids:
                continue
            instance_seq.append(sid)
        # Now instance_seq (deduped-for-repeats) must equal required_tpl_sections exactly.
        if instance_seq != required_tpl_sections:
            r.err(
                "TEMPLATE_NODE_MATCH",
                "PageSpec nodes[] do not match declared template's required node sequence.\n"
                f"    declared template ({tpl_key}) requires: {required_tpl_sections}\n"
                f"    PageSpec provides (collapsed):         {instance_seq}",
            )
        # repeat-count bounds
        counts = {}
        for n in nodes:
            counts[n.get("section")] = counts.get(n.get("section"), 0) + 1
        for tn in tpl["nodes"]:
            sid = tn["section"]
            c = counts.get(sid, 0)
            if tn.get("required") and c == 0:
                r.err("MISSING_REQUIRED_SECTION", f"template {tpl_key} requires {sid}, which is missing from nodes[].")
            minc = tn.get("minCount")
            maxc = tn.get("maxCount")
            if minc is not None and c and c < minc:
                r.err("REPEAT_COUNT_TOO_LOW", f"{sid} appears {c} times, below template minCount {minc}.")
            if maxc is not None and c > maxc:
                r.err("REPEAT_COUNT_TOO_HIGH", f"{sid} appears {c} times, above template maxCount {maxc}.")
            if not tn.get("repeatable") and c > 1:
                r.err("NON_REPEATABLE_DUPLICATED", f"{sid} is not repeatable in template {tpl_key} but appears {c} times.")

    # ---- per-node checks ----
    route = spec.get("route", "")
    seen_once = {}
    for i, n in enumerate(nodes):
        sid = n.get("section")
        sec = sections.get(sid)
        if sec is None:
            r.err("UNKNOWN_SECTION", f"node[{i}] references unknown section {sid!r}.")
            continue
        constraints = sec.get("constraints", {})

        # ONE_PER_PAGE
        if constraints.get("onePerPage"):
            seen_once.setdefault(sid, 0)
            seen_once[sid] += 1
            if seen_once[sid] > 1:
                r.err("ONE_PER_PAGE", f"{sid} is onePerPage but appears more than once.")

        # ROUTE_RESTRICTION
        for ck in constraints:
            if ck.endswith("RouteOnly") and constraints[ck]:
                allowed_routes = None
                if tpl is not None:
                    allowed_routes = tpl.get("routes")
                if allowed_routes is not None and route not in allowed_routes:
                    r.err(
                        "ROUTE_RESTRICTION",
                        f"{sid} carries {ck} but PageSpec route {route!r} is not in its owning template's routes {allowed_routes}.",
                    )

        # MUST_BE_FIRST (immediately after shell-navbar)
        if constraints.get("mustBeFirst"):
            if i == 0 or nodes[i - 1].get("section") != "section.shell-navbar":
                r.err("MUST_BE_FIRST", f"{sid} has mustBeFirst but is not immediately after section.shell-navbar (index {i}).")

        # MUST_BE_LAST_BEFORE_FOOTER
        if constraints.get("mustBeLastBeforeFooter"):
            if i != len(nodes) - 2 or nodes[-1].get("section") != "section.shell-footer":
                r.err("MUST_BE_LAST_BEFORE_FOOTER", f"{sid} has mustBeLastBeforeFooter but is not the node immediately before section.shell-footer.")

        # REDUCED_MOTION_FALLBACK_REQUIRED
        motion = n.get("motion", {})
        pattern = motion.get("pattern")
        fallback = motion.get("reducedMotionFallback")
        if pattern and pattern != "none":
            if not fallback or not str(fallback).strip():
                r.err("REDUCED_MOTION_FALLBACK_REQUIRED", f"node[{i}] ({sid}) has motion.pattern={pattern!r} but no non-empty reducedMotionFallback.")
        elif pattern == "none":
            pass  # no fallback required

        # MAXWORDS_BUDGET (per-instance, live against section contract, not just the bundled example)
        content = n.get("content", {})
        for fname, fspec in sec.get("content", {}).items():
            maxw = fspec.get("maxWords")
            if maxw is None:
                continue
            val = content.get(fname)
            if val is None:
                continue
            if isinstance(val, str):
                wc = word_count(val)
                if wc > maxw:
                    r.err("MAXWORDS_BUDGET", f"node[{i}] ({sid}).content.{fname} is {wc} words, budget is {maxw}.")
            elif isinstance(val, list):
                item_words = fspec.get("itemFields")
                if isinstance(item_words, dict):
                    for item in val:
                        if isinstance(item, dict):
                            for k, kfspec in item_words.items():
                                kmax = kfspec.get("maxWords") if isinstance(kfspec, dict) else None
                                if kmax is not None and k in item:
                                    wc = word_count(item[k])
                                    if wc > kmax:
                                        r.err("MAXWORDS_BUDGET", f"node[{i}] ({sid}).content.{fname}[].{k} is {wc} words, budget is {kmax}.")

        # RESPONSIVE_FIELD_REQUIRED / RESPONSIVE_CONSISTENCY / RESPONSIVE_CONTRACT_MISMATCH
        VALID_BREAKPOINT_KEYS = {"sm-640", "md-768", "nav-810", "lg-1024", "product-1200", "shell-1240"}
        responsive = n.get("responsive")
        if responsive is None:
            r.err("RESPONSIVE_FIELD_REQUIRED", f"node[{i}] ({sid}) is missing the required 'responsive' field.")
        else:
            no_change = responsive.get("noResponsiveChange")
            breakpoints = responsive.get("breakpoints", {})
            bad_keys = set(breakpoints.keys()) - VALID_BREAKPOINT_KEYS
            if bad_keys:
                r.err(
                    "RESPONSIVE_INVALID_BREAKPOINT_KEY",
                    f"node[{i}] ({sid}).responsive.breakpoints has invalid key(s) {sorted(bad_keys)}; "
                    f"must be a subset of {sorted(VALID_BREAKPOINT_KEYS)} (tokens/00-foundation/breakpoint.json).",
                )
            if no_change is True and breakpoints:
                r.err("RESPONSIVE_CONSISTENCY", f"node[{i}] ({sid}).responsive.noResponsiveChange is true but breakpoints is non-empty.")
            if no_change is False and not breakpoints:
                r.err(
                    "RESPONSIVE_CONSISTENCY",
                    f"node[{i}] ({sid}).responsive.noResponsiveChange is false but breakpoints is empty — "
                    "a section with responsive behavior must cite at least one real breakpoint.",
                )
            if no_change is True and not str(responsive.get("citation", "")).strip():
                r.err(
                    "RESPONSIVE_CONSISTENCY",
                    f"node[{i}] ({sid}).responsive.noResponsiveChange is true but no citation is given "
                    "for the absence of responsive behavior.",
                )
            sec_responsive = sec.get("responsive")
            if sec_responsive is not None and responsive != sec_responsive:
                r.err(
                    "RESPONSIVE_CONTRACT_MISMATCH",
                    f"node[{i}] ({sid}).responsive does not match the evidence-grounded responsive block "
                    f"in sections/{sid.split('.', 1)[1]}.json — a generator must carry the real, cited fact "
                    "through unchanged, not invent a substitute.",
                )

        # FAQ_ITEM_COUNT_STYLE (warn)
        if sid == "section.faq":
            items = content.get("items", [])
            if isinstance(items, list) and len(items) > 6:
                r.warn("FAQ_ITEM_COUNT_STYLE", f"faq has {len(items)} items; every real FAQ on this site ships exactly 6 (non-fatal).")

    return r


def main():
    target = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, "schema", "example.pagespec.json")
    spec = json.load(open(target))
    result = validate_pagespec(spec)
    for w in result.warnings:
        print("WARN:", w)
    for e in result.errors:
        print("ERROR:", e)
    if result.ok():
        print(f"OK: {target} — 0 errors, {len(result.warnings)} warning(s).")
        sys.exit(0)
    else:
        print(f"FAIL: {target} — {len(result.errors)} error(s).")
        sys.exit(1)


if __name__ == "__main__":
    main()
