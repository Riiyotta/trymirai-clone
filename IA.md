# Local codebase at /Users/riyaghosh/V2 cloned/Mirai — a React 18 + Vite 5 + Tailwind v3 reference clone of the live site trymirai.com (Mirai Labs). Content, branding and design belong to Mirai Labs; this IA documents the clone's own code structure, not a page it owns rights to (see design-repo/registry.manifest.json's sourceProject note and README.md).

Source: Local codebase at /Users/riyaghosh/V2 cloned/Mirai — a React 18 + Vite 5 + Tailwind v3 reference clone of the live site trymirai.com (Mirai Labs). Content, branding and design belong to Mirai Labs; this IA documents the clone's own code structure, not a page it owns rights to (see design-repo/registry.manifest.json's sourceProject note and README.md). · measured directly from src/App.jsx and src/pages/*.jsx in this repo, cross-checked against design-repo/templates/templates.json
Status: **measured-from-repo** · production approved: **false**
14 routes · 13 templates · 44 unique sections

> Generated from `ia.json` by `build.mjs`. Edit the JSON, not this file.

## Shape of the site

The largest 3 templates (Legal (privacy policy / terms of use), Home, Product page — conversion & optimization toolkit) account for 4 of 14 routes (29%). The remaining 10 routes span 10 templates.

| template | routes | share |
|---|---:|---:|
| Legal (privacy policy / terms of use) | 2 | 14% |
| Home | 1 | 7% |
| Product page — conversion & optimization toolkit | 1 | 7% |
| Product page — inference runtime | 1 | 7% |
| Chat for Mac (macOS app landing page) | 1 | 7% |
| Contact / interest form | 1 | 7% |
| Local models library | 1 | 7% |
| Benchmarks / metrics | 1 | 7% |
| About us | 1 | 7% |
| Careers | 1 | 7% |
| Research / blog index | 1 | 7% |
| Research / blog post | 1 | 7% |
| 404 / not found | 1 | 7% |

## Page chrome

**14 routes carry chrome = `full`** — Home, Product page — conversion & optimization toolkit, Product page — inference runtime, Chat for Mac (macOS app landing page), Contact / interest form, Local models library, Benchmarks / metrics, About us, Careers, Research / blog index, Research / blog post, Legal (privacy policy / terms of use), 404 / not found.

## Sections by reuse

How widely a section is shared determines whether it belongs in a shared
component library or stays local to its page.

| section | category | templates | routes | implementation | scope |
|---|---|---:|---:|---|---|
| `shell.navbar` | SHELL | 13 | 14 | `src/components/Navbar.jsx` | All 14 routes (13 real routes + the 404 catch-all). |
| `shell.footer` | SHELL | 13 | 14 | `src/components/Footer.jsx` | All 14 routes (13 real routes + the 404 catch-all). |
| `hero.product` | HERO | 2 | 2 | `src/pages/ConversionToolkit.jsx:94-138 and src/pages/InferenceRuntime.jsx:210-243` | The 2 product routes: /conversion-optimization-toolkit and /inference-runtime. |
| `hero.page-header-simple` | HERO | 2 | 2 | `src/pages/Interested.jsx:57-59 and src/pages/LocalModels.jsx:143-145` | The 2 routes /i-am-interested and /local-models. |
| `proof.bench-strip` | PROOF | 2 | 2 | `src/components/Shared.jsx:196-260, 326-359` | The 2 product routes: /conversion-optimization-toolkit and /inference-runtime. |
| `proof.model-cards` | PROOF | 2 | 2 | `src/components/Shared.jsx:366-390 (ModelCards)` | The 2 product routes: /conversion-optimization-toolkit and /inference-runtime. |
| `content.perfect-for` | CONTENT | 2 | 2 | `src/components/Shared.jsx:167-193 (PerfectFor)` | The 2 product routes: /conversion-optimization-toolkit and /inference-runtime. |
| `content.faq` | CONTENT | 2 | 2 | `src/components/Shared.jsx:203-241 (Faq)` | The 2 product routes: /conversion-optimization-toolkit and /inference-runtime. |
| `cta.closing-band` | CTA | 2 | 2 | `src/components/Shared.jsx:395-429 (ClosingBand)` | The 2 product routes: /conversion-optimization-toolkit and /inference-runtime. |
| `content.legal-body` | CONTENT | 1 | 2 | `src/pages/Legal.jsx:10-32 (LegalPage)` | The 2 legal routes: /privacy-policy and /terms-of-use. |
| `hero.home` | HERO | 1 | 1 | `src/components/Hero.jsx` | Home route only (/). |
| `hero.chat-mac` | HERO | 1 | 1 | `src/pages/ChatForMac.jsx:23-66` | /chat-for-mac only. |
| `hero.about` | HERO | 1 | 1 | `src/pages/AboutUs.jsx:79-88` | /about-us only. |
| `hero.blog-header` | HERO | 1 | 1 | `src/pages/Blog.jsx:20-26 (BlogIndex)` | /blog only. |
| `hero.metrics-header` | HERO | 1 | 1 | `src/pages/Metrics.jsx:112-119` | /metrics only. |
| `hero.page-header-centered` | HERO | 1 | 1 | `src/pages/Careers.jsx:40-47` | /careers only. |
| `features.appgrid` | FEATURES | 1 | 1 | `src/components/AppGrid.jsx` | Home route only. |
| `features.speed` | FEATURES | 1 | 1 | `src/components/Speed.jsx` | Home route only. |
| `features.execution-stack` | FEATURES | 1 | 1 | `src/components/ExecutionStack.jsx` | Home route only. |
| `features.cloud-vs-device` | FEATURES | 1 | 1 | `src/components/CloudVsDevice.jsx` | Home route only. |
| `features.co-design` | FEATURES | 1 | 1 | `src/components/CoDesign.jsx` | Home route only. |
| `features.full-stack` | FEATURES | 1 | 1 | `src/components/FullStack.jsx` | Home route only. |
| `features.toolkit-convert-cards` | FEATURES | 1 | 1 | `src/pages/ConversionToolkit.jsx:99-227` | /conversion-optimization-toolkit only. |
| `features.toolkit-pipeline` | FEATURES | 1 | 1 | `src/pages/ConversionToolkit.jsx:70-73, 229-247` | /conversion-optimization-toolkit only. |
| `features.runtime-install-steps` | FEATURES | 1 | 1 | `src/pages/InferenceRuntime.jsx:157-207, 295-352` | /inference-runtime only. |
| `features.runtime-install-matrix` | FEATURES | 1 | 1 | `src/pages/InferenceRuntime.jsx:354-386` | /inference-runtime only. |
| `features.runtime-features` | FEATURES | 1 | 1 | `src/pages/InferenceRuntime.jsx:388-429` | /inference-runtime only. |
| `features.framed-screenshot` | FEATURES | 1 | 1 | `src/pages/ChatForMac.jsx:68-91` | /chat-for-mac only. |
| `proof.metrics-sidebar-nav` | PROOF | 1 | 1 | `src/pages/Metrics.jsx:100, 127-141` | /metrics only. |
| `proof.metrics-chart-panel` | PROOF | 1 | 1 | `src/pages/Metrics.jsx:60-96` | /metrics only, 3 instances per page. |
| `proof.metrics-quality-scatter` | PROOF | 1 | 1 | `src/pages/Metrics.jsx:172-185` | /metrics only. |
| `proof.metrics-how-we-measure` | PROOF | 1 | 1 | `src/pages/Metrics.jsx:164-179` | /metrics only. |
| `proof.model-family-list` | PROOF | 1 | 1 | `src/pages/LocalModels.jsx:15-134` | /local-models only. |
| `content.about-prose-block` | CONTENT | 1 | 1 | `src/pages/AboutUs.jsx:32-70, 93-142, 156-166` | /about-us only, 5-6 instances per page. |
| `content.about-team-cards` | CONTENT | 1 | 1 | `src/pages/AboutUs.jsx:120-142` | /about-us only. |
| `content.about-backer-grid` | CONTENT | 1 | 1 | `src/pages/AboutUs.jsx:15-18, 170-186` | /about-us only. |
| `content.careers-roles-list` | CONTENT | 1 | 1 | `src/pages/Careers.jsx:6-10, 49-64` | /careers only. |
| `content.careers-about-why` | CONTENT | 1 | 1 | `src/pages/Careers.jsx:66-90` | /careers only. |
| `content.blog-post-list` | CONTENT | 1 | 1 | `src/pages/Blog.jsx:8-17, 28-49 (BlogIndex)` | /blog only. |
| `content.blog-post-article` | CONTENT | 1 | 1 | `src/pages/Blog.jsx:64-78 (BlogPost)` | /blog/:slug only. |
| `content.contact-frame` | FORM | 1 | 1 | `src/pages/Interested.jsx:14-49, 61-79` | /i-am-interested only. |
| `content.notfound-body` | CONTENT | 1 | 1 | `src/pages/NotFound.jsx:1-15` | The catch-all route only. |
| `cta.closing-home` | CTA | 1 | 1 | `src/components/Closing.jsx` | Home route only. |
| `cta.careers-closing-cta` | CTA | 1 | 1 | `src/pages/Careers.jsx:92-114` | /careers only. |

**9 shared sections** appear in more than one template and belong in a component library.

**35 single-use sections** appear in exactly one template. Building these
as "reusable" components up front would be speculative — keep them page-local
until a second caller actually appears.

## Templates

### Home — `template.home`

1 route · `/` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.navbar` | shared ×13 |
| 2 | HERO | `hero.home` | page-local |
| 3 | FEATURES | `features.appgrid` | page-local |
| 4 | FEATURES | `features.speed` | page-local |
| 5 | FEATURES | `features.execution-stack` | page-local |
| 6 | FEATURES | `features.cloud-vs-device` | page-local |
| 7 | FEATURES | `features.co-design` | page-local |
| 8 | FEATURES | `features.full-stack` | page-local |
| 9 | CTA | `cta.closing-home` | page-local |
| 10 | SHELL | `shell.footer` | shared ×13 |

### Product page — conversion & optimization toolkit — `template.product-toolkit`

1 route · `/conversion-optimization-toolkit` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.navbar` | shared ×13 |
| 2 | HERO | `hero.product` | shared ×2 |
| 3 | FEATURES | `features.toolkit-convert-cards` | page-local |
| 4 | FEATURES | `features.toolkit-pipeline` | page-local |
| 5 | PROOF | `proof.bench-strip` | shared ×2 |
| 6 | PROOF | `proof.model-cards` | shared ×2 |
| 7 | CONTENT | `content.perfect-for` | shared ×2 |
| 8 | CONTENT | `content.faq` | shared ×2 |
| 9 | CTA | `cta.closing-band` | shared ×2 |
| 10 | SHELL | `shell.footer` | shared ×13 |

### Product page — inference runtime — `template.product-runtime`

1 route · `/inference-runtime` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.navbar` | shared ×13 |
| 2 | HERO | `hero.product` | shared ×2 |
| 3 | CONTENT | `content.perfect-for` | shared ×2 |
| 4 | PROOF | `proof.bench-strip` | shared ×2 |
| 5 | FEATURES | `features.runtime-install-steps` | page-local |
| 6 | FEATURES | `features.runtime-install-matrix` | page-local |
| 7 | FEATURES | `features.runtime-features` | page-local |
| 8 | PROOF | `proof.model-cards` | shared ×2 |
| 9 | CONTENT | `content.faq` | shared ×2 |
| 10 | CTA | `cta.closing-band` | shared ×2 |
| 11 | SHELL | `shell.footer` | shared ×13 |

### Chat for Mac (macOS app landing page) — `template.chat-mac`

1 route · `/chat-for-mac` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.navbar` | shared ×13 |
| 2 | HERO | `hero.chat-mac` | page-local |
| 3 | FEATURES | `features.framed-screenshot` | page-local |
| 4 | SHELL | `shell.footer` | shared ×13 |

### Contact / interest form — `template.contact`

1 route · `/i-am-interested` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.navbar` | shared ×13 |
| 2 | HERO | `hero.page-header-simple` | shared ×2 |
| 3 | FORM | `content.contact-frame` | page-local |
| 4 | SHELL | `shell.footer` | shared ×13 |

### Local models library — `template.local-models`

1 route · `/local-models` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.navbar` | shared ×13 |
| 2 | HERO | `hero.page-header-simple` | shared ×2 |
| 3 | PROOF | `proof.model-family-list` | page-local |
| 4 | SHELL | `shell.footer` | shared ×13 |

### Benchmarks / metrics — `template.metrics`

1 route · `/metrics` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.navbar` | shared ×13 |
| 2 | HERO | `hero.metrics-header` | page-local |
| 3 | PROOF | `proof.metrics-sidebar-nav` | page-local |
| 4 | PROOF | `proof.metrics-chart-panel` | page-local |
| 5 | PROOF | `proof.metrics-quality-scatter` | page-local |
| 6 | PROOF | `proof.metrics-how-we-measure` | page-local |
| 7 | SHELL | `shell.footer` | shared ×13 |

### About us — `template.about`

1 route · `/about-us` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.navbar` | shared ×13 |
| 2 | HERO | `hero.about` | page-local |
| 3 | CONTENT | `content.about-prose-block` | page-local |
| 4 | CONTENT | `content.about-team-cards` | page-local |
| 5 | CONTENT | `content.about-backer-grid` | page-local |
| 6 | SHELL | `shell.footer` | shared ×13 |

### Careers — `template.careers`

1 route · `/careers` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.navbar` | shared ×13 |
| 2 | HERO | `hero.page-header-centered` | page-local |
| 3 | CONTENT | `content.careers-roles-list` | page-local |
| 4 | CONTENT | `content.careers-about-why` | page-local |
| 5 | CTA | `cta.careers-closing-cta` | page-local |
| 6 | SHELL | `shell.footer` | shared ×13 |

### Research / blog index — `template.blog-index`

1 route · `/blog` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.navbar` | shared ×13 |
| 2 | HERO | `hero.blog-header` | page-local |
| 3 | CONTENT | `content.blog-post-list` | page-local |
| 4 | SHELL | `shell.footer` | shared ×13 |

### Research / blog post — `template.blog-post`

1 route · `/blog/:slug` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.navbar` | shared ×13 |
| 2 | CONTENT | `content.blog-post-article` | page-local |
| 3 | SHELL | `shell.footer` | shared ×13 |

### Legal (privacy policy / terms of use) — `template.legal`

2 routes · `/privacy-policy`, `/terms-of-use` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.navbar` | shared ×13 |
| 2 | CONTENT | `content.legal-body` | page-local |
| 3 | SHELL | `shell.footer` | shared ×13 |

### 404 / not found — `template.not-found`

1 route · `*` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.navbar` | shared ×13 |
| 2 | CONTENT | `content.notfound-body` | page-local |
| 3 | SHELL | `shell.footer` | shared ×13 |

## Section reference

### SHELL

_Chrome present on every route: sticky top navigation and the site footer._

**`shell.navbar`** — Sticky top navigation bar: collapsing logo, Product/Company dropdowns, direct links, present identically at the top of all 14 routes.

· All 14 routes (13 real routes + the 404 catch-all). · appears on 14 routes · implemented by `src/components/Navbar.jsx`

**`shell.footer`** — Site footer: logo rail plus Main/Company/Links columns, present at the bottom of all 14 routes.

· All 14 routes (13 real routes + the 404 catch-all). · appears on 14 routes · implemented by `src/components/Footer.jsx`

### HERO

_The page-opening block: full hero treatment on marketing pages, or a lighter page-top header/title band on utility pages._

**`hero.home`** — Homepage hero: headline, supporting copy, and the primary chat/app visual composition. Not wrapped in scroll-reveal — renders immediately above the fold.

· Home route only (/). · appears on 1 routes · implemented by `src/components/Hero.jsx`

**`hero.product`** — Product-page hero: eyebrow label + hairline rule, serif title, supporting paragraph, CTA row. Shared shape between the two product pages.

· The 2 product routes: /conversion-optimization-toolkit and /inference-runtime. · appears on 2 routes · implemented by `src/pages/ConversionToolkit.jsx:94-138 and src/pages/InferenceRuntime.jsx:210-243`

**`hero.chat-mac`** — Full-bleed sunset-backdrop hero for the macOS app page: app icon, serif headline, supporting copy, download CTA.

· /chat-for-mac only. · appears on 1 routes · implemented by `src/pages/ChatForMac.jsx:23-66`

**`hero.about`** — Centered 720px About hero heading with no supporting paragraph, followed by a full-width divider.

· /about-us only. · appears on 1 routes · implemented by `src/pages/AboutUs.jsx:79-88`

**`hero.blog-header`** — Centered blog index header: h1 + one line of supporting copy.

· /blog only. · appears on 1 routes · implemented by `src/pages/Blog.jsx:20-26 (BlogIndex)`

**`hero.metrics-header`** — Metrics page-top header: 'Metrics' h1, small caption line, lead paragraph.

· /metrics only. · appears on 1 routes · implemented by `src/pages/Metrics.jsx:112-119`

**`hero.page-header-simple`** — Minimal page-top h1 with no subtitle, left/top-aligned in the shell padding band — the lightest header treatment used on this site.

· The 2 routes /i-am-interested and /local-models. · appears on 2 routes · implemented by `src/pages/Interested.jsx:57-59 and src/pages/LocalModels.jsx:143-145`

**`hero.page-header-centered`** — Centered page-top eyebrow + h1, used where the page opens with a short label above the title.

· /careers only. · appears on 1 routes · implemented by `src/pages/Careers.jsx:40-47`

### FEATURES

_Product/capability explanation modules — the mid-page blocks that explain what the product does or how to use it._

**`features.appgrid`** — 'One interface' section: convergence-wires illustration showing model/runtime/device tying together.

· Home route only. · appears on 1 routes · implemented by `src/components/AppGrid.jsx`

**`features.speed`** — Dark full-bleed 'speed' section with a tokens/sec chart illustration.

· Home route only. · appears on 1 routes · implemented by `src/components/Speed.jsx`

**`features.execution-stack`** — '1,000 t/s execution stack' explanatory section.

· Home route only. · appears on 1 routes · implemented by `src/components/ExecutionStack.jsx`

**`features.cloud-vs-device`** — Short comparison band contrasting cloud vs. on-device inference.

· Home route only. · appears on 1 routes · implemented by `src/components/CloudVsDevice.jsx`

**`features.co-design`** — 'Co-design across the stack' section.

· Home route only. · appears on 1 routes · implemented by `src/components/CoDesign.jsx`

**`features.full-stack`** — Dark 'full on-device stack' band.

· Home route only. · appears on 1 routes · implemented by `src/components/FullStack.jsx`

**`features.toolkit-convert-cards`** — Two side-by-side beige cards: one-command conversion, add new architecture support.

· /conversion-optimization-toolkit only. · appears on 1 routes · implemented by `src/pages/ConversionToolkit.jsx:99-227`

**`features.toolkit-pipeline`** — Three-up pipeline card grid: draft-model training, quantization, validation.

· /conversion-optimization-toolkit only. · appears on 1 routes · implemented by `src/pages/ConversionToolkit.jsx:70-73, 229-247`

**`features.runtime-install-steps`** — 3-step framework picker + install command + syntax-highlighted code sample.

· /inference-runtime only. · appears on 1 routes · implemented by `src/pages/InferenceRuntime.jsx:157-207, 295-352`

**`features.runtime-install-matrix`** — Language/distribution/snippet install matrix table plus a promise list and 'Read the docs' link.

· /inference-runtime only. · appears on 1 routes · implemented by `src/pages/InferenceRuntime.jsx:354-386`

**`features.runtime-features`** — Two-column feature accordion (dark cards) beside a photo plate with a floating badge.

· /inference-runtime only. · appears on 1 routes · implemented by `src/pages/InferenceRuntime.jsx:388-429`

**`features.framed-screenshot`** — One real product screenshot rendered full-bleed inside a Frame, with separate desktop/mobile crops.

· /chat-for-mac only. · appears on 1 routes · implemented by `src/pages/ChatForMac.jsx:68-91`

### PROOF

_Benchmarks, metrics and structured comparison data: charts, stat panels, scatter plots, model/family listings._

**`proof.bench-strip`** — 'What Apple Silicon delivers today' benchmark strip: three stat panels (output/input speed, etc).

· The 2 product routes: /conversion-optimization-toolkit and /inference-runtime. · appears on 2 routes · implemented by `src/components/Shared.jsx:196-260, 326-359`

**`proof.model-cards`** — Grid of model-family cards linking through to /local-models.

· The 2 product routes: /conversion-optimization-toolkit and /inference-runtime. · appears on 2 routes · implemented by `src/components/Shared.jsx:366-390 (ModelCards)`

**`proof.metrics-sidebar-nav`** — Sticky left-hand in-page nav (200px, desktop only) linking to the 5 metrics sections.

· /metrics only. · appears on 1 routes · implemented by `src/pages/Metrics.jsx:100, 127-141`

**`proof.metrics-chart-panel`** — One bordered, radius-8 panel: title + model count, runner legend, horizontally-scrollable grouped bar chart, versions/methodology footer. Repeats 3 times per page.

· /metrics only, 3 instances per page. · appears on 1 routes · implemented by `src/pages/Metrics.jsx:60-96`

**`proof.metrics-quality-scatter`** — Quantization-quality scatter plot panel (speed vs. quality-retained).

· /metrics only. · appears on 1 routes · implemented by `src/pages/Metrics.jsx:172-185`

**`proof.metrics-how-we-measure`** — Methodology explainer panel closing the metrics page.

· /metrics only. · appears on 1 routes · implemented by `src/pages/Metrics.jsx:164-179`

**`proof.model-family-list`** — Repeated family sections: logo + name + provenance, a horizontally-scrolling checkpoint/variant table per family.

· /local-models only. · appears on 1 routes · implemented by `src/pages/LocalModels.jsx:15-134`

### CONTENT

_Substantive body content unique to a page: prose, article bodies, card lists, legal text._

**`content.perfect-for`** — Three-up 'Perfect for:' persona cards.

· The 2 product routes: /conversion-optimization-toolkit and /inference-runtime. · appears on 2 routes · implemented by `src/components/Shared.jsx:167-193 (PerfectFor)`

**`content.faq`** — Accordion FAQ list, single-open-at-a-time.

· The 2 product routes: /conversion-optimization-toolkit and /inference-runtime. · appears on 2 routes · implemented by `src/components/Shared.jsx:203-241 (Faq)`

**`content.about-prose-block`** — Single-column 600px article block: h2 + 1-3 paragraphs, occasionally followed by an inline element. Repeats 5-6 times down the About page.

· /about-us only, 5-6 instances per page. · appears on 1 routes · implemented by `src/pages/AboutUs.jsx:32-70, 93-142, 156-166`

**`content.about-team-cards`** — Two 302px beige team cards: generic circular avatar + role label + withheld-biography treatment.

· /about-us only. · appears on 1 routes · implemented by `src/pages/AboutUs.jsx:120-142`

**`content.about-backer-grid`** — 4-up (2-up mobile) grid of 160px investor/backer logo cards.

· /about-us only. · appears on 1 routes · implemented by `src/pages/AboutUs.jsx:15-18, 170-186`

**`content.careers-roles-list`** — Open-positions list: bordered beige rows, title + meta line, each linking to the contact route.

· /careers only. · appears on 1 routes · implemented by `src/pages/Careers.jsx:6-10, 49-64`

**`content.careers-about-why`** — Two-column 'About us' / 'Why us?' copy blocks, single column on mobile.

· /careers only. · appears on 1 routes · implemented by `src/pages/Careers.jsx:66-90`

**`content.blog-post-list`** — Vertical list of post cards, cover image left, tag/title/blurb right.

· /blog only. · appears on 1 routes · implemented by `src/pages/Blog.jsx:8-17, 28-49 (BlogIndex)`

**`content.blog-post-article`** — Single-post article body: tag, h1, blurb, cover image, and a disclosure that the post content is placeholder for this clone.

· /blog/:slug only. · appears on 1 routes · implemented by `src/pages/Blog.jsx:64-78 (BlogPost)`

**`content.legal-body`** — Narrow 720px legal-page body: h1, a structural disclosure paragraph, then N hairline-divided clauses. Same component renders both privacy policy and terms of use via a `kind` prop.

· The 2 legal routes: /privacy-policy and /terms-of-use. · appears on 2 routes · implemented by `src/pages/Legal.jsx:10-32 (LegalPage)`

**`content.notfound-body`** — Centered 404 body: h1, supporting line, 'Back home' CTA.

· The catch-all route only. · appears on 1 routes · implemented by `src/pages/NotFound.jsx:1-15`

### CTA

_Closing calls-to-action: statement + primary action band near the bottom of a page._

**`cta.closing-home`** — Homepage closing statement: 240px orbital mark + serif headline + supporting line + primary action.

· Home route only. · appears on 1 routes · implemented by `src/components/Closing.jsx`

**`cta.closing-band`** — Full-bleed closing CTA band: photo plate with a floating terminal card and a primary action.

· The 2 product routes: /conversion-optimization-toolkit and /inference-runtime. · appears on 2 routes · implemented by `src/components/Shared.jsx:395-429 (ClosingBand)`

**`cta.careers-closing-cta`** — Closing statement: orbital mark, serif heading, supporting line, and a full-width action.

· /careers only. · appears on 1 routes · implemented by `src/pages/Careers.jsx:92-114`

### FORM

_Interactive input surfaces — currently just the contact/interest form._

**`content.contact-frame`** — Framed contact panel: desktop 1200x696 Frame with a centered 600x482 mail-style form card; separate mobile layout.

· /i-am-interested only. · appears on 1 routes · implemented by `src/pages/Interested.jsx:14-49, 61-79`
