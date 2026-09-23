#!/usr/bin/env python3
"""
Adversarial test suite for the Mirai Labs clone design-repo.

For every rule enforced by pagespec.schema.json (Draft-07) and
schema/semantic_validate.py, constructs a mutated instance that must be
REJECTED, and proves it is. Also asserts the CONTROL cases:
  - the unmutated bundled example validates with 0 errors
  - a minimal synthetic instance for every real template in
    templates/templates.json validates with 0 errors

Path portability: repo root derived from this file's own location.

Usage: python3 tests/adversarial_test.py
Exit code 0 iff every check (positive and negative) behaved as expected.
"""
import copy
import json
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT))

from jsonschema import Draft7Validator  # noqa: E402
from semantic_validate import validate_pagespec, load_sections  # noqa: E402

SCHEMA = json.load(open(os.path.join(ROOT, "pagespec.schema.json")))
EXAMPLE = json.load(open(os.path.join(ROOT, "example.pagespec.json")))
TEMPLATES = json.load(open(os.path.join(ROOT, "..", "templates", "templates.json")))["templates"]
SECTIONS = load_sections()

failures = []
passes = 0


def schema_valid(instance):
    v = Draft7Validator(SCHEMA)
    return len(list(v.iter_errors(instance))) == 0


def semantic_valid(instance):
    return validate_pagespec(instance, sections=SECTIONS, templates=TEMPLATES).ok()


def check(name, condition):
    global passes
    if condition:
        passes += 1
    else:
        failures.append(name)
    print(("PASS" if condition else "FAIL"), "-", name)


# ============================================================
# CONTROL CASES — must all pass
# ============================================================
check("control: bundled example passes JSON Schema", schema_valid(EXAMPLE))
check("control: bundled example passes semantic validator", semantic_valid(EXAMPLE))


def minimal_content_for(section_id):
    sec = SECTIONS[section_id]
    content = {}
    for fname, fspec in sec.get("content", {}).items():
        if not fspec.get("required"):
            continue
        t = fspec.get("type", "string")
        if t == "string":
            words = ["word"] * min(3, fspec.get("maxWords", 3) or 3)
            content[fname] = " ".join(words)
        elif t == "integer":
            content[fname] = 1
        elif t == "boolean":
            content[fname] = True
        elif t == "array":
            minitems = fspec.get("minItems", 1) or 1
            item_fields = fspec.get("itemFields")
            if item_fields:
                item = {}
                for k, kfspec in item_fields.items():
                    item[k] = "word"
                content[fname] = [item for _ in range(minitems)]
            else:
                content[fname] = ["item" for _ in range(minitems)]
        elif t == "object":
            fields = fspec.get("fields", {})
            content[fname] = {k: "word" for k in fields}
        else:
            content[fname] = "value"
    return content


def minimal_motion_for(section_id):
    sec = SECTIONS[section_id]
    m = sec.get("motion", {})
    pattern = m.get("pattern", "none")
    fallback = m.get("reducedMotionFallback") or "n/a"
    return {"pattern": pattern, "reducedMotionFallback": fallback}


def minimal_responsive_for(section_id):
    """The structured `responsive` field is evidence-grounded, real-fact data, not
    generator-authored content — a valid instance must carry the section contract's
    own responsive block through unchanged (see RESPONSIVE_CONTRACT_MISMATCH)."""
    sec = SECTIONS[section_id]
    return copy.deepcopy(sec["responsive"])


def build_minimal_pagespec(tpl_short, tpl):
    """Synthesize one minimal, valid PageSpec instance for a given template,
    using each required node's own minimal-required content. Repeatable nodes
    get exactly their minCount (or 1)."""
    nodes = []
    for tn in tpl["nodes"]:
        sid = tn["section"]
        reps = 1
        if tn.get("repeatable"):
            reps = tn.get("minCount", 1) or 1
        for _ in range(reps):
            nodes.append({
                "section": sid,
                "content": minimal_content_for(sid),
                "motion": minimal_motion_for(sid),
                "responsive": minimal_responsive_for(sid),
            })
    return {
        "pageSpecId": f"control.{tpl_short}",
        "pageSpecVersion": "1.0.0",
        "route": tpl["routes"][0],
        "template": f"template.{tpl_short}",
        "meta": {"title": "Control instance", "description": "Synthetic control instance for adversarial-suite coverage."},
        "nodes": nodes,
    }


