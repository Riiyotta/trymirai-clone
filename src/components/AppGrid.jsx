import { useEffect, useState } from 'react'
import { Reveal } from './useInView'

const APPS = ['rides', 'bank', 'calendar', 'files', 'messages', 'photos', 'mail', 'maps', 'docs']
const NODES = ['Chase', 'Calendar', 'Files', 'Uber']

/* Connector curves, read off the original's SVG (viewBox 0 0 100 100).
   All four converge on (55.8, 47). */
const WIRES = [
  'M 28.9 22 C 40.198 24, 44.502 45, 55.8 47',
  'M 28.9 40 C 40.198 40.56, 44.502 46.44, 55.8 47',
  'M 28.9 58 C 40.198 57.12, 44.502 47.88, 55.8 47',
  'M 28.9 76 C 40.198 73.68, 44.502 49.32, 55.8 47',
]

/**
 * Left art: a 3x3 of app dots. Cells sit at x 184/271/358 and y 76/172/268
 * inside the 600x400 panel; each is a 56x56 well holding a 29px dot, with a
 * 9px label 62px down.
 *
 * Measured on the original: the tiles do NOT have pulse rings and no tile is
 * permanently accent-coloured. Instead a single highlight walks the grid in
 * index order, one tile every ~890ms, lifting that tile from opacity 0.8 to 1.
 * Each tile carries `opacity 180ms ease, transform 220ms cubic-bezier(0.32,0.72,0,1)`.
 */
function GridArt() {
  const [active, setActive] = useState(0)
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = setInterval(() => setActive(a => (a + 1) % APPS.length), 890)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="relative h-full w-full overflow-hidden bg-cream">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden>
        <polyline points="35.5,26 35.5,26 64.5,74" fill="none" stroke="#525252" strokeWidth="0.2" opacity="0.26" />
      </svg>

      {APPS.map((label, i) => {
        const col = i % 3, row = (i / 3) | 0
        return (
          <div
            key={label}
            className="absolute flex w-14 flex-col items-center"
            style={{
              left: 184 + col * 87,
              top: 76 + row * 96,
              opacity: active === i ? 1 : 0.8,
              transform: 'scale(1)',
              transition: 'opacity 180ms, transform 220ms cubic-bezier(0.32, 0.72, 0, 1)',
            }}
          >
            <div className="flex size-14 items-center justify-center rounded-[32px] border border-rail">
              <span className="size-[29px] rounded-full bg-black" />
            </div>
            <span className="mt-[6px] text-[9px] leading-none text-[rgba(28,28,28,0.48)]">{label}</span>
          </div>
        )
      })}
    </div>
  )
}

/**
 * Right art: four service nodes on the left, wired by dashed curves into a
 * single orange convergence square at (329,182), with the instruction beside it.
 * Each wire is drawn twice — a static grey dashed base and an orange dashed
 * overlay whose offset animates, which is what makes the flow read as movement.
 */
function ConvergeArt() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-cream">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden>
        {WIRES.map((d, i) => (
          <g key={d}>
            <path d={d} fill="none" stroke="#E6E6E6" strokeWidth="1" strokeDasharray="12 15" opacity="0.5" vectorEffect="non-scaling-stroke" />
            <path
              d={d} fill="none" stroke="#FF6A20" strokeWidth="1" pathLength="100"
              strokeDasharray="75 25" strokeDashoffset="100" vectorEffect="non-scaling-stroke"
            >
              {/* Measured on the original: SMIL, stroke-dashoffset 100 -> 0,
                  dur 3.2s, repeatCount indefinite, begin staggered 0.35s per wire. */}
              <animate
                attributeName="stroke-dashoffset" from="100" to="0"
                dur="3.2s" begin={`${i * 0.35}s`} repeatCount="indefinite"
              />
            </path>
          </g>
        ))}
      </svg>

      {NODES.map((n, i) => (
        <div key={n} className="absolute flex items-center" style={{ left: 36, top: 64 + i * 72 }}>
          <div className="flex size-12 items-center justify-center rounded-[32px]">
            <span className="size-[25px] rounded-full bg-ink" />
          </div>
          <span className="ml-3 text-[15px] leading-none text-ink">{n}</span>
        </div>
      ))}

      <span className="absolute size-[11px] bg-accent" style={{ left: 329, top: 182 }} />
      <p className="absolute text-[17px] leading-[23.8px] text-ink" style={{ left: 363, top: 151, width: 200 }}>
        Pay Anna, send the contract, schedule lunch Friday, ride to LAX at six.
      </p>
    </div>
  )
}

export default function AppGrid() {
  return (
    <Reveal>
      <section className="pt-6 md:pt-0">
        <div className="shell">
          <div className="grid md:grid-cols-2 md:border-y-[0.5px] md:border-rail">
            <div className="order-last min-h-[160px] overflow-hidden border-[0.5px] border-rail bg-cream md:order-none md:min-h-[400px] md:border-0 md:border-r-[0.5px]">
              <GridArt />
            </div>
            <div className="flex flex-col gap-6 bg-white pb-6 md:min-h-[400px] md:justify-between md:gap-10 md:py-10 md:pb-10 md:pl-6 lg:pl-10">
              <h2 className="type-h2-sm max-w-[290px] text-ink lg:max-w-[340px]">
                The last decade shipped one app per service.
              </h2>
              <div className="flex flex-col gap-6 md:gap-[39px]">
                <p className="type-body max-w-[460px]">
                  Every task ended up behind its own icon. Banking here, calendars there, files somewhere
                  else. We taught ourselves to hop between a dozen interfaces to finish a single errand.
                </p>
                <p className="type-caption">Est. 8.9M mobile apps · Apple App Store + Google Play, 2026</p>
              </div>
            </div>
          </div>

          <div className="mt-16 grid md:mt-0 md:grid-cols-2 md:border-b-[0.5px] md:border-rail">
            <div className="flex flex-col gap-6 bg-white pb-6 md:min-h-[400px] md:justify-between md:gap-10 md:border-r-[0.5px] md:border-rail md:py-10 md:pr-6 lg:pr-10">
              <h2 className="type-h2-sm max-w-[340px] text-ink lg:max-w-[430px]">
                The next decade collapses the app grid into one interface.
              </h2>
              <div className="flex flex-col gap-6 md:gap-[39px]">
                <p className="type-body max-w-[460px]">
                  A single instruction, several services, no launches. The assistant settles the whole thing
                  in one exchange — privately, and without leaving the device in your hand.
                </p>
                <p className="type-caption">Chase · Calendar · Files · Uber · resolved in one interaction</p>
              </div>
            </div>
            <div className="min-h-[160px] overflow-hidden border-[0.5px] border-rail bg-cream md:min-h-[400px] md:border-0">
              <ConvergeArt />
            </div>
          </div>
        </div>
      </section>
    </Reveal>
  )
}
