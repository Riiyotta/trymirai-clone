# How the trymirai.com clone was built

Same method as the Beside clone in this workspace: measure first, pull the tokens
out of the live DOM, download the assets, build section by section, then verify
against the original rather than trusting the build.

**Result:** React 18 + Vite 5 + Tailwind v3, all 8 homepage sections plus nav and
footer, every section within 1px of the original, page height 6533 vs 6529 (100.1%),
no console errors, no horizontal scroll at 1440 or 390.

---

## 1. Tools

| Tool | Used for |
|---|---|
| Playwright MCP + Chromium | Measuring the live site, then driving and screenshotting the clone. |
| `curl` | Downloading the six assets and the SSR HTML. |
| Python | Batch-editing components between measurement rounds. |
| Vite dev server | Port 5182 (5180/5181 are the exa and Beside clones). |

No subagents — all measurement and building done directly.

## 2. Measuring the live site

Loaded at 1440x900 and ran `browser_evaluate` passes for: page height and body
tokens; the section map with y-positions and heights; computed typography per tag;
a colour census tallying every `color` / `backgroundColor` / `borderTopColor` by
frequency; `@font-face` rules read off `document.styleSheets`; and the asset
inventory from `performance.getEntriesByType('resource')` plus every `img`/`video`
and CSS `background-image`.

**Two useful findings up front.** The site is already Tailwind-built, so class
strings in the DOM name the real breakpoints and tokens — worth reading rather than
inferring. And it ships almost no image assets: 41 inline SVGs, 2 canvases, and only
six real files to download.

## 3. Assets

`hf-logo.svg`, `icon-light.png`, `favicon.ico` and three font files (Inter,
Fraunces, geistMono — the subsets the original serves). All six checked with `file`
to confirm real binaries rather than HTML error pages saved under an image
extension. No failures.

## 4. Build

Tailwind config carries the censused colours as named tokens; `index.css` holds the
`@font-face` rules, the measured type scale, the reveal keyframes and a
`prefers-reduced-motion` override. One component per section, plus shared `Icons`,
`useInView` and `<Reveal>`.

## 5. Verifying against the original

First measurement pass: 5645 against 6529. Four problems, in order of size:

| # | Problem | Cause | Fix |
|---|---|---|---|
| 1 | 884px short overall, spread evenly. | The original separates every section with an explicit **96px spacer div** carrying the vertical hairlines. The clone butted sections together. | Added a `<Gap />` rail between sections. |
| 2 | Section positions on the original didn't add up — a spacer appeared to start *before* the previous section ended. | The un-triggered `.reveal` elements are `translateY(18px)`, so `getBoundingClientRect().top` reflects the transform while layout sits ~17px higher. Heights were fine; only positions were skewed. | Measured heights, not positions. Worth recording: it reads exactly like a layout bug and is not one. |
| 3 | "Full on-device stack" section 85px short and structurally wrong. | I'd built the four layers as a 4-column grid. The original is **four full-width 64px rows** (`lg:h-16 lg:flex-row`) divided by hairlines. | Rebuilt as rows. |
| 4 | That section then ran 44px *long*, and a `<br>` wouldn't fix it. | Two separate things. A `<br className="hidden lg:block">` doesn't break a line — `display:block` on a `<br>` kills its line-breaking behaviour. And underneath that, the heading genuinely rendered wider than the original's. | See below. |

### The real cause of #4 — the optical-size axis

The 40px heading wrapped to three lines at `max-w-[560px]` where the original fits
two. Same string, same font-size, same family. Measuring the original's computed
`font-variation-settings` per heading showed why:

- 48px headings: `SOFT 56, WONK 0, opsz 72, wght 350`
- 40px headings: `SOFT 56, WONK 0, opsz 80, wght 350`

I had applied `opsz 72` globally to `h1, h2, h3`. Fraunces' optical-size axis
changes letterform *width*, not just contrast — at `opsz 72` the 40px line measured
624px against a 560px cap and wrapped. Setting `opsz 80` on the 40px classes dropped
it to two lines and closed the section to exactly 521px with no manual break.

Worth generalising: with a variable font, matching family/size/weight is not enough.
Read every axis off the original's computed style.

### Bug #5 — reveal sections stuck invisible

After a scroll jump to the bottom, 6 of 7 `.reveal` sections stayed at `opacity: 0`.
An `IntersectionObserver` with `once: true` never fires for elements a fast scroll,
an anchor jump, or a restored scroll position steps over — they simply never
register as intersecting. The original has the same trait (its own full-page
screenshot comes out blank below the hero).