# CONTROL: one minimal instance per real template — proves the generic loop
# auto-covers every template without per-template hand-written control code
# (see MASTER-GUIDE.md §3.22's reusable technique).
for tpl_short, tpl in TEMPLATES.items():
    inst = build_minimal_pagespec(tpl_short, tpl)
    ok_schema = schema_valid(inst)
    ok_sem = semantic_valid(inst)
    check(f"control: minimal synthetic instance for template.{tpl_short} passes schema", ok_schema)
    check(f"control: minimal synthetic instance for template.{tpl_short} passes semantic validator", ok_sem)

# ============================================================
# ADVERSARIAL CASES — must all be REJECTED
# ============================================================

# --- Schema-layer mutations ---

# 1. Wrong enum value for template
m = copy.deepcopy(EXAMPLE)
m["template"] = "template.does-not-exist"
check("adversarial: invented template enum value is rejected (schema)", not schema_valid(m))

# 2. Missing required top-level field
m = copy.deepcopy(EXAMPLE)
del m["route"]
check("adversarial: missing required 'route' field is rejected (schema)", not schema_valid(m))

# 3. Invented node type / unknown section id
m = copy.deepcopy(EXAMPLE)
m["nodes"][1] = {
    "section": "section.invented-hero-type",
    "content": {},
    "motion": {"pattern": "none", "reducedMotionFallback": "n/a"},
}
check("adversarial: invented section id is rejected (schema oneOf)", not schema_valid(m))

# 4. Missing reducedMotionFallback on a section that requires motion
m = copy.deepcopy(EXAMPLE)
del m["nodes"][2]["motion"]["reducedMotionFallback"]
check("adversarial: missing reducedMotionFallback is rejected (schema — required field)", not schema_valid(m))

# 5. additionalProperties smuggling on content
m = copy.deepcopy(EXAMPLE)
m["nodes"][1]["content"]["inventedField"] = "smuggled"
check("adversarial: invented content field is rejected (schema additionalProperties:false)", not schema_valid(m))

# 6. additionalProperties smuggling on motion
m = copy.deepcopy(EXAMPLE)
m["nodes"][1]["motion"]["inventedAnimation"] = "spin"
check("adversarial: invented motion field is rejected (schema additionalProperties:false, MASTER-GUIDE §3.7)", not schema_valid(m))

# 7. Invalid motion pattern enum
m = copy.deepcopy(EXAMPLE)
m["nodes"][1]["motion"]["pattern"] = "not-a-real-pattern"
check("adversarial: invented motion pattern is rejected (schema enum)", not schema_valid(m))

# --- Structural (semantic_validate.py) mutations ---

# 8. Duplicate a onePerPage section
m = copy.deepcopy(EXAMPLE)
m["nodes"].insert(2, copy.deepcopy(m["nodes"][1]))  # duplicate hero-home
check("adversarial: duplicated onePerPage section is rejected (semantic ONE_PER_PAGE)", not semantic_valid(m))

# 9. Remove a mandatory section (drop closing-home)
m = copy.deepcopy(EXAMPLE)
m["nodes"] = [n for n in m["nodes"] if n["section"] != "section.closing-home"]
check("adversarial: removed mandatory section is rejected (semantic TEMPLATE_NODE_MATCH / MISSING_REQUIRED_SECTION)", not semantic_valid(m))

# 10. Reorder a fixed-position section (move closing-home before hero-home)
m = copy.deepcopy(EXAMPLE)
closing = [n for n in m["nodes"] if n["section"] == "section.closing-home"][0]
rest = [n for n in m["nodes"] if n["section"] != "section.closing-home"]
m["nodes"] = [rest[0], closing] + rest[1:]
check("adversarial: reordered fixed-position section is rejected (semantic TEMPLATE_NODE_MATCH / MUST_BE_LAST_BEFORE_FOOTER)", not semantic_valid(m))

# 11. Template/node-sequence mismatch: declare template.home but ship product-toolkit's nodes
m = copy.deepcopy(EXAMPLE)
m["template"] = "template.product-toolkit"
check("adversarial: template/node-sequence mismatch is rejected (semantic TEMPLATE_NODE_MATCH)", not semantic_valid(m))

# 12. Route restriction violation: homeRouteOnly section used on a different route
m = copy.deepcopy(EXAMPLE)
m["route"] = "/careers"
check("adversarial: homeRouteOnly section used under a mismatched route is rejected (semantic ROUTE_RESTRICTION)", not semantic_valid(m))

