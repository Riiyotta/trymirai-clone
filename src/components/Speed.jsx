import { useEffect, useState } from 'react'
import { Reveal, useInView } from './useInView'

/**
 * The heading is a counter, not static text: sampling the original showed it
 * running 365 → 639 → 819 → 927 → 980 → 998 → 1,000 at 500ms intervals — a
 * fixed-duration eased tween settling ~3.2s after it scrolls into view.
 */
function TokenCounter() {
  const [ref, inView] = useInView({ threshold: 0.2 })
  const [v, setV] = useState(0)
  useEffect(() => {
    if (!inView) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return setV(1000)
    const D = 3200
    const t0 = performance.now()
    let raf
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / D)
      setV(Math.round((1 - Math.pow(1 - p, 4)) * 1000))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView])
  return <span ref={ref}>{v.toLocaleString('en-US')}</span>
}

const POINTS = [
  { n: '1', h: 'User experience breaks when the model is slow.',
    b: 'Most AI surfaces today are still a box you type into and then wait on. Past roughly 200ms of loading, attention leaves the room.' },
  { n: '2', h: 'The user sees 1 response. The model generates 100+ internally.',
    b: 'A single answer hides parsing, validation, tool calls and reasoning — each one a separate internal pass that costs time.' },
  { n: '3', h: 'Your AI should be fast enough that you don’t notice it at all.',
    b: 'Exchanges feel natural when both sides take in and give back information at the same moment, not in turns.' },
]

/**
 * Chart geometry, read off the original.
 *
 * The important correction: there are not two diverging curves. The original
 * draws **one** curve four times — slow area fill, fast area fill, grey stroke,
 * accent stroke — all on identical point data, stacked in that order. Inventing
 * a second, faster curve is what produced an over-heavy orange wedge here before.
 *
 * viewBox 720x300, 81 points from x48 to x672 (7.8 apart), flat at y214 for the
 * first twelve, then an S-curve to y70. Areas close at y242, not the viewBox floor.
 */
const X0 = 48, STEP = 7.8, AREA_FLOOR = 242
const YS = [
  214.00, 214.00, 214.00, 214.00, 214.00, 214.00, 214.00, 214.00, 214.00, 214.00,
  214.00, 214.00, 213.94, 213.71, 213.30, 212.73, 212.00, 211.10, 210.06, 208.87,
  207.54, 206.07, 204.47, 202.75, 200.90, 198.94, 196.88, 194.70, 192.43, 190.07,
  187.62, 185.08, 182.47, 179.79, 177.04, 174.23, 171.36, 168.44, 165.47, 162.47,
  159.43, 156.36, 153.26, 150.15, 147.02, 143.88, 140.74, 137.61, 134.48, 131.36,
  128.26, 125.19, 122.14, 119.13, 116.15, 113.22, 110.34, 107.52, 104.76, 102.06,
  99.43, 96.88, 94.41, 92.03, 89.74, 87.55, 85.46, 83.48, 81.61, 79.87,
  78.24, 76.75, 75.39, 74.17, 73.09, 72.17, 71.40, 70.80, 70.36, 70.09, 70.00,
]

