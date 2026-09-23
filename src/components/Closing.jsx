import { useEffect, useRef } from 'react'
import { Reveal } from './useInView'

/* 240x240 canvas mark above the closing statement. */
function Orb() {
  const ref = useRef(null)
  useEffect(() => {
    const cv = ref.current
    if (!cv) return
    const ctx = cv.getContext('2d')
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const S = 240
    cv.width = S * dpr; cv.height = S * dpr
    ctx.scale(dpr, dpr)
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let t = 0, raf
    const draw = () => {
      ctx.clearRect(0, 0, S, S)
      const c = S / 2
      for (let i = 0; i < 26; i++) {
        const p = i / 26
        const r = 22 + p * 88
        const a = t / 90 + p * Math.PI * 1.6
        ctx.beginPath()
        ctx.ellipse(c, c, r, r * (0.42 + 0.5 * Math.abs(Math.cos(a))), a, 0, Math.PI * 2)
        ctx.strokeStyle = i % 7 === 0 ? 'rgba(255,106,32,0.55)' : `rgba(10,10,10,${0.05 + (1 - p) * 0.1})`
        ctx.lineWidth = 0.7
        ctx.stroke()
      }
      if (!reduce) { t += 1; raf = requestAnimationFrame(draw) }
    }
    draw()
    return () => cancelAnimationFrame(raf)
  }, [])
  return <canvas ref={ref} style={{ width: '100%', height: '100%' }} aria-hidden />
}

export default function Closing() {
  return (
    <Reveal>
      <section className="pt-6 pb-12 md:pt-10 md:pb-20 lg:pt-8">
        <div className="shell flex flex-col items-center text-center">
          <div className="mb-6 size-[132px] overflow-hidden md:size-[200px] lg:size-[240px]">
            <Orb />
          </div>
          <h2 className="type-h1 max-w-[270px] text-ink md:max-w-[520px] lg:max-w-[492px]">
            On-device AI deserves its own frontier lab
          </h2>
          <p className="type-body-lg mt-6 max-w-[283px] md:mt-8 md:max-w-[552px] lg:max-w-[492px]">
            The silicon has shipped. Two billion devices are waiting.
            The software is the open problem — and it is ours to solve.
          </p>
        </div>
      </section>
    </Reveal>
  )
}
