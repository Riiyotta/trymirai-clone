import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

export default function Layout() {
  return (
    <div className="flex flex-1 flex-col outline-none">
      <ScrollToTop />
      <a href="#main" className="sr-only focus:not-sr-only">Skip to main content</a>
      <Navbar />
      <main id="main"><Outlet /></main>
      <Footer />
    </div>
  )
}
