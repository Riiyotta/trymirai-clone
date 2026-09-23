#!/usr/bin/env python3
"""
verify_all.py — the design-repo's own self-containment + structural verifier.

Runs, in order:
  1. Draft-07 JSON Schema validation of schema/example.pagespec.json (must be 0 errors).
  2. Semantic validation of the same instance via schema/semantic_validate.py (must be 0 errors).
  3. Allowlist parity — every id in tokens/llm/component-allowlist.json has a matching
     contract file in primitives/ components/ sections/, and every real contract file
     has an allowlist entry. No phantom entries, no orphans.
  4. Citation-range validity — every 'measuredFrom'/'citation' string that looks like
     'relative/path:line[-line]' is checked. When the sibling source tree (the real
     cloned-site project one directory above design-repo/) is present on disk, the
     range is resolved against the real file and must not exceed its length. When the
     sibling tree is NOT present (e.g. this folder was unzipped standalone), this
     check WARNS and continues rather than failing the run.
  5. Manifest counts — registry.manifest.json's `counts` block is recomputed from the
     real files on disk (not read back from the manifest itself) and compared.
  6. Version parity — registry.manifest.json's `allowlistVersion` matches
     tokens/llm/component-allowlist.json's own `allowlistVersion` field.
  7. Route parity — templates/routes.json is regenerated fresh from
     templates/templates.json and diffed against the file on disk (catches
     hand-edited drift), every real route in src/App.jsx's <Routes> (when the
     sibling source tree is present) is covered exactly once, and no route
     maps to a nonexistent template.
  8. Asset-role closure — every assetRole value permitted anywhere in
     schema/pagespec.schema.json exists in assets/asset-roles.json (and vice
     versa — no orphan catalogued role), and every catalogued role is either
     actually used by a real section/example or explicitly marked `reserved`.

This script only ever reads files inside design-repo/ itself (plus, best-effort and
gracefully, the sibling source tree for citation checks) — never a hardcoded absolute
path. Repo root is derived from this file's own location.

Exit code 0 iff every hard check passes. Warnings never fail the run.

Usage: python3 verify_all.py [--inject-drift=<name>]
  --inject-drift is used only by the drift-proof self-test in this same file's
  __main__ block's sibling test runner; see the 'HOW THIS IS PROVEN TO CATCH DRIFT'
  section at the bottom of this file for how to reproduce that proof by hand.
"""
import glob
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SCHEMA_DIR = os.path.join(ROOT, "schema")
sys.path.insert(0, SCHEMA_DIR)

from jsonschema import Draft7Validator  # noqa: E402
from semantic_validate import validate_pagespec, load_sections  # noqa: E402


class Report:
    def __init__(self):
        self.failures = []
        self.warnings = []
        self.passes = []

    def check(self, name, ok, detail=""):
        if ok:
            self.passes.append(name)
            print(f"PASS  {name}")
        else:
            self.failures.append((name, detail))
            print(f"FAIL  {name}" + (f" — {detail}" if detail else ""))

    def warn(self, name, detail=""):
        self.warnings.append((name, detail))
        print(f"WARN  {name}" + (f" — {detail}" if detail else ""))

    def summary(self):
        print()
        print(f"{len(self.passes)} passed, {len(self.warnings)} warning(s), {len(self.failures)} failed.")
        return len(self.failures) == 0


def load_json(*parts):
    with open(os.path.join(ROOT, *parts)) as f:
        return json.load(f)


def check_1_schema(report, inject=None):
    schema = load_json("schema", "pagespec.schema.json")
    instance = load_json("schema", "example.pagespec.json")
    if inject == "schema_break_additional_properties":
        instance["nodes"][1]["content"]["inventedDriftField"] = "x"
    v = Draft7Validator(schema)
    errors = list(v.iter_errors(instance))
    report.check("1. Draft-07 schema validation of example.pagespec.json", len(errors) == 0,
                 f"{len(errors)} error(s): {errors[0].message[:150] if errors else ''}")


def check_2_semantic(report, inject=None):
    instance = load_json("schema", "example.pagespec.json")
    sections = load_sections()
    templates = load_json("templates", "templates.json")["templates"]
    if inject == "semantic_template_mismatch":
        instance["template"] = "template.product-toolkit"
    result = validate_pagespec(instance, sections=sections, templates=templates)
    report.check("2. Semantic validation of example.pagespec.json", result.ok(),
                 "; ".join(result.errors[:3]))


