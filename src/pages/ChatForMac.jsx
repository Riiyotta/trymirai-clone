import { useMeta } from '../components/Page'
import { Reveal } from '../components/useInView'
import { Frame } from '../components/Shared'

const FAMILIES = ['Liquid AI', 'Muse-Glimmer', 'Qwen']

/* Both upstream names (mockup-window / mockup-mobile) resolve to the SAME
   image on the server — direct paths return identical WebP bytes, and the
   optimizer returns identical JPEG bytes. Layering them composited the
   screenshot on top of itself, so this renders the single asset full-bleed. */
function AppView() {
  return (
    <img
      src="/chat-for-mac/mockup-mobile-2.webp"
      alt="Mirai running locally on macOS"
      width="1920" height="1282"
      className="h-full w-full object-cover"
    />
  )
}

export default function ChatForMac() {
  useMeta(
    'Mirai for macOS: a native local-model chat app | Mirai Labs',
    'Run local models natively on macOS and Apple Silicon, with everything kept on device.',
  )
  return (
    <>
      {/* Full-bleed sunset backdrop. The photo runs bright sky at the top into
          near-black at the base, so the content sits on a scrim and switches to
          light type to stay legible across the whole gradient. */}
      <section className="relative isolate overflow-hidden px-5 pt-12 pb-16 text-center min-[810px]:px-0 min-[810px]:pt-[63px]">
        <img
          src="/chat-for-mac/hero-bg.png"
          alt="" aria-hidden
          className="absolute inset-0 -z-10 h-full w-full object-cover object-top"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/25 via-black/35 to-black/70" aria-hidden />

        <img src="/chat-for-mac/app-icon.png" alt="" aria-hidden width="80" height="80" className="mx-auto size-16 min-[810px]:size-20" />

        <h1 className="mx-auto mt-8 max-w-56 font-serif text-[40px] leading-[1.2] text-white min-[810px]:max-w-none min-[810px]:text-[48px]">
          Download Mirai for Mac
        </h1>

        <p className="mx-auto mt-6 max-w-[572px] text-[17px] leading-[27.2px] text-white/80">
          A faster, simpler way to run models locally. Built natively for macOS and Apple Silicon
          <span className="hidden min-[810px]:inline">, with complete privacy &amp; security</span>
        </p>

        {/* 400px mask over a track that runs the measured 17s marquee */}
        <div className="mx-auto mt-6 h-[33.5px] w-[400px] max-w-full overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_15%,#000_85%,transparent)]">
          <div className="flex w-max animate-[chat-for-mac-marquee_17s_linear_infinite]">
            {[0, 1].map((rep) => (
              <div key={rep} className="flex items-center gap-3 pr-3">
                {FAMILIES.map((f) => (
                  <span key={f} className="flex h-[33.5px] items-center gap-2 whitespace-nowrap rounded-[100px] border-[0.5px] border-white/30 px-4 text-[13px] text-white/85">
                    <span className="size-1.5 rounded-full bg-accent" />{f}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        <a
          href="#"
          className="mx-auto mt-[46.5px] flex h-14 w-[299px] max-w-full items-center justify-center gap-3 bg-white text-ink transition-opacity hover:opacity-85"
        >
          <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden>
            <path d="M16.3 12.7c0-2.2 1.8-3.3 1.9-3.4-1-1.5-2.6-1.7-3.2-1.7-1.4-.1-2.7.8-3.3.8s-1.7-.8-2.9-.8c-1.5 0-2.9.9-3.6 2.2-1.6 2.7-.4 6.7 1.1 8.9.7 1.1 1.6 2.3 2.8 2.2 1.1 0 1.5-.7 2.9-.7s1.7.7 2.9.7 2-1.1 2.7-2.1c.8-1.2 1.2-2.4 1.2-2.5-.1 0-2.4-.9-2.5-3.6M14.1 5.9c.6-.8 1-1.8.9-2.9-.9 0-2 .6-2.6 1.4-.6.7-1.1 1.7-.9 2.8 1 0 2-.5 2.6-1.3" />
          </svg>
          <span className="whitespace-nowrap">Download for Mac (M series)</span>
        </a>
      </section>

      <Reveal>
        <section className="mx-auto mt-16 hidden aspect-[1200/696] w-[1200px] max-w-[calc(100%-40px)] min-[810px]:block">
          <Frame tight><AppView /></Frame>
        </section>
      </Reveal>

      {/* Mobile: the original swaps to a shorter framed view */}
      <Reveal>
        <section className="mx-5 mt-10 aspect-[390/560] min-[810px]:hidden">
          <Frame tight><AppView /></Frame>
        </section>
      </Reveal>
    </>
  )
}
