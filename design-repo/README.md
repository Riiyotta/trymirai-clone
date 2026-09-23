# Mirai Labs clone — design-repo

An AI-ready, machine-validated PageSpec system built from the `trymirai-clone`
project: a React 18.3.1 + Vite 5.4.11 + react-router-dom 6.30.6 + Tailwind CSS
3.4.17 local reference clone of the live marketing site of Mirai Labs, an
on-device AI inference company. Every token, section contract, and template here cites
real evidence from the source project — see `extraction/measured-values.json`
for the full citation ledger.

**This is a reference clone of a real, live company.** Content, branding and
design belong to Mirai Labs. The wordmark and the closing/careers orbital
marks are deliberately neutral placeholders, not real Mirai Labs brand art —
see `tokens/llm/asset-roles.json` for the full, closed asset-role registry and
its AI-generation / licensing guidance, which explicitly bans reproducing real
Mirai Labs branding, real investor/team logos, or real third-party company
logos in generated output.

## Status

- `registry.manifest.json`: `status: "design-review-pending"`, `productionApproved: false`.
- Built fresh from scratch (Situation A — no prior design-repo existed for this project).

## Counts (recomputed from disk; see `extraction/verify_all.py` check #5)

| | Count |
|---|---:|
| Foundation token files | 7 |
| Primitives | 10 |
| Components | 8 |
| Sections | 44 |
| Templates | 13 |
| Routes covered | 14 (13 real routes + the `*` catch-all) |

## Route → template mapping

| Route(s) | Template |
|---|---|
| `/` | `template.home` |
| `/conversion-optimization-toolkit` | `template.product-toolkit` |
| `/inference-runtime` | `template.product-runtime` |
| `/chat-for-mac` | `template.chat-mac` |
| `/i-am-interested` | `template.contact` |
| `/local-models` | `template.local-models` |
| `/metrics` | `template.metrics` |
| `/about-us` | `template.about` |
| `/careers` | `template.careers` |
| `/blog` | `template.blog-index` |
| `/blog/:slug` | `template.blog-post` |
| `/privacy-policy`, `/terms-of-use` | `template.legal` |
| `*` | `template.not-found` |

13 templates cover all 13 real routes plus the catch-all — every real route is
mapped to exactly one template, verified 1:1 with no gaps and no
double-assignment. The two product pages (`/conversion-optimization-toolkit`
and `/inference-runtime`) share several components (`PerfectFor`, `BenchStrip`,
`ModelCards`, `Faq`, `ClosingBand`, all from `src/components/Shared.jsx`) but
their real section ORDER diverges, so they are kept as two distinct templates
rather than forced into one shape — see
`extraction/measured-values.json` → `pageShapeClassification`.

## Responsive coverage

Every one of the 44 `sections/*.json` contracts carries a structured
`responsive` field (`schema/pagespec.schema.json` → `definitions.responsive`),
not just prose — a generator can read it directly. It is keyed to the real,
closed breakpoint set in `tokens/00-foundation/breakpoint.json`
(`sm-640`, `md-768`, `nav-810`, `lg-1024`, `product-1200`; `shell-1240` is
defined there but no section content change was found keyed to it) and
describes *what changes* (`layoutChange`: e.g. `column-to-row`,
`grid-column-count-change`, `nav-collapse-to-menu`, `hidden-below-breakpoint`,
`font-size-shift` — see the full 11-value enum in the schema) with a real
`file:line` citation per entry. 37 sections have one or more real breakpoint
entries; 7 (`metrics-chart-panel`, `metrics-how-we-measure`,
`metrics-quality-scatter`, `notfound-body`, `page-header-simple`,
`runtime-features`, `toolkit-pipeline`) are marked `noResponsiveChange: true`
with a citation to the grepped range proving no responsive class exists there
— a measured absence, not an omission. See `extraction/measured-values.json`
→ `responsiveFieldEvidence` for the full methodology, and
`schema/semantic_validate.py`'s `RESPONSIVE_*` rules for how a PageSpec
instance is cross-checked against each section's own evidence.

## Known fidelity gaps (cited from the source project's own build docs)

This design-repo describes what is **actually built** in the source project,
not Mirai Labs' live marketing site. Per the source project's own `README.md`
("Page fidelity at 1440px"):

- `/inference-runtime` ships 8 of the original live site's 10 sections (first-build fidelity 60%).
- `/conversion-optimization-toolkit` is similarly condensed (first-build fidelity 62%).
- `/about-us` and `/local-models` had structural bugs that were found and fixed
  during the source project's own QA pass (see `extraction/measured-values.json`).

`templates/templates.json` carries a `knownGap` field on the two templates
this affects, quoting the source project's own documentation rather than
silently assuming 100% parity with the live original.

## Verification

Run all four mandatory checks from anywhere with Python 3 + `jsonschema` installed:

```bash
# 1 + 2 + 3 + 5 + 6 in one pass (schema, semantic, allowlist parity, manifest counts, version parity)
python3 extraction/verify_all.py

# adversarial suite (schema-layer, structural, and maxWords rejections + per-template controls)
python3 schema/tests/adversarial_test.py

# citation-validity drift proof (each must FAIL; only the unmodified run passes)
python3 extraction/verify_all.py --inject-drift=allowlist_phantom_entry
python3 extraction/verify_all.py --inject-drift=citation_out_of_range
python3 extraction/verify_all.py --inject-drift=manifest_count_drift
python3 extraction/verify_all.py --inject-drift=version_drift
```

## Folder-name note

The source project's folder was renamed on disk from `datashake` to `Mirai`
partway through this design-repo's build session (an external, concurrent
change — see `CHANGELOG.md`). This design-repo was built against, and now
lives inside, the project's current real location. No content in this
design-repo references either folder name (see the self-containment rule
below).

## Self-containment

`registry.manifest.json`'s `entryPoints` list only files inside this
`design-repo/` folder — never `../` paths to the sibling source tree.
`extraction/measured-values.json` holds the citation trail to that sibling
source tree and degrades gracefully (warns, does not fail `verify_all.py`)
when no sibling source tree is present, e.g. after this folder is zipped and
handed to someone standalone. `grep -rn "/Users/" .` across this whole folder
returns nothing.