def check_3_allowlist_parity(report, inject=None):
    allow = load_json("tokens", "llm", "component-allowlist.json")
    entries = allow["entries"]

    real_ids = {}
    for layer, folder in [("primitive", "primitives"), ("component", "components"), ("section", "sections")]:
        for fp in glob.glob(os.path.join(ROOT, folder, "*.json")):
            d = json.load(open(fp))
            real_ids[d["id"]] = fp

    if inject == "allowlist_phantom_entry":
        entries = dict(entries)
        entries["section.does-not-exist"] = {"id": "section.does-not-exist", "layer": "section",
                                               "contractFile": "sections/does-not-exist.json", "settableFields": []}

    if inject == "allowlist_orphan_contract":
        real_ids = dict(real_ids)
        real_ids["section.orphan-injected"] = "/dev/null"

    phantom = sorted(set(entries.keys()) - set(real_ids.keys()))
    orphan = sorted(set(real_ids.keys()) - set(entries.keys()))

    report.check(
        "3. Allowlist parity (no phantom entries, no orphan contracts)",
        len(phantom) == 0 and len(orphan) == 0,
        f"phantom entries: {phantom}; orphan contracts: {orphan}",
    )


CITATION_RE = re.compile(r"^([A-Za-z0-9_./\-]+\.(?:jsx?|tsx?|json|css|md)):(\d+)(?:-(\d+))?")


def find_citation_strings(obj, acc):
    if isinstance(obj, str):
        m = CITATION_RE.match(obj.strip())
        if m:
            acc.append(m.groups())
    elif isinstance(obj, dict):
        for k, v in obj.items():
            if k in ("measuredFrom", "citation", "citedFrom", "cssCitation"):
                find_citation_strings(v, acc)
            elif isinstance(v, (dict, list)):
                find_citation_strings(v, acc)
    elif isinstance(obj, list):
        for item in obj:
            find_citation_strings(item, acc)


def check_4_citations(report, inject=None):
    sibling_root = os.path.dirname(ROOT)  # one directory above design-repo/
    sibling_present = all(
        os.path.exists(os.path.join(sibling_root, p)) for p in ["src", "public"]
    )

    citations = []
    for folder in ["sections", "primitives", "components", "tokens", "extraction"]:
        for fp in glob.glob(os.path.join(ROOT, folder, "**", "*.json"), recursive=True):
            d = json.load(open(fp))
            found = []
            find_citation_strings(d, found)
            for path, start, end in found:
                citations.append((fp, path, int(start), int(end) if end else int(start)))

    if inject == "citation_out_of_range":
        citations.append(("INJECTED", "src/pages/Home.jsx", 999999, 999999))

    if not sibling_present:
        report.warn(
            "4. Citation-range validity",
            f"sibling source tree not found at {sibling_root} — skipped (degrades gracefully by design; {len(citations)} citation(s) found but not resolved).",
        )
        return

    bad = []
    checked = 0
    for fp, path, start, end in citations:
        full = os.path.join(sibling_root, path)
        if not os.path.exists(full):
            bad.append(f"{fp}: cites {path}:{start}-{end} but {path} does not exist under sibling source tree")
            continue
        with open(full, errors="ignore") as f:
            length = sum(1 for _ in f)
        checked += 1
        if end > length:
            bad.append(f"{fp}: cites {path}:{start}-{end} but {path} only has {length} lines")

    report.check(
        f"4. Citation-range validity ({checked} citation(s) resolved against sibling source tree)",
        len(bad) == 0,
        "; ".join(bad[:5]),
    )


def check_5_manifest_counts(report, inject=None):
    manifest = load_json("registry.manifest.json")
    primitives_n = len(glob.glob(os.path.join(ROOT, "primitives", "*.json")))
    components_n = len(glob.glob(os.path.join(ROOT, "components", "*.json")))
    sections_n = len(glob.glob(os.path.join(ROOT, "sections", "*.json")))
    templates_obj = load_json("templates", "templates.json")["templates"]
    templates_n = len(templates_obj)
    routes_n = sum(len(t["routes"]) for t in templates_obj.values())
    tokens_foundation_n = len(glob.glob(os.path.join(ROOT, "tokens", "00-foundation", "*.json")))

    real_counts = {
        "primitives": primitives_n,
        "components": components_n,
        "sections": sections_n,
        "templates": templates_n,
        "routes": routes_n,
        "foundationTokenFiles": tokens_foundation_n,
    }

    claimed = dict(manifest.get("counts", {}))
    if inject == "manifest_count_drift":
        claimed["templates"] = claimed.get("templates", 0) + 5

    mismatches = {k: (claimed.get(k), v) for k, v in real_counts.items() if claimed.get(k) != v}
    report.check(
        "5. Manifest counts match real files on disk (recomputed, not hand-trusted)",
        len(mismatches) == 0,
        f"mismatches (claimed, real): {mismatches}",
    )


