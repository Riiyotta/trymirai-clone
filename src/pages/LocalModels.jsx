import { useState } from 'react'
import { useMeta } from '../components/Page'

/**
 * Rebuilt against the current live design (the page was redesigned):
 * three family sections, each a chip row selecting one checkpoint, and one
 * card showing that checkpoint's two quantization variants.
 *
 * Geometry is measured. Speed/size figures are representative placeholders for
 * this clone, not Mirai's published measurements.
 */
const FAMILIES = [
  {
    family: 'Qwen', from: 'from Alibaba', logo: '/shared/icons/qwen.svg',
    checkpoints: [
      { v: 'Qwen 3.8', size: '27B', m: ['80 tok/s', '15.5 GB'], l: ['58 tok/s', '28.8 GB'] },
      { v: 'Qwen 3.6', size: '27B', m: ['115 tok/s', '15.6 GB'], l: ['80 tok/s', '28.8 GB'] },
      { v: 'Qwen 3.5', size: '9B', m: ['265 tok/s', '5.1 GB'], l: ['225 tok/s', '9.4 GB'] },
      { v: 'Qwen 3.5', size: '4B', m: ['160 tok/s', '2.3 GB'], l: ['100 tok/s', '4.2 GB'] },
      { v: 'Qwen 3.5', size: '2B', m: ['320 tok/s', '1.1 GB'], l: ['205 tok/s', '2.0 GB'] },
      { v: 'Qwen 3.5', size: '0.8B', m: ['520 tok/s', '460 MB'], l: ['390 tok/s', '824 MB'] },
    ],
  },
  {
    family: 'LFM', from: 'from LiquidAI', logo: '/shared/icons/liquidai.svg',
    checkpoints: [
      { v: 'LFM 2.5', size: '2.6B', m: ['285 tok/s', '1.5 GB'], l: ['172 tok/s', '2.8 GB'] },
      { v: 'LFM 2.5', size: '1.2B Thinking', m: ['590 tok/s', '690 MB'], l: ['380 tok/s', '1.3 GB'] },
      { v: 'LFM 2.5', size: '1.2B Instruct', m: ['580 tok/s', '690 MB'], l: ['365 tok/s', '1.3 GB'] },
      { v: 'LFM 2.5', size: '350M', m: ['1120 tok/s', '198 MB'], l: ['840 tok/s', '370 MB'] },
      { v: 'LFM 2.5', size: '230M', m: ['1400 tok/s', '130 MB'], l: ['1120 tok/s', '243 MB'] },
    ],
  },
  {
    family: 'Muse Glimmer', from: 'from Meta', logo: '/shared/icons/llama.svg',
    checkpoints: [
      { v: 'Muse Glimmer', size: '30B', m: ['85 tok/s', '16.5 GB'], l: ['57 tok/s', '30.2 GB'] },
    ],
  },
]

/* 568x86 variant panel: label + device note left, speed/size right. */
function Variant({ label, speed, size }) {
  return (
    <div className="relative flex flex-1 items-start justify-between gap-4 rounded-[12px] border-[0.5px] border-cellborder bg-white p-5">
      <span className="flex min-w-0 flex-col">
        <span className="text-[15px] leading-[22.5px] text-ink">{label}</span>
        <span className="text-[13px] leading-[19.5px] text-label-muted">Apple M5 Max 128GB</span>
      </span>
      <span className="flex shrink-0 flex-col items-end">
        <span className="text-[15px] leading-[22.5px] text-ink">{speed}</span>
        <span className="text-[13px] leading-[19.5px] text-label-muted">{size}</span>
      </span>
    </div>
  )
}

function Family({ family, from, logo, checkpoints, first }) {
  const [sel, setSel] = useState(0)
  const c = checkpoints[sel]

  return (
    <section className={`border-b-[0.5px] border-cellborder py-[40.5px] ${first ? 'border-t-[0.5px]' : ''}`}>
      <h2 className="flex items-center gap-3 text-[20px] leading-[26px] text-ink">
        <img src={logo} alt="" aria-hidden className="size-4 shrink-0 object-contain md:size-6" />
        <span>
          {family} models <span className="text-label-muted">{from}</span>
        </span>
      </h2>

      <div className="mt-10 flex flex-col gap-4 md:gap-6">
        {/* Chip row — selects which checkpoint the card below shows */}
        {checkpoints.length > 1 && (
          <div className="-mx-5 flex gap-3 overflow-x-auto px-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {checkpoints.map((cp, i) => (
              <button
                key={`${cp.v}-${cp.size}`}
                onClick={() => setSel(i)}
                aria-pressed={i === sel}
                className={`flex h-[37px] shrink-0 items-center gap-2 rounded-[8px] border-[0.5px] border-chipborder px-3 py-2 text-[15px] leading-[19.5px] transition-colors ${
                  i === sel ? 'bg-chipfill' : 'bg-transparent hover:bg-chipfill/60'
                }`}
              >
                <span className="text-ink">{cp.v}</span>
                <span className="text-label-muted">{cp.size}</span>
              </button>
            ))}
          </div>
        )}

        {/* Checkpoint card */}
        <div className="flex flex-col gap-6 rounded-[20px] border-[0.5px] border-cellborder bg-chrome p-6">
          <div className="flex items-center gap-4 md:gap-6">
            <span className="flex size-[76px] shrink-0 items-center justify-center rounded-[12px] border-[0.5px] border-chipborder bg-white">
              <img src={logo} alt="" aria-hidden className="size-6 object-contain md:size-10" />
            </span>
            <div className="flex min-w-0 flex-col gap-0.5 md:gap-2">
              <h3 className="text-[20px] leading-[1.3] text-ink md:text-[28px] md:leading-[36.4px]">
                {c.v} {c.size}
              </h3>
              <p className="text-[13px] leading-[1.3] text-label-muted md:text-[15px] md:leading-[22.5px]">
                2 available checkpoints
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 md:flex-row md:gap-4">
            <Variant label="Medium" speed={c.m[0]} size={c.m[1]} />
            <Variant label="Large" speed={c.l[0]} size={c.l[1]} />
          </div>
        </div>
      </div>
    </section>
  )
}

export default function LocalModels() {
  useMeta(
    'Local LLM library for Apple Silicon | Mirai Labs',
    'Qwen, LFM and Muse-Glimmer checkpoints in 4-bit and 8-bit for Apple Silicon, with measured uzu tok/s for every checkpoint.',
  )
  return (
    <div className="shell">
      {/* h1 sits in its own 64px band, with no intro paragraph on this page */}
      <h1 className="type-h1-page max-w-[984px] py-16 text-foreground">
        AI model library, optimized for on-device inference.
      </h1>

      {FAMILIES.map((f, i) => (
        <Family key={f.family} {...f} first={i === 0} />
      ))}
    </div>
  )
}