Deliberately *not* reproduced: `useInView` now pairs the observer with a
rAF-throttled scroll/resize check that reveals anything at or above the fold.
Identical during normal scrolling, but content can no longer get stuck invisible.

## 6. Result

| Section | Clone | Original | Δ |
|---|---:|---:|---:|
| Hero | 1182 | 1182 | 0 |
| App grid | 802 | 802 | 0 |
| Speed (dark) | 937 | 936 | +1 |
| Execution stack | 551 | 551 | 0 |
| Cloud vs on-device | 318 | 319 | −1 |
| Co-design | 481 | 481 | 0 |
| Full stack (dark) | 521 | 521 | 0 |
| Closing | 582 | 582 | 0 |
| Footer | 384 | 384 | 0 |

Nav dropdown verified open: 294x233 panel, `p-12`, `0.5px #D4D4D4`, rows 269x42 at
radius 4 — matching the original exactly. Mobile at 390: no horizontal scroll, h1
drops to 32px, nav collapses to the sheet.

## 7. Where the clone differs

Covered in `README.md`. In short: body paragraphs are written for this clone rather
than copied, the wordmark is a text-set placeholder, the illustrations are
reconstructions built to the measured boxes, and the reveal behaviour is more
robust than the original's.

---

## 8. The scroll-then-capture pass

A full-page screenshot of either site comes out blank below the hero: every
section sits in a `.reveal` wrapper at `opacity: 0`, and a headless capture never
scrolls, so nothing ever triggers. My first "visual comparison" compared two
mostly-empty images and told me nothing. The fix is to drive the page through a
scripted scroll first, confirm every reveal has actually flipped, and only then
capture.

```js
// Step the page down in 60%-viewport increments, return to the top, and
// assert that nothing is still hidden before the screenshot is taken.
() => new Promise(res => {
  const step = Math.round(innerHeight * 0.6);
  const H = document.documentElement.scrollHeight;
  let y = 0;
  const tick = () => {
    if (y < H) { window.scrollTo(0, y); y += step; setTimeout(tick, 140); }
    else {
      window.scrollTo(0, 0);
      setTimeout(() => {
        const rv = [...document.querySelectorAll('.reveal')];
        res({ pageH: H, reveals: rv.length,
              stillHidden: rv.filter(r => getComputedStyle(r).opacity !== '1').length });
      }, 900);
    }
  };
  tick();
})
```

Both pages returned `stillHidden: 0` before capture. The 60%-of-viewport step
matters: a larger stride skips sections, which is the same failure that produced
bug #5. The 900ms settle lets the 0.55s reveal transition finish before the
shutter.

Captures live in `reference/`: `original-1440-revealed.png` (638KB) and
`clone-1440-revealed.png` (599KB), against the earlier blank versions at 162KB
and 176KB — the file size alone tells you whether the pass worked.

### What the visual comparison caught that measurement did not

Every section was already within 1px on height. The screenshots still exposed
several illustrations built out of the wrong shapes — the §5 lesson again, in
reverse: matching the box does not mean matching the contents.

| Area | Original | Clone as built |
|---|---|---|
| App-grid art | 3x3 of solid dark dots, one orange | White rounded tiles with grey inner squares |
| Convergence art | Labelled nodes fanned by curved orange connector lines into the instruction | A row of chips above the instruction |
| Speed chart | Dashed horizontal rules, a `1,000 t/s` pill marker, a dotted vertical guide, thin curves | Heavy filled orange area, no dashed grid, labels placed differently |
| Terminal | **Light** cream panel, a booking search with providers and prices | **Dark** panel with a different script |
| Co-design canvas | Organic swirling orange filament network | Regular rectilinear dot grid |
| Closing mark | Black circular scribble ring | Light orange spiral |

These are recorded rather than fixed — see §10.

## 9. The motion-capture pass

Static geometry says nothing about timing, so a second probe reads motion
directly off the original instead of guessing at plausible-looking easings.

**Probe A — declared motion.** Walk `document.styleSheets` for `@keyframes`
(`rule.type === 7`), then sweep every element for a computed `animationName`
that isn't `none` and any `transitionProperty` with a non-zero duration.

**Probe B — scripted motion.** CSS probes miss anything driven by JS state.
Scroll the section into view, then sample `textContent` on an interval and diff
the samples.

