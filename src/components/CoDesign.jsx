import { useEffect, useRef } from 'react'
import { Reveal } from './useInView'

const BULLETS = [
  'Minimizing memory footprint.',
  'Maximizing arithmetic intensity.',
  'Maximizing neural accelerator utilization.',
]

/**
 * 480x480 canvas: an orbital sphere — a set of ellipses at varying tilts and
 * eccentricities reading as a globe, ~270px across and centred, with solid
 * accent nodes riding the orbits. Strokes are hairline and mostly warm grey,
 * so the orange nodes carry the contrast.
 */
function OrbitSphere() {
  const ref = useRef(null)
  useEffect(() => {
    const cv = ref.current
    if (!cv) return
    const ctx = cv.getContext('2d')
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const S = 480
    cv.width = S * dpr; cv.height = S * dpr
    ctx.scale(dpr, dpr)
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const R = 135                       // sphere radius, ~270px across
    const C = S / 2
    // tilt, eccentricity, stroke — a mix of warm grey and faint accent
    const ORBITS = [
      { rot: -0.22, k: 1.00, c: 'rgba(255,106,32,0.45)' },
      { rot: 0.38, k: 0.94, c: 'rgba(255,106,32,0.32)' },
      { rot: 1.15, k: 0.72, c: 'rgba(160,150,142,0.30)' },
      { rot: -0.95, k: 0.62, c: 'rgba(255,106,32,0.22)' },
      { rot: 0.05, k: 0.40, c: 'rgba(160,150,142,0.26)' },
      { rot: 1.48, k: 0.34, c: 'rgba(255,106,32,0.20)' },
      { rot: -0.55, k: 0.22, c: 'rgba(160,150,142,0.22)' },
    ]
    // nodes: which orbit, phase along it, radius
    const NODES = [
      [0, 0.12, 3.6], [0, 0.62, 2.4], [0, 0.85, 3.0],
      [1, 0.28, 4.2], [1, 0.70, 2.8], [1, 0.05, 2.2],
      [2, 0.44, 3.4], [2, 0.92, 2.6],
      [3, 0.18, 4.0], [3, 0.58, 2.4], [3, 0.78, 3.2],
      [4, 0.36, 2.8], [4, 0.88, 3.6],
      [5, 0.22, 2.4], [5, 0.66, 3.0],
      [6, 0.48, 2.6], [6, 0.10, 3.4],
    ]

    let t = 0, raf
    const draw = () => {
      ctx.clearRect(0, 0, S, S)

      ORBITS.forEach(({ rot, k, c }) => {
        ctx.beginPath()
        ctx.ellipse(C, C, R, R * k, rot + t / 2600, 0, Math.PI * 2)
        ctx.strokeStyle = c
        ctx.lineWidth = 0.7
        ctx.stroke()
      })

      NODES.forEach(([oi, phase, r]) => {
        const { rot, k } = ORBITS[oi]
        const a = phase * Math.PI * 2 + t / 900
        const spin = rot + t / 2600
        // point on the tilted ellipse
        const ex = Math.cos(a) * R
        const ey = Math.sin(a) * R * k
        const x = C + ex * Math.cos(spin) - ey * Math.sin(spin)
        const y = C + ex * Math.sin(spin) + ey * Math.cos(spin)
        ctx.beginPath()
        ctx.arc(x, y, r, 0, Math.PI * 2)
        ctx.fillStyle = '#FF6A20'
        ctx.fill()
      })

      if (!reduce) { t += 1; raf = requestAnimationFrame(draw) }
    }
    draw()
    return () => cancelAnimationFrame(raf)
  }, [])
  return <canvas ref={ref} style={{ width: 480, height: 480 }} aria-hidden />
}

export default function CoDesign() {
  return (
    <Reveal>
      <section>
        <div className="shell">
          <div className="flex flex-col border-rail md:grid md:grid-cols-2 md:border-[0.5px] md:border-r-0">
            <div className="order-2 flex min-h-[240px] items-center justify-center overflow-hidden border-[0.5px] border-rail bg-beige md:order-none md:border-0 md:border-r-[0.5px]">
              <OrbitSphere />
            </div>
            <div className="order-1 flex flex-col gap-6 bg-white pt-6 pb-6 md:order-none md:justify-between md:gap-10 md:p-10">
              <div className="flex flex-col gap-6">
                <h2 className="type-h2 max-w-[520px] text-ink">
                  Performance emerges from co&#8209;design across the stack.
                </h2>
                <p className="type-body max-w-[520px]">
                  On a phone or a laptop every request is handled on its own — nothing to batch it with and
                  nowhere to parallelise. Mirai designs the model and the runtime together around that one
                  constraint, on Apple Silicon.
                </p>
              </div>
              <ul className="space-y-2">
                {BULLETS.map((b) => (
                  <li key={b} className="type-body flex gap-3">
                    <span className="mt-[9px] size-1 shrink-0 rounded-full bg-accent" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </Reveal>
  )
}
