import { useMeta } from '../components/Page'
import { Reveal } from '../components/useInView'
import {
  PerfectFor, Faq, BenchStrip, ModelCards, ClosingBand,
  HeroRule, Cta, Frame, SunsetPlate, TerminalCard,
} from '../components/Shared'
import A from '../components/A'

/* Two 588x766 cards side by side, then a full-width 1200x227 panel. */
const BIG_CARDS = [
  {
    eyebrow: 'For popular architectures',
    h: 'Convert in one command.',
    b: 'If your model is built on a common architecture — including your own fine-tunes and adaptations of it — conversion is a single command with nothing to hand-write.',
    points: ['Out-of-the-box converter for popular model families.', 'Fine-tunes and adaptations supported.', 'Fetches checkpoints and converts them automatically.'],
    cta: 'See the supported families',
    lines: [
      ['> uv run lalamo convert "LiquidAI/LFM2-1.2B"', 'ink'],
      ['Converting LFM2-1.2B by LiquidAI.'],
      ['Using weight layout auto.'],
      ['', 'blank'],
      ['', 'blank'],
      ['Saved to models/LFM2-1.2B', 'accent'],
      ['Parity checked against source.'],
      ['4-bit · 680 MB · 12.4s'],
      ['', 'blank'],
      ['>', 'caret'],
    ],
  },
  {
    eyebrow: 'For everything else',
    h: 'Add new architectures easily.',
    b: 'New architectures are described declaratively rather than hand-ported, so adding support does not mean writing kernels from scratch for every block.',
    points: ['Declarative architecture definitions.', 'Reuses the existing operator set.', 'No bespoke kernel work for standard layers.'],
    cta: 'Read the architecture guide',
    lines: [
      ['> uv run lalamo convert "Qwen/Qwen3.5-0.8B"', 'ink'],
      ['Converting Qwen3.5-0.8B by Qwen.'],
      ['Using weight layout auto.'],
      ['', 'blank'],
      ['', 'blank'],
      ['Model successfully validated.', 'accent'],
      ['Saved to models/Qwen3.5-0.8B'],
      ['4-bit · 520 MB · 9.8s'],
      ['', 'blank'],
      ['>', 'caret'],
    ],
  },
]

const PIPELINE = [
  { icon: '/conversion-optimization-toolkit/icons/draft-model.svg', h: 'Draft model training for speculative decoding.', b: 'We train the draft model alongside the target so the pair actually accelerates generation, rather than thrashing on rejected tokens and losing what it gained.' },
  { icon: '/conversion-optimization-toolkit/icons/quantization.svg', h: 'Quantization with minimal quality loss.', b: 'The scheme is chosen per checkpoint and validated against the unquantized baseline, so compression does not quietly cost you task accuracy.' },
  { icon: '/conversion-optimization-toolkit/icons/validation.svg', h: 'Output correctness and quality validation.', b: 'Every converted model is checked for numerical parity with its source before it ships, so a conversion bug cannot reach a device unnoticed.' },
]

const FAQ = [
  { q: 'What formats do you accept?', a: 'Standard checkpoint formats for supported architectures, including fine-tunes and adaptations built on top of those architectures.' },
  { q: 'What comes out the other end?', a: 'An intermediate representation built from a unified operator set, which the inference engine executes directly on Apple Silicon.' },
  { q: 'How long does conversion take?', a: 'For a supported architecture it is one command and finishes in minutes. Custom or non-standard layers add a review step before the run.' },
  { q: 'Do you validate quality?', a: 'Yes — numerical parity against the source model, plus task-level checks, so quantization loss is measured rather than assumed.' },
  { q: 'Can you handle custom layers?', a: 'Non-standard layers are reviewed case by case, so an unusual block inside an otherwise standard model does not rule it out.' },
  { q: 'Who runs the optimization?', a: 'We do, as a toolkit alongside the runtime — draft-model training, quantization and validation are part of the same pipeline.' },
]

const Check = () => (
  <svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="mt-[5px] shrink-0" aria-hidden>
    <polyline points="3 8.5 6.5 12 13 4" />
  </svg>
)