const PTS = YS.map((y, i) => [X0 + i * STEP, y])
const CURVE = PTS.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(2)} ${y.toFixed(2)}`).join(' ')
const AREA = `${CURVE} L${PTS[PTS.length - 1][0]} ${AREA_FLOOR} L${X0} ${AREA_FLOOR} Z`

function SpeedChart() {
  const [ref, inView] = useInView({ threshold: 0.25 })
  const draw = { transition: 'stroke-dashoffset 1.8s cubic-bezier(0.22,1,0.36,1)' }
  return (
    <div ref={ref} className="relative h-full w-full">
      <svg viewBox="0 0 720 300" preserveAspectRatio="none" className="h-full w-full" aria-hidden>
        <defs>
          <linearGradient id="slowFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8F8F8F" stopOpacity="0.32" />
            <stop offset="100%" stopColor="#8F8F8F" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="fastFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FF6A20" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#FF6A20" stopOpacity="0" />
          </linearGradient>
        </defs>

        {[92, 142, 192].map((y) => (
          <line key={y} x1="48" y1={y} x2="672" y2={y} stroke="#CCCCCC" strokeWidth="1" strokeDasharray="3 7" vectorEffect="non-scaling-stroke" />
        ))}

        {/* two area fills stacked on the same curve, then both strokes */}
        <path d={AREA} fill="url(#slowFill)" opacity={inView ? 1 : 0} style={{ transition: 'opacity 1s ease 0.5s' }} />
        <path d={AREA} fill="url(#fastFill)" opacity={inView ? 1 : 0} style={{ transition: 'opacity 1s ease 0.6s' }} />

        <path d={CURVE} fill="none" stroke="#8F8F8F" strokeWidth="1" vectorEffect="non-scaling-stroke"
          style={{ ...draw, strokeDasharray: 900, strokeDashoffset: inView ? 0 : 900 }} />
        <path d={CURVE} fill="none" stroke="#FF6A20" strokeWidth="1" vectorEffect="non-scaling-stroke"
          style={{ ...draw, transitionDelay: '0.15s', strokeDasharray: 900, strokeDashoffset: inView ? 0 : 900 }} />

        <line x1="360" y1="34" x2="360" y2="256" stroke="#FF6A20" strokeWidth="1" strokeDasharray="4 6" vectorEffect="non-scaling-stroke" />
      </svg>

      {/* Labels, positioned as measured against the 1296x454 plot */}
      <div className="pointer-events-none absolute inset-0">
        <span className="absolute rounded-[999px] bg-white px-3 py-1 text-[15px] leading-[21px] text-ink" style={{ left: '46.6%', top: '12.8%' }}>
          1,000 t/s
        </span>
        <span className="absolute text-[15px] leading-[19px] text-muted" style={{ left: '6.9%', top: '82.8%' }}>thinking...</span>
        <span className="absolute text-[15px] leading-[19px] text-accent" style={{ left: '79.5%', top: '17.8%' }}>renders almost instantly</span>
        <span className="absolute flex items-center gap-1.5 text-[15px] leading-[19px] text-accent" style={{ left: '53.2%', top: '39.4%' }}>
          <span className="threshold-dot size-1.5 rounded-full bg-accent" />rendering UI
        </span>
      </div>
    </div>
  )
}

export default function Speed() {
  return (
    <Reveal>
      <section className="text-white">
        <div className="shell">
          <div className="overflow-hidden bg-ink p-6 lg:p-10">
            <div className="flex flex-col gap-3">
              <p className="text-[13px] leading-[20.8px] text-muted">Execution speed we are aiming for ...</p>
              <h2 className="type-h2-lg max-w-[900px] text-white"><TokenCounter /> t/s is where models become interfaces.</h2>
            </div>

            <div className="mt-6 h-[387px] overflow-hidden md:-mx-[88px] md:mt-[35px] md:h-[454px]">
              <div className="relative left-1/2 h-[454px] w-[300%] -translate-x-1/2 md:left-auto md:h-full md:w-full md:translate-x-0">
                <SpeedChart />
              </div>
            </div>

            <div className="-mx-6 border-t border-ink-soft px-6 lg:-mx-10 lg:px-10">
              <div className="grid grid-cols-1 gap-6 pt-6 lg:grid-cols-[repeat(3,333.333px)] lg:gap-10 lg:pt-10">
                {POINTS.map(({ n, h, b }) => (
                  <div key={n} className="flex flex-col gap-4 lg:gap-8">
                    <span className="text-[13px] text-muted">{n}</span>
                    <h3 className="type-h3 text-white">{h}</h3>
                    <p className="text-[15px] leading-[25.5px] text-muted">{b}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </Reveal>
  )
}
