import { useEffect, useState } from 'react'

/**
 * Terminal caret.
 *
 * Measured on the original (/inference-runtime hero terminal): the caret is NOT
 * a CSS keyframe animation — the original's inner pages carry no CSS animations
 * at all. It is a JS-toggled opacity with a short transition:
 *
 *   element   : inline-block span, 8.4 x 15.4px, background var(--accent)
 *   transition: opacity 0.08s ease
 *   opacity   : 0.9 (on) <-> 0 (off)
 *   period    : ~1.06s total, i.e. a toggle every ~530ms
 *
 * Under prefers-reduced-motion the caret is simply held on, so the terminal
 * still reads as a live prompt without any motion.
 */
export default function Caret({ className = '' }) {
  const [on, setOn] = useState(true)

  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = setInterval(() => setOn(v => !v), 530)
    return () => clearInterval(id)
  }, [])

  return (
    <span
      aria-hidden
      className={className}
      style={{ opacity: on ? 0.9 : 0, transition: 'opacity 0.08s ease' }}
    />
  )
}
