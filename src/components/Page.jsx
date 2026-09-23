import { useEffect } from 'react'

/** Sets document title + meta description per route, as the original does. */
export function useMeta(title, description) {
  useEffect(() => {
    document.title = title
    let m = document.querySelector('meta[name=description]')
    if (!m) { m = document.createElement('meta'); m.name = 'description'; document.head.appendChild(m) }
    m.content = description || ''
  }, [title, description])
}


