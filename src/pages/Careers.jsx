import { useEffect, useRef } from 'react'
import { useMeta } from '../components/Page'
import A from '../components/A'

const ROLES = [
  { title: 'Machine Learning Engineer', meta: 'Remote / SF / Europe • Full Time • Models Optimization' },
  { title: 'Machine Learning Engineer', meta: 'Remote / SF / Europe • Full Time • Models & Research' },
  { title: 'Inference engineer', meta: 'Remote / SF / Europe • Full Time' },
]

/* 200x200 mark above the closing block. */
function Mark() {
  const ref = useRef(null)
  useEffect(() => {
    const cv = ref.current
    if (!cv) return
    const ctx = cv.getContext('2d')
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const S = 200
    cv.width = S * dpr; cv.height = S * dpr
    ctx.scale(dpr, dpr)
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let t = 0, raf
    const draw = () => {
      ctx.clearRect(0, 0, S, S)
      const c = S / 2
      for (let i = 0; i < 18; i++) {
        const p = i / 18
        ctx.beginPath()
        ctx.ellipse(c, c, 20 + p * 70, (20 + p * 70) * (0.4 + 0.5 * Math.abs(Math.cos(t / 120 + p * 3))), t / 300 + p * 2, 0, Math.PI * 2)
        ctx.strokeStyle = i % 6 === 0 ? 'rgba(255,106,32,0.5)' : `rgba(10,10,10,${0.06 + (1 - p) * 0.08})`
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

export default function Careers() {
  useMeta('Careers | Mirai Labs', 'Open roles at Mirai Labs — models, inference and optimization for on-device AI.')
  return (
    <div className="shell pt-8 pb-8 md:pt-12 md:pb-16 lg:pt-16 lg:pb-20">
      {/* The page is an 800px centred column, not the site's usual full shell. */}
      <div className="mx-auto max-w-[800px]">
        <div className="flex flex-col items-start text-left md:items-center md:text-center">
          <p className="text-[17px] leading-[22.1px] text-muted">Careers</p>
          <h1 className="type-h1-page mt-6 max-w-[300px] text-ink md:max-w-[585px] lg:max-w-[760px]">
            Join a small, senior team building the full on-device stack to achieve realtime local
            intelligence
          </h1>
        </div>

        <h2 className="type-job-section mt-10 border-t-[0.5px] lg:mt-20 border-hairline pt-8 text-[#121212]">
          Open Positions
        </h2>

        <div className="mt-8 flex flex-col gap-3 lg:mt-10">
          {ROLES.map(({ title, meta }, i) => (
            <A
              key={i} href="/i-am-interested"
              className="flex h-[89px] flex-col justify-center gap-1.5 border-[0.5px] border-hairline bg-beige py-4 pr-6 pl-4 transition-colors hover:bg-beige-hover"
            >
              <span className="text-[17px] leading-[24px] text-ink">{title}</span>
              <span className="type-caption">{meta}</span>
            </A>
          ))}
        </div>

        <div className="mt-8 grid gap-8 border-y-[0.5px] border-hairline py-8 lg:grid-cols-2 lg:gap-8">
          <div>
            <h2 className="type-job-section text-ink">About us</h2>
            <div className="mt-6 flex flex-col gap-6 text-[16px] leading-[25.6px] text-ink-soft lg:mt-10">
              <p>
                We are a frontier on-device AI lab. We build the models, the inference runtime and the
                quantization stack ourselves, from the device constraint up.
              </p>
              <p>
                The aim is straightforward: AI running at full capability on the hardware billions of people
                already own, without a round trip to somebody else&rsquo;s datacentre.
              </p>
            </div>
          </div>
          <div className="border-t-[0.5px] border-hairline pt-8 lg:border-t-0 lg:pt-0">
            <h2 className="type-job-section text-ink">Why us?</h2>
            <div className="mt-6 flex flex-col gap-6 text-[16px] leading-[25.6px] text-ink-soft lg:mt-10">
              <p>
                A small team where each person covers a lot of ground. The problems run from kernel-level
                scheduling through quantization to model architecture, and nobody is boxed into one layer.
              </p>
              <p>
                That breadth is deliberate — the gains we care about show up between the layers, and they are
                hard to find if the people working on them never cross over.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-start text-left md:mt-10 md:items-center md:text-center lg:mt-16">
          <div className="size-[132px] overflow-hidden md:size-[200px]">
            <Mark />
          </div>
          <h3 className="type-careers-close mt-6 max-w-[326px] text-ink md:max-w-[511px]">
            We&rsquo;re always interested in meeting exceptional people.
          </h3>
          <p className="mt-6 max-w-[547px] text-[17px] leading-[22.1px] tracking-[-0.2px] text-ink-soft">
            If you&rsquo;re an engineer or researcher working on this, get in touch.
          </p>
          <A
            href="/i-am-interested"
            className="mt-8 flex h-[53px] w-[240px] max-w-full items-center justify-between bg-ink py-6 pr-6 pl-5 text-[15px] font-medium text-white transition-opacity hover:opacity-85 md:mt-12"
          >
            Get in touch
            <svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </A>
        </div>
      </div>
    </div>
  )
}