Probe B is what caught the single biggest motion miss on the page.

### Measured results

| Element | Real motion |
|---|---|
| `.reveal` | `opacity 0.5s ease, transform 0.55s cubic-bezier(0.32, 0.72, 0, 1)` |
| Hero dark panel | `opacity 0.4s cubic-bezier(0.34, 1.12, 0.64, 1)` |
| Nav links / dropdown | `0.15s cubic-bezier(0.4, 0, 0.2, 1)` |
| Logo rail collapse | `width 0.38s cubic-bezier(0.45, 0, 0.55, 1)` |
| Mobile sheet | `opacity, transform 0.2s cubic-bezier(0.34, 1.12, 0.64, 1)` |
| Threshold dot | `mirai-threshold-dot-pulse 4.2s ease-in-out infinite` — `scale(1)→scale(1.18)`, opacity `1→0.82` at 50% |

Keyframes declared on the original: `service-convergence-pulse`,
`mirai-threshold-dot-pulse`, `chat-for-mac-marquee` (`translate(-446px)→0`),
`benchmark-final-bar-in`, `benchmark-tooltip-in` / `-out`, `spin`, `ping`.

### The heading is a counter

Sampling the speed section's `h2` every 500ms returned:

```
365 → 639 → 819 → 927 → 980 → 998 → 1,000 → 1,000 …
```

The heading is not the static "0 t/s is where models become interfaces." that a
single DOM read reports — it counts **0 → 1,000 t/s** when scrolled into view and
holds. A one-shot `innerText` dump reads whatever frame it happens to land on,
which is why the first build froze it at the start value.

Remaining distance to 1,000 across those samples runs
`635, 361, 181, 73, 20, 2` — the decay *accelerates*, so this is a
fixed-duration eased tween, not exponential smoothing toward a target. A quart
ease-out over ~3.2s reproduces the curve; the clone now samples
`476 → 767 → 916 → 979 → 997 → 1,000`, the same shape.

**The general lesson:** `getComputedStyle` finds CSS motion and misses React
state, while a text sample finds React state and misses CSS motion. Neither probe
alone is sufficient — run both. Here, only Probe B would ever have found the
counter.

### Applied to the clone

Reveal timing corrected from an invented `0.7s cubic-bezier(0.22,1,0.36,1)` to the
measured pair; dropdown `200ms → 150ms`; hero panel entrance added; threshold-dot
pulse added at the real 4.2s; and the counter implemented with a
`prefers-reduced-motion` branch that jumps straight to 1,000.

## 10. Rebuilding the illustrations

The §8 table was worked through by measuring each illustration the same way the
layout was measured, rather than eyeballing the screenshots.

**What could be read directly.** Four of the six are DOM or SVG, so their real
geometry is readable. Pulling `d` attributes plus computed `stroke`, `strokeWidth`,
`strokeDasharray` and `fill` off the original gave exact values:

- **App grid** — a 3x3 at x 184/271/358, y 76/172/268 inside the 600x400 panel.
  Each cell is a 56x56 well holding a **29px dot**, label 9px
  `rgba(28,28,28,0.48)` 62px below. The first cell is the live one: accent dot
  with two pulse rings (82px and 27px) driven by `service-convergence-pulse`.
- **Convergence** — four nodes at x36, y 64/136/208/280, each a 48x48 well with a
  25px dot and a 15px label. The four wires are exact cubics, all converging on
  `(55.8, 47)` in a `0 0 100 100` viewBox:
  `M 28.9 22 C 40.198 24, 44.502 45, 55.8 47` and its three siblings. Each is drawn
  **twice** — a grey `#E6E6E6` base dashed `12 15` at 0.5 opacity, and an accent
  overlay dashed `75 25` whose offset animates. That double-draw is what makes the
  flow read as movement; one path alone looks static no matter the dash pattern.
  Convergence square is 11x11 accent at (329,182), instruction 200px at 17px.
- **Speed chart** — viewBox `0 0 720 300`, plot from x48 to x672, baseline y214
  rising to y70, sampled at **81 points 7.8 apart**. Dashed rules at y 92/142/192
  (`#CCCCCC`, `3 7`); accent marker line at x360 from y34 to y256 (`4 6`). Two
  curves — slow `#8F8F8F`, fast `#FF6A20`, both 1px — over area fills that ramp
  `#8f8f8f` 0.32→0 and accent 0.35→0.