const ArrowRight = ({ size = 18 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <line x1="5" y1="12" x2="18" y2="12" /><polyline points="12 6 18 12 12 18" />
  </svg>
)

export default function ConversionToolkit() {
  useMeta(
    'Conversion and optimization toolkit | Mirai Labs',
    'Convert and optimize your model for iPhone, iPad and Mac — one command to get it running on Apple devices.',
  )
  return (
    <>
      {/* Hero — 64 + 600. */}
      <section className="pt-6 min-[810px]:pt-14 min-[1200px]:pt-16">
        <div className="shell">
          <div className="flex flex-col gap-8 min-[810px]:gap-20 min-[1200px]:flex-row min-[1200px]:items-stretch min-[1200px]:gap-10">
            <div className="flex flex-col min-[1200px]:w-[572px] min-[1200px]:shrink-0 min-[1200px]:justify-between">
              <div className="flex flex-col">
                <span className="type-eyebrow text-ink-muted">Conversion and optimization toolkit</span>
                <HeroRule className="mt-8" />
                <h1 className="product-hero-title mt-5 max-w-[265px] text-ink md:mt-8 min-[810px]:max-w-[671px] min-[1200px]:max-w-[470px]">
                  Convert and optimize your model for iPhone, iPad and Mac.
                </h1>
              </div>
              <div className="mt-10 flex flex-col min-[810px]:mt-8 min-[1200px]:mt-0">
                <p className="type-pbody max-w-[541px] text-ink-soft">
                  One command to get your model running on the two billion Apple devices people already carry.
                </p>
                <HeroRule className="mt-8" />
                <div className="mt-8 min-[810px]:mt-10"><Cta /></div>
              </div>
            </div>

            <div className="min-[1200px]:flex-1">
              <div className="aspect-[390/380] w-full min-[810px]:aspect-[960/600] min-[1200px]:aspect-auto min-[1200px]:h-[600px]">
                <Frame tight hideOnMobile>
                  <SunsetPlate>
                    <div className="absolute top-[6%] left-1/2 h-[89.333%] w-[88.811%] -translate-x-1/2">
                      <TerminalCard
                        caption="lalamo — convert"
                        className="h-full"
                        headerClass="h-10 px-3.5"
                        bodyClass="p-5 text-[14px] leading-[23.8px]"
                        lines={[
                          ['> uv run lalamo convert "LiquidAI/LFM2-1.2B"', 'ink'],
                          ['', 'blank'],
                          ['Converting LFM2-1.2B by LiquidAI.'],
                          ['Using weight layout auto.'],
                          ['Quantizing … Mirai-M (4-bit)'],
                          ['', 'blank'],
                          ['Validating against source …', 'muted'],
                          ['  logits parity        ok'],
                          ['  task-level checks    ok'],
                          ['', 'blank'],
                          ['Saved to models/LFM2-1.2B', 'accent'],
                          ['12.4s · 1.2B params · 4-bit · 680 MB'],
                          ['', 'blank'],
                          ['>', 'caret'],
                        ]}
                      />
                    </div>
                  </SunsetPlate>
                </Frame>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Two 766px cards, then the wide 227px panel — 120 + 1018 = 1138. */}
      <Reveal>
        <section className="pt-0 min-[810px]:pt-[120px]">
          <div className="shell !px-0 min-[810px]:!px-6 min-[1200px]:!px-0">
            <div className="grid grid-cols-1 gap-0 min-[810px]:gap-6 min-[1200px]:grid-cols-2">
              {BIG_CARDS.map(({ eyebrow, h, b, points, cta, lines }) => (
                <div key={h} className="flex min-h-[766px] flex-col overflow-hidden border-[0.5px] border-hairline bg-beige">
                  <div className="flex flex-col px-5 pt-16 min-[810px]:pt-7">
                    <span className="inline-flex self-start border-[0.5px] border-hairline bg-beige-chip px-3 py-[5px] text-[15px] leading-[25.5px] text-ink">{eyebrow}</span>
                    <h3 className="type-routing-title mt-7 text-ink min-[810px]:mt-12">{h}</h3>
                    <p className="mt-4 text-[15px] leading-[25.5px] text-ink-soft min-[1200px]:min-h-[77px]">{b}</p>
                    <ul className="mt-8 hidden flex-col gap-3 min-[810px]:flex min-[810px]:mt-12 min-[1200px]:mt-[22px]">
                      {points.map((pt) => (
                        <li key={pt} className="flex gap-2 text-[15px] leading-[25.5px] text-ink-muted">
                          <Check /><span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-5 border-t border-hairline" />
                  <div className="px-5 py-5">
                    <A href="/i-am-interested" className="inline-flex items-center gap-2 text-[15px] leading-[22.5px] font-medium text-ink hover:opacity-70">
                      {cta}<ArrowRight />
                    </A>
                  </div>
                  <div className="relative mt-auto h-[314px] w-full overflow-hidden min-[810px]:h-[492px] min-[1200px]:h-[314px]">
                    <img src="/shared/sunset-1920.webp" alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover" />
                    <div className="absolute inset-x-6 top-6 h-[274px]">
                      <TerminalCard
                        caption=""
                        className="h-full"
                        headerClass="h-10 px-4"
                        bodyClass="p-6 text-[12px] leading-[20.4px]"
                        lines={lines}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-0 flex flex-col border-[0.5px] border-hairline bg-beige min-[810px]:mt-6">
              <div className="flex flex-col px-5 pt-5 min-[810px]:px-12 min-[810px]:pt-6 min-[1200px]:px-6 min-[1200px]:pt-6">
                <h3 className="type-routing-title text-ink min-[810px]:max-w-[571px] min-[1200px]:max-w-none">Mirai can support your custom / non&#8209;standard layers.</h3>
                <p className="mt-4 max-w-[600px] text-[15px] leading-[25.5px] text-ink-soft min-[810px]:max-w-[346px] min-[1200px]:max-w-[680px]">
                  An unusual block inside an otherwise standard model does not rule it out. We review custom
                  layers individually and check numerical parity against the source before anything ships.
                </p>
              </div>
              <div className="mt-5 border-t border-hairline min-[810px]:mt-12 min-[1200px]:mt-6" />
              <div className="px-5 py-5 min-[810px]:px-12 min-[810px]:pt-12 min-[1200px]:px-6 min-[1200px]:py-6">
                <A href="/i-am-interested" className="inline-flex items-center gap-2 text-[15px] leading-[22.5px] font-medium text-ink hover:opacity-70">
                  Tell us about your architecture<ArrowRight />
                </A>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      {/* Pipeline — 86 + 104 head, then 48 + 309 cards = 547. */}
      <Reveal>
        <div className="shell pt-20 min-[810px]:pt-[86px]">
          <h2 className="type-section-title max-w-[750px] text-ink">
            Our optimization pipeline prepares your model for peak on-device performance.
          </h2>
        </div>
        <section className="pt-10 min-[810px]:pt-12">
          <div className="shell">
            <div className="grid grid-cols-1 gap-6 min-[1200px]:grid-cols-3">
              {PIPELINE.map(({ icon, h, b }) => (
                <div key={h} className="flex min-h-[309px] flex-col border-[0.5px] border-hairline bg-beige p-5 md:p-6">
                  <img src={icon} alt="" aria-hidden className="size-10 object-contain" />
                  <h3 className="type-card-title mt-6 text-ink md:mt-6 min-[1200px]:mt-10">{h}</h3>
                  <p className="mt-6 text-[15px] leading-[25.5px] text-ink-soft md:mt-4">{b}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      <BenchStrip />
      <ModelCards title="Models already running on Mirai." />
      <PerfectFor title="Optimize your model for 2 billion Apple devices. Perfect for:" />
      <Faq items={FAQ} />
      <ClosingBand
        title="Bring your model to every Apple device."
        blurb="Converted, quantized, validated against the source, and shipped behind one API."
      />
    </>
  )
}
