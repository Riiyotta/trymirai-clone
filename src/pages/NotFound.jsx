import { useMeta } from '../components/Page'
import A from '../components/A'

export default function NotFound() {
  useMeta('Page not found | Mirai Labs', 'The page you were looking for does not exist.')
  return (
    <section className="shell flex flex-col items-center py-32 text-center">
      <h1 className="type-h1 text-foreground">Page not found</h1>
      <p className="type-body-lg mt-6 max-w-[460px]">That page does not exist in this clone.</p>
      <A href="/" className="mt-8 bg-ink px-6 py-3 text-[15px] font-medium text-white transition-opacity hover:opacity-85">
        Back home
      </A>
    </section>
  )
}