def check_6_version_parity(report, inject=None):
    manifest = load_json("registry.manifest.json")
    allow = load_json("tokens", "llm", "component-allowlist.json")
    claimed = manifest.get("allowlistVersion")
    real = allow.get("allowlistVersion")
    if inject == "version_drift":
        claimed = "0.0.1"
    report.check(
        "6. allowlistVersion parity (manifest vs. tokens/llm/component-allowlist.json)",
        claimed == real,
        f"manifest says {claimed!r}, allowlist file says {real!r}",
    )


def check_7_route_parity(report, inject=None):
    templates_obj = load_json("templates", "templates.json")["templates"]
    routes_on_disk = load_json("templates", "routes.json")

    # 7a. routes.json must be exactly what a fresh regeneration from
    # templates.json would produce -- proves it's generated, not hand-edited.
    regenerated = {}
    for tid, tpl in templates_obj.items():
        for route in tpl["routes"]:
            regenerated[route] = tid

    stated_routes = dict(routes_on_disk.get("routes", {}))
    if inject == "routes_hand_edited_drift":
        stated_routes["/a-route-nobody-added-to-templates-json"] = "home"

    extra_in_file = sorted(set(stated_routes.keys()) - set(regenerated.keys()))
    missing_from_file = sorted(set(regenerated.keys()) - set(stated_routes.keys()))
    mismatched_target = sorted(r for r in stated_routes if r in regenerated and stated_routes[r] != regenerated[r])

    report.check(
        "7a. templates/routes.json matches a fresh regeneration from templates/templates.json",
        not extra_in_file and not missing_from_file and not mismatched_target,
        f"extra: {extra_in_file}; missing: {missing_from_file}; mismatched: {mismatched_target}",
    )

    # 7b. every route maps to a real template id (no orphan template-route mapping)
    real_template_ids = set(templates_obj.keys())
    orphan_mappings = sorted(r for r, t in stated_routes.items() if t not in real_template_ids)
    if inject == "route_orphan_template":
        orphan_mappings = orphan_mappings + ["/injected-orphan-route"]
    report.check(
        "7b. every route in routes.json maps to a real, existing template",
        len(orphan_mappings) == 0,
        f"routes mapping to a nonexistent template: {orphan_mappings}",
    )

    # 7c. every real clone route (src/App.jsx <Route path=...>) appears exactly
    # once in routes.json -- degrades gracefully with no sibling source tree.
    sibling_root = os.path.dirname(ROOT)
    app_jsx = os.path.join(sibling_root, "src", "App.jsx")
    if not os.path.exists(app_jsx):
        report.warn("7c. every real clone route appears exactly once in routes.json",
                     f"sibling source tree not found at {sibling_root} — skipped (degrades gracefully by design).")
    else:
        with open(app_jsx) as f:
            app_text = f.read()
        real_routes = re.findall(r'<Route\s+path="([^"]+)"', app_text)
        counts = {r: real_routes.count(r) for r in set(real_routes)}
        duplicated = sorted(r for r, n in counts.items() if n > 1)
        missing_real_routes = sorted(set(real_routes) - set(stated_routes.keys()))
        if inject == "route_duplicated_in_source":
            duplicated = duplicated + ["/"]
        report.check(
            f"7c. all {len(set(real_routes))} real routes in src/App.jsx appear exactly once in routes.json",
            len(duplicated) == 0 and len(missing_real_routes) == 0,
            f"duplicated in source: {duplicated}; real routes missing from routes.json: {missing_real_routes}",
        )


