# Changelog

## 1.1.0 — structured `responsive` field (Situation B: targeted fix pass)

Closes the one flagged gap from the prior independent re-verification: this
design-repo previously asserted responsive behavior (desktop/tablet/mobile)
only in section `purpose` prose and `measuredFrom` citations, with no
structured, per-section field a generator could actually read — exactly the
MASTER-GUIDE.md §3.7 pattern.

- Added a new closed `responsive` object to every one of the 44
  `sections/*.json` contracts, each grounded in a fresh `grep` of real
  Tailwind responsive classes (`min-[Npx]:`, `md:`, `lg:`, `sm:`,
  `hidden`/`block` toggles) inside that section's own `measuredFrom` range in
  the sibling `src/` tree. 37 sections carry one or more structured
  `breakpoints` entries (`layoutChange` + `description` + its own `file:line`
  citation); the 7 sections whose cited range has zero responsive classes
  (`metrics-chart-panel`, `metrics-how-we-measure`, `metrics-quality-scatter`,
  `notfound-body`, `page-header-simple`, `runtime-features`,
  `toolkit-pipeline`) are marked `noResponsiveChange: true` with a citation to
  the exact grepped range as evidence of absence, rather than left unfielded.
- Wired the field through the machine-checked contract layers, not just
  documentation: closed `definitions.responsive` /
  `definitions.responsiveBreakpointChange` / `definitions.responsiveLayoutChange`
  added to `schema/pagespec.schema.json` (breakpoint keys closed to the real
  set in `tokens/00-foundation/breakpoint.json`; `layoutChange` closed to an
  11-value enum derived entirely from what was actually observed), added as a
  `required` property on every one of the 44 node `oneOf` branches, and
  bundled into `schema/example.pagespec.json` for all 10 nodes it uses — the
  example still validates with 0 errors.
- Extended `schema/semantic_validate.py` with `RESPONSIVE_FIELD_REQUIRED`,
  `RESPONSIVE_INVALID_BREAKPOINT_KEY`, `RESPONSIVE_CONSISTENCY` (the
  `noResponsiveChange`/`breakpoints`/`citation` fields must agree with each
  other), and `RESPONSIVE_CONTRACT_MISMATCH` (an instance's `responsive`
  block must match its section's own evidence-grounded contract exactly — a
  generator must carry the real fact through, not invent a plausible
  substitute).
- Checked `tokens/llm/component-allowlist.json` against the schema before
  changing it: `responsive`, like `motion`, is fixed evidence a generator
  must reproduce rather than free-text content it authors, so — consistent
  with `motion` already not appearing in any entry's `settableFields` — no
  allowlist entry was added for it. `extraction/verify_all.py`'s allowlist
  parity check (id-level, not field-level) is unaffected and still passes.
- Documented the new field's evidence methodology in
  `extraction/measured-values.json` (`responsiveFieldEvidence`): which
  breakpoint keys were used, which one (`shell-1240`) was not, and why.
- Added 6 new adversarial cases to `schema/tests/adversarial_test.py`
  (missing required `responsive`, invented breakpoint key, invented
  `layoutChange` enum value, invented top-level field on `responsive` itself,
  `noResponsiveChange`/`breakpoints` internal inconsistency, and a fabricated
  `responsive` block that diverges from the section's real contract) — all
  rejected as expected. Updated the adversarial suite's generic
  per-template control-instance builder (`minimal_responsive_for`) so every
  auto-synthesized control instance also carries its section's real
  `responsive` block, keeping all 26 per-template control checks (13
  templates × schema + semantic) passing without hand-written per-template
  code. New total: 50 checks, 50 passing (26 template controls + 2 example
  controls + 16 pre-existing adversarial rejections + 6 new responsive-field
  adversarial rejections).
- `grep -rn "responsive"` run across the whole repo after this change (not
  just the files this pass touched) to confirm no stale/half-updated
  reference remained; `compatibility/graph.json` has no rule text describing
  responsive behavior (rhythm rules there are unrelated to breakpoints), so
  no graph update was needed.
- Bumped `pageSpecVersion` and `repositoryVersion` to `1.1.0` in
  `registry.manifest.json` and `schema/example.pagespec.json` (both
  documentation-only fields per `versionFieldNote`). Left `allowlistVersion`
  at `1.0.0` since `component-allowlist.json`'s actual content did not
  change — verified `extraction/verify_all.py` check #6 (allowlistVersion
  parity) still passes.