- **Terminal** — the one that was simply wrong: the original panel is
  **light `#F2F0ED`**, not dark. 40px chrome row with the traffic lights and a
  centred mono 12px caption, body rows mono 15px on 31.2px leading.

**What could not.** The two canvases expose no readable draw calls, so they were
captured as element screenshots and rebuilt from what those showed. The co-design
canvas is an **orbital sphere** — seven ellipses at varying tilt and eccentricity,
~270px across on the 480px canvas, hairline strokes in warm grey and faint accent,
with solid accent nodes riding the orbits. It was a rectilinear dot grid before,
which shared nothing with the original but its bounding box.

**Left as a placeholder on purpose.** The closing mark is Mirai Labs' own brand
artwork. Like the wordmark in §7, it stays a neutral geometric placeholder rather
than a reproduction.

### Result

All eight sections still land within 1px after the rebuild — 6533 against 6529 —
so none of this cost geometry. Zero console errors, no horizontal scroll.

### The lesson worth keeping

§5 recorded that a section can be the right height and built from the wrong boxes.
This pass is the sharper version: **a section can be the right height, built from
the right boxes, and still be drawn wrong.** Height checks, box checks and pixel
checks are three different tests, and only the third catches a dark panel that
should be light. Run the capture pass before believing any of it.


---

## 11. The rest of the site

The clone was one page. The original's internal link graph resolves to eleven more
routes, all now built behind react-router with a shared `Layout`, a `ScrollToTop`,
and an `A` component that renders a `<Link>` for internal paths and a plain anchor
for `mailto:`, `tel:` and external URLs.

### Recon

Each route was measured the same way the homepage was — page height, section map,
heading tree, and for the pages with unusual structure a full geometry dump.

### What the QA sweep found

Every route was then driven through the §8 scroll-then-capture pass. All thirteen
came back clean on the behavioural checks: correct title and meta, exactly one
`h1`, zero console errors, zero horizontal scroll, no broken images, every reveal
firing. The fidelity numbers were another matter.

| Route | First build | Original | |
|---|---:|---:|---|
| `/` | 6533 | 6529 | 100.1% |
| `/blog` | 2430 | 2448 | 99.3% |
| `/i-am-interested` | 1245 | 1469 | 85% |
| `/chat-for-mac` | 1337 | 1779 | 75% |
| `/careers` | 1687 | 2306 | 73% |
| `/metrics` | 2554 | 3479 | 73% |
| `/conversion-optimization-toolkit` | 3833 | 6190 | 62% |
| `/inference-runtime` | 4317 | 7245 | 60% |
| `/about-us` | 2291 | 4757 | 48% |
| `/local-models` | 5141 | 3804 | **135%** |

### Two fixed so far

**`/local-models` was 135% — too tall.** I had made each checkpoint a stacked card
with speed and size on separate rows. Measuring the original showed a much denser
structure: a family header (64px mark + 28px name + provenance row), then one
156px group per checkpoint, each holding **two 78px variant rows** inside a
`rounded-[5px]` hairline box with a divider between them, speed and size split off
to the right behind a `border-l`. It also carries no CTA band, which I had added.
Rebuilt: 3659 against 3804 (96.2%), every family section within 16px.

**`/about-us` was 48% — structurally wrong.** I had built the site's usual
two-column grid. The original is a **600px single-column article** centred in the
shell: 28px `h2`s, 17px/27.2 body, blocks separated by hairline dividers, and a
team section of two 302px cards with 64px round avatars. Rebuilt to the real
measure and column width, then the body copy lengthened toward the measured block
heights: 3491 against 4757 (73.4%), with the team section landing at 997 against 967.

### Still short, and honest about it

The remaining pages are structurally sound and behaviourally clean, but run shorter
than the originals for two reasons: the prose written for this clone is thinner than
the original's, and the two large product pages are missing sections I did not build
— `/inference-runtime` has 8 of the original's 10, and the toolkit page is similarly
condensed. Closing those means the same measure-and-rebuild treatment `/local-models`
and `/about-us` received, page by page.

### The pattern worth recording

Across ten pages the failure was never the tokens, the typography or the shell — those
transferred from the homepage intact. It was always **structure**: the wrong container
width, the wrong row height, a card where the original had a list. That is the §10
lesson again at page scale, and it is only visible if you measure the original's
geometry per page instead of assuming the homepage's patterns repeat.
