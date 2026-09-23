import { useState } from 'react'
import { useMeta } from '../components/Page'

/* Measured against the live page: a 200px nav on the LEFT, a 1000px content
   column, panels at radius 8 with #E5E5E5 rules, sections 633/633/633/493/264.
   Figures are representative placeholders for this clone. */
const RUNNERS = ['uzu', 'MLX', 'MTPLX', 'llama.cpp']

const OUTPUT = [
  ['LFM2.5 1.2B Thinking', 588], ['LFM2.5 1.2B Instruct', 578], ['LFM2.5 1.2B Thinking L', 380],
  ['LFM2.5 1.2B Instruct L', 367], ['Qwen 3.5 2B', 318], ['LFM2.5 2.6B', 284],
  ['Qwen 3.5 9B', 264], ['Qwen 3.5 9B L', 224], ['Qwen 3.5 2B L', 204],
  ['LFM2.5 2.6B L', 172], ['Qwen 3.5 4B', 160], ['Qwen 3.5 4B L', 100],
]
const INPUT = [
  ['LFM2.5 2.6B', 2980], ['LFM2.5 1.2B Instruct', 2640], ['Qwen 3.5 2B', 2110],
  ['Qwen 3.5 9B', 1640], ['Qwen 3.5 4B', 1280], ['Qwen 3.6 27B', 872],
  ['Qwen 3.5 9B L', 760], ['LFM2.5 2.6B L', 640],
]
const MEMORY = [
  ['LFM2.5 230M', 0.2], ['LFM2.5 1.2B Instruct', 0.7], ['Qwen 3.5 2B', 1.1],
  ['LFM2.5 2.6B', 1.5], ['Qwen 3.5 4B', 2.3], ['Qwen 3.5 9B', 5.1],
  ['Qwen 3.6 27B', 15.4], ['Muse-Glimmer 30B', 16.5],
]

const NAV = [
  ['output', 'Output speed'], ['input', 'Input speed'], ['memory', 'Resident memory'],
  ['quality', 'Quantization quality'], ['how', 'How we measure'],
]