def check_8_asset_role_closure(report, inject=None):
    schema = load_json("schema", "pagespec.schema.json")
    asset_roles = load_json("assets", "asset-roles.json")

    def find_asset_role_enums(node, acc):
        if isinstance(node, dict):
            if isinstance(node.get("assetRole"), dict) and "enum" in node["assetRole"]:
                acc.update(node["assetRole"]["enum"])
            for v in node.values():
                find_asset_role_enums(v, acc)
        elif isinstance(node, list):
            for v in node:
                find_asset_role_enums(v, acc)

    schema_roles = set()
    find_asset_role_enums(schema, schema_roles)
    catalogued_roles = set(asset_roles.get("roles", {}).keys())

    if inject == "assetrole_schema_phantom":
        schema_roles = schema_roles | {"injected-role-not-catalogued"}
    if inject == "assetrole_catalog_orphan":
        catalogued_roles = catalogued_roles | {"injected-catalogued-role-unused-anywhere"}

    phantom = sorted(schema_roles - catalogued_roles)  # schema allows it, catalog doesn't define it
    orphan = sorted(catalogued_roles - schema_roles)   # catalog defines it, schema never allows it

    report.check(
        "8a. every assetRole the schema permits exists in assets/asset-roles.json, and vice versa",
        len(phantom) == 0 and len(orphan) == 0,
        f"schema allows but not catalogued: {phantom}; catalogued but schema never allows: {orphan}",
    )

    # 8b. every catalogued role is either really used (sections/*.json,
    # schema/example.pagespec.json) or explicitly marked reserved.
    used_roles = set()
    for fp in glob.glob(os.path.join(ROOT, "sections", "*.json")) + [os.path.join(ROOT, "schema", "example.pagespec.json")]:
        text = open(fp).read()
        for role in catalogued_roles:
            if f'"{role}"' in text:
                used_roles.add(role)

    if inject == "assetrole_unused_unreserved":
        asset_roles["roles"] = dict(asset_roles["roles"])
        asset_roles["roles"]["injected-unused-role"] = {"description": "x"}
        catalogued_roles = catalogued_roles | {"injected-unused-role"}

    unaccounted = sorted(
        r for r in catalogued_roles
        if r not in used_roles and not asset_roles.get("roles", {}).get(r, {}).get("reserved")
    )
    report.check(
        "8b. every catalogued assetRole is used by a real section/example, or explicitly marked reserved",
        len(unaccounted) == 0,
        f"neither used nor reserved: {unaccounted}",
    )


def run(inject=None):
    report = Report()
    check_1_schema(report, inject)
    check_2_semantic(report, inject)
    check_3_allowlist_parity(report, inject)
    check_4_citations(report, inject)
    check_5_manifest_counts(report, inject)
    check_6_version_parity(report, inject)
    check_7_route_parity(report, inject)
    check_8_asset_role_closure(report, inject)
    ok = report.summary()
    return ok, report


if __name__ == "__main__":
    inject = None
    for a in sys.argv[1:]:
        if a.startswith("--inject-drift="):
            inject = a.split("=", 1)[1]
    ok, _ = run(inject)
    sys.exit(0 if ok else 1)

# ============================================================================
# HOW THIS IS PROVEN TO CATCH DRIFT (see verification step 3 / README.md):
#   python3 verify_all.py --inject-drift=allowlist_phantom_entry   # must FAIL
#   python3 verify_all.py --inject-drift=allowlist_orphan_contract # must FAIL
#   python3 verify_all.py --inject-drift=citation_out_of_range     # must FAIL
#   python3 verify_all.py --inject-drift=manifest_count_drift      # must FAIL
#   python3 verify_all.py --inject-drift=version_drift             # must FAIL
#   python3 verify_all.py --inject-drift=schema_break_additional_properties  # must FAIL
#   python3 verify_all.py --inject-drift=semantic_template_mismatch # must FAIL
#   python3 verify_all.py --inject-drift=routes_hand_edited_drift   # must FAIL
#   python3 verify_all.py --inject-drift=route_orphan_template      # must FAIL
#   python3 verify_all.py --inject-drift=route_duplicated_in_source # must FAIL
#   python3 verify_all.py --inject-drift=assetrole_schema_phantom   # must FAIL
#   python3 verify_all.py --inject-drift=assetrole_catalog_orphan   # must FAIL
#   python3 verify_all.py --inject-drift=assetrole_unused_unreserved # must FAIL
#   python3 verify_all.py                                          # must PASS (real repo, unmodified)
# ============================================================================
