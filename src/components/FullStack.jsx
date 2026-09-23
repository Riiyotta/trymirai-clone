import { Reveal } from './useInView'
import A from './A'

const LAYERS = [
  { n: '1', href: '/local-models', h: 'Local models', b: 'Architectures shaped for memory-bound execution and realtime decoding.' },
  { n: '2', href: '/inference-runtime', h: 'Inference engine', b: 'Hardware-aware optimization of tensor multiplication and the operations around it.' },
  { n: '3', href: '/conversion-optimization-toolkit', h: 'Quantization', b: 'Compress the weights without letting interaction quality or latency collapse.' },
  { n: '4', h: 'Application layer', b: 'We start where you already are: automating your Apple device.' },
]

/* Measured on the original: the first three layer titles are dotted links —
   `color 0.2s cubic-bezier(0.44,0,0.56,1), text-decoration-color 0.2s` same curve,
   6px underline offset (the hero's run at 8px). */
const DOTTED =
  'underline decoration-dotted decoration-muted decoration-2 [text-underline-offset:6px] ' +
  '[transition:color_0.2s_cubic-bezier(0.44,0,0.56,1),text-decoration-color_0.2s_cubic-bezier(0.44,0,0.56,1)] ' +
  'hover:text-accent hover:decoration-accent'

export default function FullStack() {
  return (
    <Reveal>
      <section className="text-white">
        <div className="shell">
          <div className="flex flex-col gap-6 bg-ink p-5 lg:gap-10 lg:px-0 lg:py-10">
            <div className="flex flex-col gap-10 lg:gap-6 lg:px-10">
              <p className="text-[13px] leading-6 text-muted">We are building ...</p>
              <h2 className="type-h2 max-w-[302px] text-white md:max-w-[87%] lg:max-w-[560px]">
                The full on-device stack to achieve realtime local intelligence.
              </h2>
            </div>

            {/* Four full-width 64px rows, divided by hairlines — not a 4-up grid. */}
            <div className="lg:border-t-[0.5px] lg:border-ink-soft">
              {LAYERS.map(({ n, href, h, b }, i) => (
                <div
                  key={n}
                  className={`flex flex-col gap-3 py-6 lg:h-16 lg:flex-row lg:items-center lg:gap-0 lg:px-10 lg:py-0 ${
                    i === LAYERS.length - 1 ? 'pb-0 lg:pb-0' : 'border-b-[0.5px] border-ink-soft'
                  }`}
                >
                  {/* At lg this wrapper goes display:contents so the number and
                      title sit directly on the row, as the original does. */}
                  <div className="flex items-start gap-2 lg:contents">
                    <span className="w-10 shrink-0 text-[13px] text-muted">{n}</span>
                    <h3 className="type-h3 w-[264px] shrink-0 whitespace-nowrap text-white">
                      {href ? <A href={href} className={DOTTED}>{h}</A> : h}
                    </h3>
                  </div>
                  <div className="flex lg:h-full lg:flex-1 lg:items-center lg:px-8">
                    <p className="type-body text-muted">{b}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Reveal>
  )
}