function Chart({ rows, lowerBetter }) {
  const max = Math.max(...rows.map((r) => r[1]))
  const best = lowerBetter ? Math.min(...rows.map((r) => r[1])) : max
  return (
    <div className="benchmark-scroll w-full overflow-x-auto px-6">
      <div className="min-w-max">
        <div className="flex items-end gap-3" style={{ height: 290 }}>
          {rows.map(([label, v]) => (
            <div key={label} className="group/bar flex w-[52px] flex-col items-center justify-end gap-2">
              <span className="text-[11px] text-ink">{v}</span>
              {/* Same measured behaviour as the product-page strip: no entry
                  animation, no count-up, hover shade only (0.15s, Tailwind's
                  default cubic-bezier(0.4,0,0.2,1)). */}
              <div className={`w-full rounded-t-[4px] transition-colors duration-150 ${
                  v === best ? 'bg-accent group-hover/bar:bg-accent-hover' : 'bg-bar-track group-hover/bar:bg-bar-track-hover'
                }`}
                style={{ height: `${Math.max(4, (v / max) * 236)}px` }} />
            </div>
          ))}
        </div>
        <div className="mt-3 flex gap-3 border-t-[0.5px] border-cellborder pt-3">
          {rows.map(([label]) => (
            <span key={label} className="w-[52px] text-center text-[10px] leading-tight text-label-muted">
              {label.split(' ').slice(0, 2).join(' ')}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

/* 633px panel: 134.5 header, 40 sub-bar, ~321 chart, then the two footer rows. */
function ChartPanel({ id, title, rows, unit, note, lowerBetter, count }) {
  return (
    <section id={id} className="scroll-mt-[136px] overflow-hidden rounded-[8px] border-[0.5px] border-cellborder">
      <div className="flex flex-col gap-6 border-b-[0.5px] border-cellborder p-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-[15px] leading-[1.5] text-ink">{title}</h2>
          <span className="text-[13px] leading-[16.9px] text-label-muted">{count} of 24 models</span>
        </div>
        <div className="flex h-8 flex-wrap items-center gap-2">
          <span className="flex h-8 items-center pr-3 text-[13px] text-ink-soft">Apple M5 Max 128GB</span>
          {RUNNERS.map((r, i) => (
            <span key={r} className="flex items-center gap-1.5 text-[12px] text-ink-soft">
              <span className={`size-2 ${i === 0 ? 'bg-accent' : 'bg-ink/15'}`} />{r}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-x-6 px-6 pt-4 pb-2 text-[13px] leading-[13px] text-label-muted">
        <span>uzu is the fastest in {count} of {count} models on this device.</span>
        <span>{unit} • {note}</span>
      </div>

      <Chart rows={rows} lowerBetter={lowerBetter} />

      <div className="flex items-center gap-5 border-t-[0.5px] border-cellborder px-6 py-5">
        <span className="text-[13px] text-label-muted">uzu 0.3.1</span>
        <span className="text-[13px] text-label-muted">MLX 0.22</span>
        <span className="text-[13px] text-label-muted">llama.cpp b4600</span>
      </div>
      <p className="border-t-[0.5px] border-cellborder px-6 py-5 text-[13px] leading-[19.5px] text-label-muted">
        Every runner is executed back to back on one machine in a single thermal state, with the same prompt
        set and generation length.{' '}
        <a href="#how" className="text-ink underline decoration-dotted underline-offset-4 hover:opacity-70">
          How we measure
        </a>
      </p>
    </section>
  )
}

export default function Metrics() {
  useMeta(
    'uzu vs MLX vs llama.cpp: Apple Silicon LLM Benchmarks',
    'We compare uzu, MLX and llama.cpp locally on the same Apple device, across output speed, input speed and resident memory.',
  )
  const [active, setActive] = useState('output')

  return (
    <div className="shell py-5 md:py-12">
      <div className="mb-3 flex flex-col gap-3">
        <h1 className="font-serif text-[40px] leading-[52px] text-foreground">Metrics</h1>
        <p className="text-[13px] leading-[16.9px] text-[#A3A3A3]">Benchmarked on a single Apple device</p>
      </div>
      <p className="mb-8 max-w-[520px] text-[15px] leading-[22.5px] text-label-muted">
        We compare uzu, MLX and llama.cpp locally on the same Apple device.
      </p>

      <div className="flex gap-0">
        {/* The nav sits on the LEFT of the content column on the original */}
        <nav className="hidden w-[200px] shrink-0 min-[1200px]:block">
          <div className="sticky top-[113px] flex flex-col items-start gap-6">
            {NAV.map(([id, label]) => (
              <a
                key={id} href={`#${id}`} onClick={() => setActive(id)}
                className={`block text-[13px] leading-[16.9px] transition-colors ${
                  active === id ? 'text-ink' : 'text-label-muted hover:text-ink'
                }`}
              >
                {label}
              </a>
            ))}
          </div>
        </nav>

        <div className="flex min-w-0 flex-1 flex-col gap-6">
          <ChartPanel id="output" title="Output speed" count={12} rows={OUTPUT} unit="tok/s" note="Higher is better ↑" />
          <ChartPanel id="input" title="Input speed" count={8} rows={INPUT} unit="tok/s" note="Higher is better ↑" />
          <ChartPanel id="memory" title="Resident memory" count={8} rows={MEMORY} unit="GB" note="Lower is better ↓" lowerBetter />

          <section id="quality" className="scroll-mt-[136px] overflow-hidden rounded-[8px] border-[0.5px] border-cellborder">
            <div className="flex flex-col gap-3 border-b-[0.5px] border-cellborder p-6">
              <h2 className="text-[15px] leading-[1.5] text-ink">Quantization quality</h2>
              <p className="max-w-[720px] text-[13px] leading-[19.5px] text-label-muted">
                How much task accuracy survives compression, measured per checkpoint against its unquantized
                baseline.
              </p>
            </div>
            <div className="px-6 py-6">
              <div className="relative h-[300px] w-full rounded-[8px] border-[0.5px] border-cellborder bg-cream">
                {[[12,22],[22,30],[31,26],[40,38],[48,34],[57,44],[66,40],[74,52],[83,48],[90,60]].map(([x,y],i)=>(
                  <span key={i} className={`absolute size-2 rounded-full ${i%3===0?'bg-accent':'bg-ink/25'}`}
                    style={{ left: `${x}%`, bottom: `${y}%` }} />
                ))}
                <span className="absolute bottom-3 left-4 text-[11px] text-label-muted">speed →</span>
                <span className="absolute top-3 left-4 text-[11px] text-label-muted">↑ quality retained</span>
              </div>
            </div>
          </section>

          <section id="how" className="mt-6 scroll-mt-[136px] border-y-[0.5px] border-cellborder">
            <h2 className="border-b-[0.5px] border-cellborder px-6 py-4 text-[15px] leading-[1.5] text-ink">
              How we measure
            </h2>
            <div className="space-y-6 px-6 py-5 text-[15px] leading-[1.6] text-label-muted">
              <p>
                Every runner is executed back to back on one machine, in one thermal state, with the same
                prompt set and generation length. Numbers measured on different hardware are not comparable
                and we do not mix them.
              </p>
              <p>
                Resident memory is sampled at steady state rather than at peak, because peak describes the
                loader while steady state tells you whether the model can live on the device alongside
                everything else.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