# 13. Shell boundary violation: navbar not first
m = copy.deepcopy(EXAMPLE)
m["nodes"] = m["nodes"][1:] + [m["nodes"][0]]
check("adversarial: navbar not first / footer not last is rejected (semantic SHELL_BOUNDARIES)", not semantic_valid(m))

# --- Runtime: maxWords overflow ---

# 14. maxWords overflow on a real field
m = copy.deepcopy(EXAMPLE)
overflow_headline = " ".join(["word"] * 40)  # hero-home.headline budget is 14
for n in m["nodes"]:
    if n["section"] == "section.hero-home":
        n["content"]["headline"] = overflow_headline
check("adversarial: maxWords overflow on a real field is rejected (semantic MAXWORDS_BUDGET)", not semantic_valid(m))

# 15. Repeat-count violation: metrics-chart-panel repeated beyond template maxCount
metrics_tpl = TEMPLATES["metrics"]
base = build_minimal_pagespec("metrics", metrics_tpl)
extra_panel = copy.deepcopy([n for n in base["nodes"] if n["section"] == "section.metrics-chart-panel"][0])
m = copy.deepcopy(base)
insert_at = max(i for i, n in enumerate(m["nodes"]) if n["section"] == "section.metrics-chart-panel") + 1
m["nodes"].insert(insert_at, extra_panel)
check("adversarial: repeatable section exceeding template maxCount is rejected (semantic REPEAT_COUNT_TOO_HIGH)", not semantic_valid(m))

# 16. Non-repeatable section duplicated
m = copy.deepcopy(EXAMPLE)
dup = copy.deepcopy(m["nodes"][3])  # appgrid, not repeatable
m["nodes"].insert(4, dup)
check("adversarial: non-repeatable section duplicated is rejected (semantic NON_REPEATABLE_DUPLICATED / TEMPLATE_NODE_MATCH)", not semantic_valid(m))

# --- Responsive field mutations (MASTER-GUIDE §3.7) ---

# 17. Missing required 'responsive' field
m = copy.deepcopy(EXAMPLE)
del m["nodes"][1]["responsive"]
check("adversarial: missing required 'responsive' field is rejected (schema)", not schema_valid(m))

# 18. Invented/extra responsive breakpoint key
m = copy.deepcopy(EXAMPLE)
m["nodes"][1]["responsive"]["breakpoints"]["xl-1440"] = {
    "layoutChange": "spacing-shift",
    "description": "invented breakpoint",
    "citation": "nowhere",
}
check(
    "adversarial: invented responsive breakpoint key is rejected (schema additionalProperties:false, MASTER-GUIDE §3.7)",
    not schema_valid(m),
)

# 19. Invented layoutChange enum value inside a real breakpoint
m = copy.deepcopy(EXAMPLE)
real_bp = next(iter(m["nodes"][1]["responsive"]["breakpoints"]))
m["nodes"][1]["responsive"]["breakpoints"][real_bp]["layoutChange"] = "teleport-in"
check("adversarial: invented responsive layoutChange enum value is rejected (schema enum)", not schema_valid(m))

# 20. Invented field smuggled into the responsive object itself
m = copy.deepcopy(EXAMPLE)
m["nodes"][1]["responsive"]["extraFlag"] = True
check("adversarial: invented top-level responsive field is rejected (schema additionalProperties:false)", not schema_valid(m))

# 21. noResponsiveChange/breakpoints internal inconsistency
m = copy.deepcopy(EXAMPLE)
m["nodes"][1]["responsive"]["noResponsiveChange"] = True
check(
    "adversarial: noResponsiveChange=true with non-empty breakpoints is rejected (semantic RESPONSIVE_CONSISTENCY)",
    not semantic_valid(m),
)

# 22. Fabricated responsive block that diverges from the section contract's real evidence
m = copy.deepcopy(EXAMPLE)
m["nodes"][1]["responsive"] = {
    "noResponsiveChange": False,
    "breakpoints": {
        "lg-1024": {
            "layoutChange": "font-size-shift",
            "description": "made up, does not match the real contract",
            "citation": "src/pages/AboutUs.jsx:1",
        }
    },
}
check(
    "adversarial: responsive block diverging from the section's own evidence-grounded contract is rejected "
    "(semantic RESPONSIVE_CONTRACT_MISMATCH)",
    not semantic_valid(m),
)

# ============================================================
print()
print(f"{passes} passed, {len(failures)} failed out of {passes + len(failures)} checks.")
if failures:
    print("FAILURES:")
    for f in failures:
        print(" -", f)
    sys.exit(1)
sys.exit(0)
