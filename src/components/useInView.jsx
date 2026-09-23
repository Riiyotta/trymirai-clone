import { useEffect, useRef, useState } from 'react'

/**
 * Reveal-on-scroll.
 *
 * An IntersectionObserver alone drops sections that a fast scroll, a jump to an
 * anchor, or a restored scroll position steps straight over — they never register
 * as intersecting and stay at opacity 0 permanently. So the observer is paired
 * with a rAF-throttled scroll/resize check that reveals anything already at or
 * above the fold.
 */
export function useInView({ threshold = 0.12, once = true, rootMargin = '0px 0px -8% 0px' } = {}) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let done = false
    let ticking = false

    const show = () => {
      if (done) return
      done = true
      setInView(true)
    }

    const check = () => {
      ticking = false
      const r = el.getBoundingClientRect()
      if (r.top < innerHeight * 0.92 && r.bottom > 0) show()
      else if (r.bottom <= 0) show() // already scrolled past
    }
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(check)
    }

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) show()
        else if (!once) setInView(false)
      },
      { threshold, rootMargin },
    )
    io.observe(el)
    check()
    addEventListener('scroll', onScroll, { passive: true })
    addEventListener('resize', onScroll)
    return () => {
      io.disconnect()
      removeEventListener('scroll', onScroll)
      removeEventListener('resize', onScroll)
    }
  }, [threshold, once, rootMargin])

  return [ref, inView]
}

/** Section wrapper reproducing the original's `.reveal` entrance. */
export function Reveal({ children, className = '', as: Tag = 'div', ...rest }) {
  const [ref, inView] = useInView()
  return (
    <Tag ref={ref} className={`reveal ${inView ? 'is-in' : ''} ${className}`} {...rest}>
      {children}
    </Tag>
  )
}
