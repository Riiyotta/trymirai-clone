import { useState } from 'react'
import { Reveal } from './useInView'
import A from './A'
import Caret from './Caret'

/* ------------------------------------------------------------------ */
/* Primitives                                                          */
/* ------------------------------------------------------------------ */

/** Section head: its own 120px-top block above the section body, as the original
 *  splits it (heading wrapper 224px tall = pt-120 + a 104px two-line 40/52 head). */
export function SectionHead({ children, className = '', maxW = '' }) {
  return (
    <div className={`shell pt-20 min-[810px]:pt-[120px] ${className}`}>
      <h2 className={`type-section-title text-ink ${maxW}`}>{children}</h2>
    </div>
  )
}

/** The 4px dot + 0.5px hairline rule the original draws between hero blocks. */
export function HeroRule({ className = '' }) {
  return (
    <div className={`relative hidden h-1 w-full min-[810px]:block ${className}`}>
      <span className="absolute top-1/2 left-0 size-1 -translate-x-1/2 -translate-y-1/2 bg-hairline" />
      <span className="absolute top-1/2 right-0 left-1 h-[0.5px] -translate-y-1/2 bg-hairline" />
    </div>
  )
}

const ArrowRight = ({ size = 18 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <line x1="5" y1="12" x2="18" y2="12" />
    <polyline points="12 6 18 12 12 18" />
  </svg>
)

/** 240x53 dark CTA: label left, arrow right. */
export function Cta({ href = '/i-am-interested', children = 'Talk to us', className = '' }) {
  return (
    <A href={href} className={`flex h-[53px] w-[240px] max-w-full items-center justify-between bg-ink pr-6 pl-5 text-[15px] leading-[22.5px] font-medium text-white transition-opacity hover:opacity-85 ${className}`}>
      <span>{children}</span>
      <ArrowRight />
    </A>
  )
}

/** Hairline frame with the four corner marks the original draws around framed
 *  panels. `tight` insets the rules by 4px and adds the corner dots (hero);
 *  the default flush variant is what the browser mock and closing band use. */
export function Frame({ children, tight = false, hideOnMobile = false }) {
  const vis = hideOnMobile ? 'hidden min-[810px]:block' : ''
  const h = tight ? 'right-1 left-1' : 'right-0 left-0'
  const v = tight ? 'top-1 bottom-1' : 'top-0 bottom-0'
  return (
    <div className="relative h-full w-full">
      <span className={`absolute z-10 h-[0.5px] bg-hairline ${vis} top-0 ${h}`} />
      <span className={`absolute z-10 h-[0.5px] bg-hairline ${vis} -bottom-px ${h}`} />
      <span className={`absolute z-10 w-[0.5px] bg-hairline ${vis} left-0 ${v}`} />
      <span className={`absolute z-10 w-[0.5px] bg-hairline ${vis} -right-px ${v}`} />
      {tight && ['-top-0.5 -left-0.5', '-top-0.5 -right-0.5', '-bottom-0.5 -left-0.5', '-right-0.5 -bottom-0.5'].map((pos) => (
        <span key={pos} className={`absolute z-10 size-1 bg-hairline ${vis} ${pos}`} />
      ))}
      {children}
    </div>
  )
}

/** Photo plate inside a Frame: cover image, 8px inset at desktop. */
export function SunsetPlate({ img = '/shared/sunset-sun-1920.webp', inset = true, children }) {
  return (
    <div className={`absolute overflow-hidden inset-0 ${inset ? 'min-[810px]:inset-2' : ''}`}>
      <img src={img} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover" />
      {children}
    </div>
  )
}

const Lights = ({ gap = 'gap-2' }) => (
  <div className={`flex shrink-0 ${gap}`}>
    <span className="size-3 rounded-full bg-mac-red" />
    <span className="size-3 rounded-full bg-mac-yellow" />
    <span className="size-3 rounded-full bg-mac-green" />
  </div>
)

/** White macOS-style terminal card that floats on the photo plate. */
export function TerminalCard({ caption, lines, className = '', radius = 'rounded-[12px]', headerClass = 'h-10 px-4', captionClass = 'text-[13px] leading-[13px] text-ink-muted', bodyClass = 'p-5 text-[14px] leading-[23.8px]', footer = null }) {
  return (
    <div className={`flex flex-col overflow-hidden border border-hairline bg-white ${radius} ${className}`}>
      <div className={`relative flex shrink-0 items-center border-b border-divider ${headerClass}`}>
        <Lights />
        <span className={`absolute inset-x-0 text-center font-mono ${captionClass}`}>{caption}</span>
      </div>
      <div className={`flex flex-1 flex-col overflow-hidden font-mono ${bodyClass}`}>
        {lines.map((l, i) => {
          const [text, tone] = Array.isArray(l) ? l : [l, undefined]
          if (tone === 'blank' || text === '') return <div key={i} className="h-3 shrink-0" />
          const cls = tone === 'accent' ? 'text-accent'
            : tone === 'muted' ? 'text-ink-muted'
            : tone === 'ink' ? 'text-ink'
            : tone === 'chevron' ? 'text-chevron'
            : text.startsWith('>') || text.startsWith('$') ? 'text-ink' : 'text-ink-soft'
          return (
            <div key={i} className={`shrink-0 ${cls}`}>
              {text.startsWith('$') ? <><span className="text-accent">$</span>{text.slice(1)}</> : text}
              {tone === 'caret' && <Caret className="ml-1 inline-block h-[15px] w-2 translate-y-[2px] rounded-[1px] bg-accent align-middle" />}
            </div>
          )
        })}
      </div>
      {footer}
    </div>
  )
}

/** Back-compat alias — a few pages outside this scope still import TerminalPanel. */
export function TerminalPanel({ caption, lines, className = '' }) {
  return (
    <div className={`flex flex-col bg-terminal-fill ${className}`}>
      <div className="flex h-10 shrink-0 items-center px-4">
        <Lights gap="gap-1.5" />
        <span className="flex-1 text-center font-mono text-[12px] leading-3 text-ink">{caption}</span>
        <span className="w-[54px] shrink-0" />
      </div>
      <div className="flex-1 overflow-hidden px-4 pb-4 font-mono text-[13.5px] leading-[24px]">
        {lines.map((l, i) => (
          <p key={i} className={l.startsWith('>') || l.startsWith('$') ? 'text-ink' : 'text-ink-soft'}>
            {l.startsWith('$') ? <><span className="text-accent">$</span>{l.slice(1)}</> : l}
          </p>
        ))}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* "Perfect for:" three-up — 120 + 104 head + 48 gap + 253 cards = 525  */
/* ------------------------------------------------------------------ */

export function PerfectFor({ title }) {
  const CARDS = [
    { icon: '/shared/icons/persona-model-companies.svg', h: 'Model companies.', b: 'You train and ship the models. We optimize them for Apple Silicon, benchmark on real hardware, and handle distribution.' },
    { icon: '/shared/icons/persona-researchers.svg', h: 'AI researchers & labs.', b: 'We convert your model and put it in front of people on real devices, rather than leaving it on a benchmark table.' },
    { icon: '/shared/icons/persona-makers.svg', h: 'Independent makers.', b: 'Ship a local model inside your app without building a runtime, a quantizer and a conversion pipeline first.' },
  ]
  return (
    <Reveal>
      <section className="pt-20 min-[810px]:pt-[120px]">
        <div className="shell mb-6 min-[810px]:mb-12">
          <h2 className="type-section-title max-w-[580px] text-ink">{title}</h2>
        </div>
        <div className="shell">
          <div className="grid grid-cols-1 gap-3 min-[810px]:grid-cols-3 min-[810px]:gap-6">
            {CARDS.map(({ icon, h, b }) => (
              <div key={h} className="flex min-h-[253px] flex-col border-[0.5px] border-hairline bg-beige p-5 md:p-6">
                <img src={icon} alt="" aria-hidden className="size-10 object-contain" />
                <h3 className="type-card-title mt-6 text-ink md:mt-10">{h}</h3>
                <p className="mt-3 text-[15px] leading-[25.5px] text-ink-soft md:mt-4">{b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Reveal>
  )
}

/* ------------------------------------------------------------------ */
/* FAQ — 120 + 52 head + 48 + 522 rows + 132 = 874                      */
/* ------------------------------------------------------------------ */

export function Faq({ items, title = 'Common questions:' }) {
  const [open, setOpen] = useState(-1)
  return (
    <Reveal>
      <section className="pt-20 pb-20 min-[810px]:pt-[120px] min-[810px]:pb-[132px]">
        <div className="shell mb-6 min-[810px]:mb-12">
          <h2 className="type-section-title text-ink">{title}</h2>
        </div>
        <div className="mx-auto w-full max-w-shell px-4 min-[810px]:px-5 min-[1200px]:px-0">
          <div className="flex flex-col gap-2 min-[810px]:gap-3">
            {items.map(({ q, a }, i) => (
              <div
                key={q}
                role="button"
                tabIndex={0}
                aria-expanded={open === i}
                onClick={() => setOpen(open === i ? -1 : i)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpen(open === i ? -1 : i) } }}
                className="cursor-pointer border-[0.5px] border-hairline bg-beige p-4 transition-colors min-[810px]:p-6 hover:bg-beige-chip"
              >
                <div className="flex w-full items-start justify-between gap-4 text-left">
                  <span className="text-[17px] leading-[27.2px] text-ink">{q}</span>
                  <span className="flex size-7 shrink-0 items-center justify-center text-ink">
                    <svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"
                      className={`transition-transform duration-200 ${open === i ? 'rotate-45' : ''}`} aria-hidden>
                      <path d="M8 3v10M3 8h10" />
                    </svg>
                  </span>
                </div>
                <div
                  className="grid transition-[grid-template-rows] duration-200 ease-out"
                  style={{ gridTemplateRows: open === i ? '1fr' : '0fr' }}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-[860px] pt-4 text-[15px] leading-[25.5px] text-ink-soft">{a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Reveal>
  )
}

/* ------------------------------------------------------------------ */
/* Benchmark strip — 120 + 104 head + 64 + 389 body = 677               */
/* Figures are representative placeholders for this clone.              */
/* ------------------------------------------------------------------ */

const PANELS = [
  { title: 'Output', value: '114', unit: 'tok/s', note: 'higher is better',
    tip: 'Output tokens per second', source: 'trymirai/Qwen3.6-27B-M',
    rows: [
      { label: 'uzu', sub: '+ specdec', v: 114, hot: true, split: 35.5, tip: ['specdec 114.0 t/s', 'autoregr. 35.5 t/s'] },
      { label: 'MLX', v: 26 }, { label: 'MTPLX', v: 55 }, { label: 'llama.cpp', v: 30 },
    ] },
  { title: 'Input', value: '872', unit: 'tok/s', note: 'higher is better',
    tip: 'Input tokens per second', source: 'trymirai/Qwen3.6-27B-M',
    rows: [
      { label: 'uzu', v: 872, hot: true, tip: ['prefill 872.0 t/s'] },
      { label: 'MLX', v: 541 }, { label: 'MTPLX', v: 886 }, { label: 'llama.cpp', v: 671 },
    ] },
  { title: 'Resident memory', value: '15.39', unit: 'GB', note: 'lower is better',
    tip: 'Resident memory while running', source: 'trymirai/Qwen3.6-27B-M',
    rows: [
      { label: 'uzu', v: 15.39, hot: true, tip: ['resident 15.39 GB'] },
      { label: 'MLX', v: 16.25 }, { label: 'MTPLX', v: 20.63 }, { label: 'llama.cpp', v: 17.29 },
    ] },
]

/* Hover card, measured on the original: 259x84, white, r6, 0.5px #E5E5E5,
   12px padding, a three-layer shadow, and NO entry animation — it simply
   shows and hides. */
function BarTip({ title, source, lines }) {
  return (
    <div
      className="pointer-events-none absolute bottom-[calc(100%+10px)] left-1/2 z-20 hidden w-[259px] -translate-x-1/2 rounded-[6px] border-[0.5px] border-cellborder bg-white p-3 text-left group-hover/bar:block"
      style={{ boxShadow: 'rgba(10,13,18,0.04) 0 2px 2px -1px, rgba(10,13,18,0.03) 0 4px 6px -2px, rgba(10,13,18,0.08) 0 12px 16px -4px' }}
      role="tooltip"
    >
      <div className="flex items-center gap-1.5">
        <p className="min-w-0 truncate text-[13px] leading-[16.9px] text-ink">{title}</p>
      </div>
      <div className="mt-1.5 flex min-h-6 items-center gap-2">
        <span className="min-w-0 flex-1 truncate text-[11px] leading-[14.3px] text-ink underline decoration-dotted underline-offset-2">
          {source}
        </span>
        <span className="flex shrink-0 flex-col items-end gap-0.5 tabular-nums">
          {lines.map((l, i) => (
            <span key={l} className={`text-[11px] leading-[14.3px] ${i === 0 ? "text-ink [font-variation-settings:'wght'_500]" : 'text-label-muted'}`}>
              {l}
            </span>
          ))}
        </span>
      </div>
    </div>
  )
}

function BenchPanel({ title, value, unit, note, tip, source, rows }) {
  const max = Math.max(...rows.map((r) => r.v))
  const PLOT = 153
  return (
    <div className="flex h-[330px] flex-col bg-white min-[810px]:h-[274px]">
      <div className="flex flex-col gap-3 px-5 pt-4 [font-variation-settings:'wght'_500]">
        <p className="text-[15px] leading-[25.5px] text-ink-muted">{title} · {note}</p>
        <p className="text-[28px] leading-[39.2px] text-ink">
          {value} <span className="text-[15px] leading-[25.5px] text-ink-muted">{unit}</span>
        </p>
      </div>

      <div className="mt-auto box-content flex h-[209px] items-end justify-center gap-3 px-5 pt-7 min-[810px]:h-[153px]">
        {rows.map((r) => {
          const h = Math.max(20, (r.v / max) * PLOT)
          // the winner's lower band is the autoregressive share of its total
          const subH = r.split ? (r.split / r.v) * h : 0
          return (
            <div key={r.label} className="flex min-w-0 max-w-[72px] flex-1 flex-col items-center">
              <div className="group/bar relative flex w-full flex-col items-center gap-2">
                <BarTip title={tip} source={source} lines={r.tip || [`${r.v} ${unit}`]} />

                {/* value sits above the bar: 13px figure + 9px unit */}
                <p className="flex h-[13px] w-full items-baseline justify-center gap-1">
                  <span className={`text-[13px] leading-none ${r.hot ? 'text-ink' : 'text-label-muted'}`}>{r.v}</span>
                  <span className={`text-[9px] leading-none ${r.hot ? 'text-ink' : 'text-label-muted'}`}>{unit}</span>
                </p>

                {/* the label lives INSIDE the bar; the winner is stacked */}
                <div
                  className={`relative flex w-full flex-col overflow-hidden rounded-t-[4px] transition-colors duration-150 ${
                    r.hot ? 'bg-accent group-hover/bar:bg-accent-hover' : 'bg-bar-track group-hover/bar:bg-bar-track-hover'
                  }`}
                  style={{ height: `${h}px` }}
                >
                  <div className="flex flex-none flex-col items-center justify-center gap-0.5" style={{ height: `${h - subH}px` }}>
                    <span className={`max-w-full truncate text-[12px] leading-none ${r.hot ? 'text-white' : 'text-bar-label'}`}>
                      {r.label}
                    </span>
                    {r.sub && <span className="text-[10px] leading-none whitespace-nowrap text-white">{r.sub}</span>}
                  </div>
                  {subH > 0 && (
                    <div
                      className="flex items-center justify-center border-t border-white/25 bg-accent-sub"
                      style={{ height: `${subH}px` }}
                    >
                      <span className="text-[10px] leading-none whitespace-nowrap text-white">autoregr.</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function BenchStrip() {
  return (
    <Reveal>
      <SectionHead maxW="max-w-[480px]">What Apple Silicon delivers today.</SectionHead>
      <div className="shell pt-10 min-[810px]:pt-16">
        <section>
          <div className="flex flex-col items-start gap-2 text-[18px] leading-[1.5] tracking-[0.2px] text-ink [font-variation-settings:'wght'_500] sm:flex-row sm:items-center">
            <span>Qwen 3.6 27B Mirai-M</span>
            <span className="text-label-muted">on</span>
            <span>Apple M5 Max 128GB</span>
          </div>
          <div className="mt-8">
            <div className="relative grid grid-cols-1 overflow-clip rounded-[8px] border-[0.5px] border-cellborder *:border-t-[0.5px] *:border-cellborder min-[810px]:grid-cols-3 min-[810px]:*:border-t-0 min-[810px]:*:border-l-[0.5px] min-[810px]:first:*:border-l-0">
              {PANELS.map((p) => <BenchPanel key={p.title} {...p} />)}
            </div>
          </div>
          <A href="/local-models" className="mt-8 inline-block text-[15px] leading-[1.5] text-ink underline decoration-dotted underline-offset-2 [font-variation-settings:'wght'_500]">
            Explore all metrics →
          </A>
        </section>
      </div>
    </Reveal>
  )
}

/* ------------------------------------------------------------------ */
/* Model cards — 120 + 52 head + 48 + 223 = 443                         */
/* ------------------------------------------------------------------ */

const MODELS = [
  ['Qwen', 'Alibaba', '/shared/icons/qwen.svg'],
  ['LFM', 'LiquidAI', '/shared/icons/liquidai.svg', 'Partner'],
  ['Muse-Glimmer', 'Meta', '/shared/icons/llama.svg'],
  ['Your model', 'Can be next', '/images/models/icon-apple.svg'],
]

export function ModelCards({ title }) {
  return (
    <Reveal>
      <section className="pt-20 min-[810px]:pt-[120px]">
        <div className="shell mb-6 min-[810px]:mb-12">
          <h2 className="type-section-title max-w-[760px] text-ink">{title}</h2>
        </div>
        <div className="shell">
          <div className="grid grid-cols-1 gap-2 min-[1200px]:grid-cols-3 min-[1200px]:gap-x-2.5 min-[1200px]:gap-y-3">
            {MODELS.map(([n, from, mark, chip]) => (
              <A key={n} href="/local-models" className="flex h-[78px] items-center gap-4 border-[0.5px] border-hairline bg-beige p-4 transition-colors hover:bg-beige-hover">
                <img src={mark} alt="" aria-hidden className="size-9 shrink-0 object-contain" />
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate text-[15px] leading-[25.5px] text-ink [font-variation-settings:'opsz'_20,'wght'_450]">{n}</span>
                  <span className="truncate text-[13px] leading-[20.8px] text-ink-soft [font-variation-settings:'opsz'_18,'wght'_450]">{from}</span>
                </span>
                {chip && (
                  <span className="inline-flex h-[30px] shrink-0 items-center border-[0.5px] border-hairline bg-beige-chip px-2.5 text-[15px] leading-[25.5px] text-ink-soft">{chip}</span>
                )}
              </A>
            ))}
          </div>
          <A href="/local-models" className="mt-8 inline-flex items-center gap-1.5 text-[13px] leading-[22.5px] font-medium text-ink hover:opacity-70">
            Explore all models
            <ArrowRight size={14} />
          </A>
        </div>
      </section>
    </Reveal>
  )
}

/* ------------------------------------------------------------------ */
/* Closing band — 20 + 816 = 836. Photo plate with a floating terminal   */
/* card carrying the CTA, exactly as the original composes it.           */
/* ------------------------------------------------------------------ */

export function ClosingBand({ title, blurb }) {
  return (
    <Reveal>
      <section className="min-[810px]:pt-5">
        <div className="w-full min-[810px]:px-6">
          <div className="relative aspect-[390/560] w-full min-[810px]:aspect-auto min-[810px]:h-[816px]">
            <Frame hideOnMobile>
              <SunsetPlate img="/shared/sunset-wide-1920.webp">
                <div className="absolute top-1/2 left-1/2 h-[400px] w-[480px] max-w-[calc(100%-32px)] -translate-x-1/2 -translate-y-1/2">
                  <TerminalCard
                    caption="terminal — mirai"
                    className="h-full"
                    radius="rounded-[10px]"
                    headerClass="h-8 px-3.5 border-hairline"
                    captionClass="text-[12px] leading-[12px] text-ink-soft"
                    bodyClass="p-6 text-[13px] leading-[22.1px]"
                    lines={[
                      ['$ uzu ship --target apple'],
                      ['', 'blank'],
                      [`# ${title}`, 'muted'],
                      ...blurb.split(/(?<=\.)\s+/).map((s) => [`# ${s}`, 'muted']),
                      ['', 'blank'],
                      ['target     iPhone · iPad · Mac'],
                      ['runtime    uzu (Apple Silicon)'],
                      ['quantized  Mirai-M 4-bit'],
                      ['validated  parity vs source'],
                      ['', 'blank'],
                      ['ready.', 'accent'],
                    ]}
                    footer={<div className="shrink-0 p-6 pt-0"><Cta className="!w-full" /></div>}
                  />
                </div>
              </SunsetPlate>
            </Frame>
          </div>
        </div>
      </section>
    </Reveal>
  )
}
