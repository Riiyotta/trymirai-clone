import { Wordmark } from './Navbar'
import A from './A'

const COLS = [
  { head: 'Main', links: [
    ['Platform / SDK', 'https://platform.trymirai.com/'],
    ['Inference engine', '/inference-runtime'],
    ['Model conversion', '/conversion-optimization-toolkit'],
    ['Models', '/local-models'],
    ['Metrics', '/metrics'],
    ['macOS app', '/chat-for-mac'],
    ['Research', '/blog'],
    ['Docs', 'https://docs.trymirai.com/'],
  ] },
  { head: 'Company', links: [
    ['About us', '/about-us'],
    ['Careers', '/careers'],
    ['Contact us', '/i-am-interested'],
    ['Privacy Policy', '/privacy-policy'],
    ['Terms of Use', '/terms-of-use'],
  ] },
  { head: 'Links', links: [
    ['X (Twitter)', 'https://x.com/trymirai'],
    ['GitHub', 'https://github.com/trymirai'],
    ['Hugging Face', 'https://huggingface.co/trymirai'],
    ['LinkedIn', 'https://www.linkedin.com/company/trymirai'],
    ['Discord', 'https://discord.com/invite/trymirai'],
  ] },
]

export default function Footer() {
  return (
    <footer>
      {/* Header row — logo rail + column headings */}
      <div className="mx-auto hidden h-[66px] w-full max-w-shell border-t-[0.5px] border-rail md:flex">
        <div className="w-[165px] shrink-0 px-6 py-[10px]">
          <A href="/" aria-label="Mirai Labs home" className="flex h-[38px] w-[117px] items-center">
            <Wordmark className="h-[22px] w-auto text-foreground" />
          </A>
        </div>
        <div className="grid flex-1 grid-cols-[1fr_200px_200px_200px]">
          <div />
          {COLS.map(({ head }) => (
            <div key={head} className="border-l-[0.5px] border-rail px-[23px] py-[20px]">
              <p className="text-[15px] leading-[1.7] font-normal text-ink-soft">{head}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Link grid */}
      <div className="mx-auto hidden w-full max-w-shell md:flex md:h-[318px] md:flex-row">
        <div className="md:w-[124px] md:shrink-0 md:px-6 md:py-3" />
        <div className="grid flex-1 grid-cols-[1fr_200px_200px_200px]">
          <div />
          {COLS.map(({ head, links }) => (
            <div key={head} className="border-l-[0.5px] border-rail px-[23px] py-[17px]">
              <ul className="flex flex-col gap-[16.5px]">
                {links.map(([l, href]) => (
                  <li key={l} className="leading-none">
                    <A href={href} className="flex items-center gap-1.5 text-[15px] leading-[26px] text-ink-muted transition-colors hover:text-foreground">
                      {l === 'Hugging Face' && (
                        <img src="/hf-logo.svg" alt="" aria-hidden width="19" height="17" className="h-[17px] w-[19px] shrink-0" />
                      )}
                      {l}
                    </A>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile footer */}
      <div className="border-t-[0.5px] border-rail px-5 py-10 md:hidden">
        <Wordmark className="h-[22px] w-auto text-foreground" />
        <div className="mt-8 flex flex-col gap-8">
          {COLS.map(({ head, links }) => (
            <div key={head}>
              <p className="text-[15px] leading-[1.7] text-ink-soft">{head}</p>
              <ul className="mt-3 flex flex-col gap-3">
                {links.map(([l, href]) => (
                  <li key={l}><A href={href} className="text-[15px] text-ink-muted transition-colors hover:text-foreground">{l}</A></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </footer>
  )
}
