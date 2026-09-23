# trymirai.com — local clone

A React 18 + Vite 5 + Tailwind v3 rebuild of the `https://trymirai.com` homepage,
measured against the live site rather than eyeballed.

```bash
npm install
npm run dev      # http://localhost:5182
npm run build
```

## Routes

13 routes, matching the original's internal link graph:

| Route | Template |
|---|---|
| `/` | Home |
| `/local-models` | Model library |
| `/inference-runtime` | Product — engine |
| `/conversion-optimization-toolkit` | Product — toolkit |
| `/metrics` | Benchmarks |
| `/chat-for-mac` | macOS app |
| `/about-us`, `/careers` | Company |
| `/blog`, `/blog/:slug` | Research index + post |
| `/i-am-interested` | Contact |
| `/privacy-policy`, `/terms-of-use` | Legal |
| `*` | 404 |

Client-side routing via react-router; `mailto:`, `tel:` and external URLs stay plain anchors.

## Page fidelity at 1440px

| Route | Clone | Original | |
|---|---:|---:|---|
| `/` | 6533 | 6529 | 100.1% |
| `/blog` | 2430 | 2448 | 99.3% |
| `/metrics` | 3404 | 3479 | 97.8% |
| `/conversion-optimization-toolkit` | 5994 | 6190 | 96.8% |
| `/chat-for-mac` | 1719 | 1779 | 96.6% |
| `/local-models` | 3659 | 3804 | 96.2% |
| `/careers` | 2190 | 2306 | 95.0% |
| `/i-am-interested` | 1380 | 1469 | 93.9% |
| `/inference-runtime` | 6417 | 7245 | 88.6% |
| `/about-us` | 3776 | 4757 | 79.4% |

Every route: correct title and meta, exactly one `h1`, zero console errors, zero
horizontal scroll at 1440, no broken images, all scroll reveals firing.

The inner pages below 100% are structurally correct but run shorter than the
originals — the written body copy is thinner, and the two large product pages are
missing some of their sections. See PROCESS.md §11.

## Homepage fidelity at 1440px

| Section | Clone | Original | Δ |
|---|---:|---:|---:|
| Hero | 1182 | 1182 | 0 |
| App grid → one interface | 802 | 802 | 0 |
| Speed / "0 t/s" (dark) | 937 | 936 | +1 |
| 1,000 t/s execution stack | 551 | 551 | 0 |
| Cloud vs on-device | 318 | 319 | −1 |
| Co-design across the stack | 481 | 481 | 0 |
| Full on-device stack (dark) | 521 | 521 | 0 |
| Closing / frontier lab | 582 | 582 | 0 |
| Footer | 384 | 384 | 0 |
| **Page** | **6533** | **6529** | **100.1%** |

Nav dropdown verified against the original: panel 294x233 at `p-12`, `0.5px #CCCCCC`
border, rows 269x42 at radius 4. Zero console errors, zero broken images, no
horizontal scroll at 1440 or 390.

## Design tokens

Taken from a colour census of the live DOM (tallied by usage, not guessed):

| Token | Value | Use |
|---|---|---|
| `ink` | `#0A0A0A` | body text, dark panels |
| `ink-soft` | `#3D3D3D` | body copy, dark-panel hairlines |
| `ink-2` | `#1D1D1F` | app-mock chrome text |
| `muted` | `#8F8F8F` | captions |
| `rail` | `#C7C7C7` | hairline rules (0.5px) |
| `hairline` | `#CCCCCC` | card + dropdown borders |
| `accent` | `#FF6A20` | Mirai orange |
| `cream` | `#F6F5F3` | illustration panels |
| `beige` | `#F2F1ED` | nav hover, canvas panel |

Shell is `max-w-[1200px] px-5 min-[1240px]:px-0` with `0.5px` vertical rails at `lg`.

**Typography.** Inter for UI/body, Fraunces for headings, geistMono for code —
all three served locally from `public/assets/fonts/` (the subsets the original ships).
Fraunces is variable, and the optical-size axis matters: 48px headings use
`opsz 72`, 40px headings use `opsz 80`, both at `SOFT 56, WONK 0, wght 350`.
Getting `opsz` wrong renders the same string measurably wider — see PROCESS.md.

## Assets

Six files, all verified as real binaries rather than HTML error pages:
`hf-logo.svg`, `icon-light.png`, `favicon.ico`, and three fonts. Everything else
on the original is inline SVG or canvas, so there was nothing more to download.

## Where this differs from the original

- **Body copy is written for this clone.** Section headings, nav labels, footer
  links and UI chrome strings are kept as measured, because the layout numbers
  above depend on their length. The longer marketing paragraphs are my own wording
  at matching length, so nothing substantial is reproduced verbatim.
- **The wordmark is a text-set placeholder**, not Mirai Labs' logo artwork.
- **Illustrations are rebuilt from measurement.** The app grid, convergence wires,
  speed chart and terminal are reconstructed from the original's own path data,
  dash patterns and geometry; the orbital-sphere canvas is rebuilt from a reference
  capture. The closing mark is deliberately left a neutral placeholder rather than a
  reproduction of Mirai Labs' brand artwork, as is the wordmark.
- **Reveal-on-scroll is more robust than the original's.** The live site leaves
  sections at `opacity: 0` permanently if a fast scroll or a restored scroll
  position skips them. This clone pairs the observer with a scroll check so content
  can't get stuck invisible. Visually identical during normal scrolling.

Content, branding and design are Mirai Labs'. This is a local reference build.
