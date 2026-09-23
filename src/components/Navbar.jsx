import { useEffect, useState } from 'react'
import A from './A'
import { Chevron, Engine, Convert, Mac, Cli, Android, About, Mail, XLogo, InLogo, GitHub, Star, Menu, Close } from './Icons'

const PRODUCT = [
  { label: 'Inference engine', Icon: Engine, href: '/inference-runtime' },
  { label: 'Model conversion', Icon: Convert, href: '/conversion-optimization-toolkit' },
  { label: 'macOS app', Icon: Mac, href: '/chat-for-mac' },
  { label: 'CLI tool', Icon: Cli, href: 'https://github.com/trymirai/uzu#cli' },
  { label: 'Inference for Android • Soon', Icon: Android, muted: true, href: '#' },
]
const COMPANY = [
  { label: 'About us', Icon: About, href: '/about-us' },
  { label: 'Contact us', Icon: Mail, href: '/i-am-interested' },
]
const LINKS = [
  { label: 'Models', href: '/local-models' },
  { label: 'Metrics', href: '/metrics' },
  { label: 'Research', href: '/blog' },
  { label: 'Docs', href: 'https://docs.trymirai.com/' },
  { label: 'Careers', href: '/careers' },
]
const SOCIAL = {
  x: 'https://x.com/trymirai',
  li: 'https://www.linkedin.com/company/trymirai',
  gh: 'https://github.com/trymirai/uzu',
}

/* Hoisted to module scope: defining this inside Navbar would remount the
   open panel on every state change. */
function Dropdown({ label, items, open, onOpen, onClose, width }) {
  return (
    <div className="relative flex h-full items-center" onMouseEnter={onOpen} onMouseLeave={onClose}>
      <button className="nav-link flex items-center gap-2 px-3.5 py-2 text-foreground transition-colors hover:bg-beige">
        {label}
        <Chevron className={`text-chevron transition-transform duration-150 ease-[cubic-bezier(0.4,0,0.2,1)] ${open ? 'rotate-180' : ''}`} />
      </button>
      <div
        className={`absolute top-[calc(100%-7px)] left-1/2 min-w-[224px] -translate-x-1/2 border-[0.5px] border-hairline bg-white p-3 transition-opacity duration-150 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          open ? 'visible opacity-100' : 'pointer-events-none invisible opacity-0'
        }`}
        style={{ width }}
      >
        {items.map(({ label: l, Icon, muted, href }) => (
          <A
            key={l}
            href={href}
            className={`flex items-center gap-5 rounded py-2 pr-5 pl-2.5 text-[15px] leading-[25.5px] whitespace-nowrap ${
              muted ? 'pointer-events-none text-ink-muted' : 'text-ink-soft hover:bg-beige'
            }`}
          >
            <span className="flex size-4 items-center justify-center"><Icon /></span>
            {l}
          </A>
        ))}
      </div>
    </div>
  )
}

/* Measured on the original: the logo rail collapses 165px -> 80px once the page
   is scrolled past ~1200px, riding the inline width transition below. The clone
   previously collapsed it on breakpoint, so at a fixed viewport it never moved. */
const RAIL_COLLAPSE_AT = 1200

