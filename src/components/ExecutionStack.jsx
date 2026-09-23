import { useEffect, useState } from 'react'
import { Reveal, useInView } from './useInView'
import Caret from './Caret'

/* Script content is written for this clone; the panel geometry and type are
   measured from the original. */
const SCRIPT = [
  { kind: 'cmd', t: 'mirai run --offline "hold a seat on the 6pm to LAX"' },
  { kind: 'head', t: 'Routing request on-device ...' },
  { kind: 'kv', k: 'model', v: 'Mirai local model on Apple Silicon' },
  { kind: 'kv', k: 'network', v: 'disabled (airplane mode)' },
  { kind: 'head', t: 'Checking providers ...' },
  { kind: 'kv', k: 'Skyline', v: '$74/day · seat 14C · available' },
  { kind: 'kv', k: 'Meridian', v: '$61/day · aisle · available' },
  { kind: 'kv', k: 'Vantage', v: '$88/day · window · waitlist' },
  { kind: 'ok', t: 'Held · Meridian · 6:00pm · $61/day' },
  { kind: 'kv', k: 'tokens/sec', v: '1,238' },
  { kind: 'kv', k: 'first token', v: '71ms' },
  { kind: 'kv', k: 'network calls', v: '0' },
]

function Terminal() {
  const [ref, inView] = useInView({ threshold: 0.28 })
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!inView) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return setN(SCRIPT.length)
    const id = setInterval(() => setN((v) => (v >= SCRIPT.length ? (clearInterval(id), v) : v + 1)), 380)
    return () => clearInterval(id)
  }, [inView])

  return (
    <div ref={ref} className="flex h-full w-full flex-col bg-terminal-fill">
      {/* 40px chrome: traffic lights left, mono 12px caption */}
      <div className="flex h-10 shrink-0 items-center px-4">
        <div className="flex w-[54px] shrink-0 gap-1.5">
          <span className="size-3 rounded-full bg-mac-red" />
          <span className="size-3 rounded-full bg-mac-yellow" />
          <span className="size-3 rounded-full bg-mac-green" />
        </div>
        <span className="flex-1 text-center font-mono text-[12px] leading-3 text-ink">
          mirai — airplane mode · M4 Pro
        </span>
        <span className="w-[54px] shrink-0" />
      </div>

      <div className="flex-1 overflow-hidden px-4 pb-4 font-mono text-[15px] leading-[31.2px]">
        {SCRIPT.slice(0, n).map((l, i) => {
          if (l.kind === 'cmd') return (
            <p key={i} className="rise text-ink"><span className="text-accent">$ </span>{l.t}</p>
          )
          if (l.kind === 'head') return (
            <p key={i} className="rise text-ink"><span className="text-accent">▸ </span>{l.t}</p>
          )
          if (l.kind === 'ok') return (
            <p key={i} className="rise text-accent">✓ {l.t}</p>
          )
          return (
            <p key={i} className="rise flex gap-4 text-ink-soft">
              <span className="w-[112px] shrink-0">{l.k}</span>
              <span className="text-ink">{l.v}</span>
            </p>
          )
        })}
        {n < SCRIPT.length && <Caret className="inline-block h-[15px] w-[8px] translate-y-[2px] bg-ink/70" />}
      </div>
    </div>
  )
}

const BULLETS = [
  'From the device constraint up.',
  'A runtime that executes batch size = 1.',
  'A quantization scheme co‑designed with architecture.',
]

export default function ExecutionStack() {
  return (
    <Reveal>
      <section className="pt-6 md:pt-0">
        <div className="shell">
          <div className="grid gap-6 md:grid-cols-2 md:gap-0 md:border-y-[0.5px] md:border-rail">
            <div className="order-last min-h-[500px] border-[0.5px] border-rail md:order-none md:min-h-[550px] md:border-y-0 md:border-l-0">
              <Terminal />
            </div>
            <div className="flex flex-col justify-between gap-10 bg-white md:min-h-[550px] md:gap-0 md:border-l-[0.5px] md:border-rail md:p-10">
              <div className="flex flex-col gap-6">
                <h2 className="type-h2 max-w-[440px] text-ink">
                  1,000 t/s requires a<br className="hidden md:block" /> different execution stack.
                </h2>
                <p className="type-body max-w-[520px]">
                  Interactive AI is never a single response. It is a loop that keeps running — parse, validate,
                  rank, render — and every leg of it carries its own latency budget. Overspend on one and the
                  whole experience falls over.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <p className="type-body">To solve that, we are building every layer from scratch:</p>
                <ul className="flex flex-col gap-2">
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
        </div>
      </section>
    </Reveal>
  )
}