- Re-ran all 4 mandatory verification steps (schema validation,
  adversarial suite, self-containment in an isolated temp dir, fresh zip
  cleanliness) and all 7 of `extraction/verify_all.py`'s
  `--inject-drift=<name>` self-tests, confirming each still fails exactly
  the injected case and nothing else.

## 1.0.0 — initial build (Situation A: from scratch)

- Built the full design-repo from a clean slate: no prior `ia.json`, `IA.md`,
  `matrix.csv`, `CONTRACTS.md`, `.agent-brief.md`, `CLONE_SPEC.md`, or
  `asset-manifest*` existed anywhere in the project before this build.
- Investigated all 13 real routes / 12 distinct page components directly
  against `src/App.jsx` and every file in `src/pages/*.jsx`; independently
  verified the page-shape classification hypothesis rather than assuming it
  (see `extraction/measured-values.json` → `pageShapeClassification`) —
  confirmed the two product pages (`/conversion-optimization-toolkit`,
  `/inference-runtime`) diverge in real section order and kept them as two
  templates rather than one shared shape.
- Derived all foundation tokens (color, typography, spacing, breakpoint,
  motion, icon-size, elevation) from `tailwind.config.js` and `src/index.css`
  directly — no invented values.
- Built 44 section contracts, one per distinct real section type observed
  across every page, each with a `maxWords` budget on text fields,
  `additionalProperties:false`-shaped content, real constraints
  (`onePerPage`, `mustBeFirst`, `mustBeLastBeforeFooter`, `*RouteOnly`), and a
  motion pattern cross-checked against real `Reveal`/`useInView` usage
  (correcting an initial default-generated assumption that every hero section
  used scroll-reveal — `hero-home`, `hero-product`, and `hero-chat-mac`'s
  static entrance were verified against real JSX and corrected to
  `motion.pattern: "none"`).
- Built a closed `assetRole` enum (`tokens/llm/asset-roles.json`) wired
  through the schema's node `oneOf` branches, the allowlist, and the example
  instance, with explicit AI-generation and licensing guidance for every
  role — treating the real-company nature of the source (`trymirai.com` /
  Mirai Labs) as a compliance requirement.
- Built `schema/semantic_validate.py` to cross-reference a PageSpec's
  declared `template` against that template's own required node sequence
  (not `nodes[]` in isolation) — the single most repeated bug class in prior
  design-repo builds per the workspace's `MASTER-GUIDE.md` §3.3.
- Built `extraction/verify_all.py` with six checks, two of them
  drift-proofed per `--inject-drift=<name>` scenarios, each independently
  proven to fail on injected drift and pass on the real, unmodified repo:
  allowlist parity, citation-range validity (degrades gracefully — warns,
  does not fail — with no sibling source tree present), manifest-counts
  recomputation, and allowlist-version parity.
- Built `schema/tests/adversarial_test.py`: 27 control checks (bundled
  example + one auto-synthesized minimal instance per real template, proving
  the generic per-template control loop needs no hand-written code per
  template) and 17 adversarial rejections spanning schema-layer, structural,
  and runtime (`maxWords`) mutation categories — all 44 checks pass.
- Fixed 6 out-of-range citations found by the citation-validity check itself
  during the build (`runtime-features.json`, `closing-home.json`,
  `metrics-quality-scatter.json`, `model-family-list.json`,
  `framed-screenshot.json`, `metrics-how-we-measure.json`) — each was a few
  lines past the real file's actual length; corrected against the real file's
  measured line count, not guessed.
- Noted, but did not silently normalize: the source project folder was
  renamed on disk from `datashake` to `Mirai` partway through this build
  session by an external, concurrent process. All work after that point
  targeted the project's current real location; no content in this
  design-repo references either folder name by absolute path
  (`grep -rn "/Users/"` returns nothing).