export default function Navbar() {
  const [open, setOpen] = useState(null)
  const [mobile, setMobile] = useState(false)
  const [acc, setAcc] = useState(null)
  const [railTight, setRailTight] = useState(false)

  useEffect(() => {
    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        ticking = false
        setRailTight(window.scrollY > RAIL_COLLAPSE_AT)
      })
    }
    onScroll()
    addEventListener('scroll', onScroll, { passive: true })
    return () => removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className="sticky top-0 z-50 flex justify-center border-b-[0.5px] border-rail bg-white">
      <div className="flex h-[72px] w-full max-w-shell items-center justify-between pr-3 min-[810px]:h-16 min-[810px]:pr-0 lg:border-x-[0.5px] lg:border-rail">
        {/* Logo rail — collapses to the mark between md and lg, as the original does */}
        <div className="flex h-full items-center">
          <A
            aria-label="Mirai Labs home"
            href="/"
            style={{ transition: 'width 0.38s cubic-bezier(0.45, 0, 0.55, 1)' }}
            className={`relative flex h-full shrink-0 items-center overflow-hidden border-hairline pl-5 md:justify-start md:border-r-[0.5px] md:pl-6 ${
              railTight ? 'w-20' : 'w-[150px] md:w-20 lg:w-[165px]'
            }`}
          >
            <span className="relative inline-flex items-center pb-1">
              <Wordmark
                className={`h-[22px] w-auto overflow-visible text-foreground transition-opacity duration-[380ms] ease-[cubic-bezier(0.45,0,0.55,1)] ${
                  railTight ? 'opacity-0' : 'opacity-100 md:opacity-0 lg:opacity-100'
                }`}
              />
            </span>
          </A>

          <nav className="hidden h-full items-center gap-[2px] pl-[14px] min-[810px]:flex">
            <Dropdown
              label="Product" items={PRODUCT} width={294}
              open={open === 'product'} onOpen={() => setOpen('product')} onClose={() => setOpen(null)}
            />
            {LINKS.map(({ label, href }) => (
              <A key={label} href={href} className="nav-link px-3.5 py-2 text-foreground transition-colors hover:bg-beige">
                {label}
              </A>
            ))}
            <Dropdown
              label="Company" items={COMPANY} width={224}
              open={open === 'company'} onOpen={() => setOpen('company')} onClose={() => setOpen(null)}
            />
          </nav>
        </div>

        {/* Social rail */}
        <div className="hidden items-center min-[810px]:flex">
          <a href={SOCIAL.x} target="_blank" rel="noreferrer" aria-label="Mirai Labs on X" className="flex w-11 items-center transition-opacity hover:opacity-70"><XLogo /></a>
          <a href={SOCIAL.li} target="_blank" rel="noreferrer" aria-label="Mirai Labs on LinkedIn" className="flex w-11 items-center transition-opacity hover:opacity-70"><InLogo /></a>
          <a href={SOCIAL.gh} target="_blank" rel="noreferrer" aria-label="uzu on GitHub, 1811 stars" className="flex w-11 items-center gap-[6px] transition-opacity hover:opacity-70">
            <GitHub />
            <span className="flex items-center gap-[2px] text-[12px] leading-none text-ink"><Star />1811</span>
          </a>
        </div>

        <button
          className="relative flex size-10 shrink-0 items-center justify-center text-ink min-[810px]:hidden"
          aria-label={mobile ? 'Close menu' : 'Open menu'}
          onClick={() => setMobile((v) => !v)}
        >
          <span
            className={`absolute transition-[opacity,transform] duration-200 ease-[cubic-bezier(0.34,1.12,0.64,1)] ${mobile ? 'rotate-90 opacity-0' : 'rotate-0 opacity-100'}`}
          >
            <Menu />
          </span>
          <span
            className={`absolute transition-[opacity,transform] duration-200 ease-[cubic-bezier(0.34,1.12,0.64,1)] ${mobile ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0'}`}
          >
            <Close />
          </span>
        </button>
      </div>

      {/* Mobile sheet */}
      {mobile && (
        <div
          className="fixed inset-x-0 bottom-0 z-40 overflow-y-auto border-b-[0.5px] border-rail bg-white px-5 pb-8 transition-[opacity,transform] duration-200 ease-[cubic-bezier(0.34,1.12,0.64,1)] min-[810px]:hidden"
          style={{ top: 72 }}
        >
          {[{ k: 'product', label: 'Product', items: PRODUCT }, null].map(() => null)}
          <div className="border-b-[0.5px] border-rail">
            <button
              className="flex w-full items-center gap-2 py-5 text-[15px] leading-[25.5px] font-[400] text-ink"
              onClick={() => setAcc(acc === 'product' ? null : 'product')}
            >
              Product <Chevron className={`text-chevron transition-transform ${acc === 'product' ? 'rotate-180' : ''}`} />
            </button>
            {acc === 'product' && (
              <div className="pb-4">
                {PRODUCT.map(({ label, Icon, muted, href }) => (
                  <A key={label} href={href} onClick={() => setMobile(false)} className={`flex items-center gap-4 py-2 text-[15px] leading-[25.5px] ${muted ? 'text-ink-muted' : 'text-ink-soft'}`}>
                    <Icon />{label}
                  </A>
                ))}
              </div>
            )}
          </div>
          {LINKS.map(({ label, href }) => (
            <A key={label} href={href} onClick={() => setMobile(false)} className="block border-b-[0.5px] border-rail py-5 text-[15px] leading-[25.5px] font-[400] text-ink">{label}</A>
          ))}
          <div className="border-b-[0.5px] border-rail">
            <button
              className="flex w-full items-center gap-2 py-5 text-[15px] leading-[25.5px] font-[400] text-ink"
              onClick={() => setAcc(acc === 'company' ? null : 'company')}
            >
              Company <Chevron className={`text-chevron transition-transform ${acc === 'company' ? 'rotate-180' : ''}`} />
            </button>
            {acc === 'company' && (
              <div className="pb-4">
                {COMPANY.map(({ label, Icon, href }) => (
                  <A key={label} href={href} onClick={() => setMobile(false)} className="flex items-center gap-4 py-2 text-[15px] leading-[25.5px] text-ink-soft"><Icon />{label}</A>
                ))}
              </div>
            )}
          </div>
          <div className="mt-6 flex gap-[1px]">
            <a href={SOCIAL.x} target="_blank" rel="noreferrer" aria-label="X" className="flex size-[52px] items-center justify-center bg-beige text-ink transition-colors hover:bg-beige-hover"><XLogo /></a>
            <a href={SOCIAL.li} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="flex size-[52px] items-center justify-center bg-beige text-ink transition-colors hover:bg-beige-hover"><InLogo /></a>
            <a href={SOCIAL.gh} target="_blank" rel="noreferrer" aria-label="uzu on GitHub, 1811 stars" className="flex h-[52px] flex-1 items-center justify-center gap-[6px] bg-beige text-ink transition-colors hover:bg-beige-hover">
              <GitHub /><span className="flex items-center gap-[2px] text-[12px]"><Star />1811</span>
            </a>
          </div>
          <A href="/i-am-interested" onClick={() => setMobile(false)} className="mt-6 flex h-[53px] items-center justify-center bg-beige text-[15px] font-[500] text-ink transition-colors hover:bg-beige-hover">Talk to us</A>
        </div>
      )}
    </header>
  )
}

/* The original draws the wordmark inline on a 480x90 viewBox. */
export function Wordmark({ className = 'h-[22px] w-auto overflow-visible text-foreground' }) {
  return (
    <svg viewBox="0 0 480 90" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} role="img" aria-label="Mirai Labs">
      <g fill="currentColor">
        <text x="0" y="70" fontFamily="Fraunces, serif" fontSize="76" fontWeight="400" letterSpacing="-1">Mirai Labs</text>
      </g>
    </svg>
  )
}
