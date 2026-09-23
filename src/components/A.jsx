import { Link } from 'react-router-dom'

/** Internal paths route client-side; mailto:, tel: and external URLs stay plain anchors. */
export default function A({ href = '#', children, ...rest }) {
  const internal = href.startsWith('/') && !href.startsWith('//')
  if (internal) return <Link to={href} {...rest}>{children}</Link>
  const ext = /^https?:/.test(href)
  return (
    <a href={href} {...(ext ? { target: '_blank', rel: 'noreferrer' } : {})} {...rest}>
      {children}
    </a>
  )
}
