/* Inline SVG icon set — the original ships every icon inline, none as files. */
const base = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.4, strokeLinecap: 'round', strokeLinejoin: 'round' }

export const Chevron = ({ className = '' }) => (
  <svg viewBox="0 0 10 6" width="10" height="6" className={className} fill="none" aria-hidden>
    <path d="M1 1.5 5 5l4-3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const Engine = () => (
  <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden {...base}>
    <rect x="2.2" y="2.2" width="11.6" height="11.6" rx="1.6" />
    <rect x="5.4" y="5.4" width="5.2" height="5.2" rx="0.8" />
    <path d="M6.6 2.2V.9M9.4 2.2V.9M6.6 15.1v-1.3M9.4 15.1v-1.3M2.2 6.6H.9M2.2 9.4H.9M15.1 6.6h-1.3M15.1 9.4h-1.3" />
  </svg>
)
export const Convert = () => (
  <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden {...base}>
    <path d="M2 5.5h9.5M9.2 3.2l2.3 2.3-2.3 2.3M14 10.5H4.5M6.8 8.2 4.5 10.5l2.3 2.3" />
  </svg>
)
export const Mac = () => (
  <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden {...base}>
    <rect x="1.6" y="3" width="12.8" height="8.4" rx="1.2" />
    <path d="M.8 13.6h14.4" />
  </svg>
)
export const Cli = () => (
  <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden {...base}>
    <rect x="1.6" y="2.4" width="12.8" height="11.2" rx="1.4" />
    <path d="m4.6 6.4 2.1 2.1-2.1 2.1M8.6 10.8h3" />
  </svg>
)
export const Android = () => (
  <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden {...base}>
    <path d="M3.2 9.6a4.8 4.8 0 0 1 9.6 0z" />
    <path d="M4.4 5 3.4 3.5M11.6 5l1-1.5M6.2 7.4h.01M9.8 7.4h.01" />
  </svg>
)
export const About = () => (
  <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden {...base}>
    <circle cx="8" cy="8" r="6.2" /><path d="M8 7.2v4M8 4.9h.01" />
  </svg>
)
export const Mail = () => (
  <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden {...base}>
    <rect x="1.8" y="3.4" width="12.4" height="9.2" rx="1.3" /><path d="m2.4 4.6 5.6 4 5.6-4" />
  </svg>
)
export const XLogo = () => (
  <svg viewBox="0 0 20 20" width="17" height="17" aria-hidden fill="currentColor">
    <path d="M15.3 1.9h2.8l-6.1 7 7.2 9.5h-5.6l-4.4-5.8-5.1 5.8H1.3l6.5-7.5L.9 1.9h5.8l4 5.3zm-1 14.8h1.6L5.8 3.5H4.1z" />
  </svg>
)
export const InLogo = () => (
  <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden fill="currentColor">
    <path d="M4.1 6.6H1.2V18h2.9zM2.7 1.9a1.7 1.7 0 1 0 0 3.4 1.7 1.7 0 0 0 0-3.4M18.8 11.7c0-3.3-1.8-4.9-4.2-4.9-1.9 0-2.8 1-3.3 1.8V6.6H8.4V18h2.9v-6.2c0-1.5.8-2.4 2.1-2.4s2.5.8 2.5 2.4V18h2.9z" />
  </svg>
)
export const GitHub = () => (
  <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden fill="currentColor">
    <path d="M8 .3a8 8 0 0 0-2.5 15.6c.4.1.5-.2.5-.4v-1.4C3.8 14.5 3.4 13 3.4 13c-.3-.8-.8-1-.8-1-.6-.4 0-.4 0-.4.7 0 1.1.7 1.1.7.6 1.1 1.7.8 2.1.6 0-.5.3-.8.5-1-1.8-.2-3.6-.9-3.6-3.9 0-.9.3-1.6.8-2.1 0-.2-.3-1 .1-2.1 0 0 .7-.2 2.2.8a7.5 7.5 0 0 1 4 0c1.5-1 2.2-.8 2.2-.8.4 1.1.2 1.9.1 2.1.5.5.8 1.2.8 2.1 0 3-1.8 3.7-3.6 3.9.3.2.5.7.5 1.4v2.1c0 .2.2.5.6.4A8 8 0 0 0 8 .3" />
  </svg>
)
export const Star = () => (
  <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden fill="currentColor">
    <path d="m8 1.6 1.9 4 4.4.6-3.2 3 .8 4.3L8 11.5 4.1 13.5l.8-4.3-3.2-3 4.4-.6z" />
  </svg>
)
export const Menu = () => (
  <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden {...base}>
    <path d="M3 6h14M3 10h14M3 14h14" />
  </svg>
)
export const Close = () => (
  <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden {...base}>
    <path d="m5 5 10 10M15 5 5 15" />
  </svg>
)
