import A from './A'

const SIDE_TOP = ['New Chat']
const SIDE_MAIN = ['Chats', 'Models', 'Benchmarks', 'Docs', 'Schedule team sync']

const TOOL_CALLS = [
  'calendar.create(date="tomorrow", time="15:00", title="Team sync")',
  'calendar.invite(event_id="…", recipients="team")',
  'slack.send(channel="#team", message="Meeting confirmed for tomorrow 3pm")',
]

function Dot({ tone }) {
  return <div className={`size-3 rounded-[100px] ${tone}`} />
}

/* The hero illustration: a desktop app mock, 958x720 on the lg breakpoint. */
function AppMock() {
  return (
    <div className="flex h-full w-full overflow-hidden rounded-[10px] bg-chrome text-left">
      {/* Sidebar */}
      <aside className="flex w-[200px] shrink-0 flex-col justify-between bg-chrome-2">
        <div>
          <div className="flex h-[52px] items-center gap-2 px-4">
            <Dot tone="bg-mac-red" /><Dot tone="bg-mac-yellow" /><Dot tone="bg-mac-green" />
          </div>
          <div className="px-3 pt-2">
            {SIDE_TOP.map((s) => (
              <div key={s} className="flex items-center gap-2 rounded px-2.5 py-2 text-[13px] font-[450] text-ink-2">
                <svg viewBox="0 0 12 12" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" aria-hidden>
                  <path d="M6 2v8M2 6h8" />
                </svg>
                {s}
              </div>
            ))}
            {SIDE_MAIN.map((s) => (
              <div key={s} className="flex items-center gap-2 rounded px-2.5 py-2 text-[13px] font-[450] text-ink-2/80">
                <span className="size-[11px] rounded-[2px] border border-ink-2/25" />
                {s}
              </div>
            ))}
          </div>
        </div>
        <div className="flex h-[56px] items-center gap-2 px-[22px]">
          <span className="text-[13px] font-[450] text-ink-2">Settings</span>
        </div>
      </aside>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex h-[52px] items-center justify-between rounded-tr-[10px] bg-chrome px-5">
          <span className="text-[13px] font-[450] text-ink-2">On-device AI</span>
          <span className="flex items-center gap-1.5 text-[13px] font-[450] text-surface-dark">
            <span className="size-1.5 rounded-full bg-mac-green" />
            Powered by Mirai • Offline
          </span>
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-hidden px-5 pt-5">
          {/* User turn */}
          <div className="flex justify-end">
            <p className="max-w-[70%] rounded-[10px] bg-white px-4 py-2.5 text-[15px] leading-6 text-ink-2">
              Book a meeting with my team for tomorrow at 3pm. Notify them on Slack.
            </p>
          </div>

          {/* Trace */}
          <div className="flex flex-col gap-1.5">
            <p className="text-[12px] leading-5 text-[#9B9B9F]">Thought for 1.4s — planning tool sequence</p>
            {TOOL_CALLS.map((t, i) => (
              <div key={t} className="rise flex items-start gap-2" style={{ animationDelay: `${0.35 + i * 0.28}s` }}>
                <span className="mt-[3px] text-[10px] text-[#9B9B9F]">▸</span>
                <code className="font-mono text-[12.5px] leading-5 break-all text-ink-2/85">{t}</code>
              </div>
            ))}
          </div>

          {/* Assistant turn */}
          <div className="rise" style={{ animationDelay: '1.3s' }}>
            <p className="text-[15px] leading-6 text-ink-2">Done. Invite sent, Slack posted. Ran entirely on this device.</p>
            <p className="mt-1.5 text-[12px] leading-5 text-[#9B9B9F]">
              Mirai local model · 3 tool calls · 1,238 T/S · TTFT 71ms
            </p>
          </div>
        </div>

        {/* Composer */}
        <div className="mx-5 mb-3 flex h-[96px] flex-col justify-between rounded-[8px] bg-white p-4">
          <input
            className="w-full bg-transparent text-[15px] text-ink-2 outline-none placeholder:text-[#9B9B9F]"
            placeholder="Ask anything — it never leaves this device"
            readOnly
          />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[12px] text-[#9B9B9F]">
              <span className="rounded border border-black/10 px-1.5 py-0.5">Qwen3.5-0.8B</span>
              <span>4-bit</span>
            </div>
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" aria-hidden>
              <circle cx="12" cy="12" r="11" fill="#0A0A0A" />
              <path d="M12 16.5v-9M8.4 11 12 7.4l3.6 3.6" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* Status bar */}
        <div className="flex h-6 items-center justify-between bg-chrome-2 px-5">
          <div className="flex items-center gap-2">
            <svg viewBox="0 0 8 9" width="7" height="8" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden><path d="M4 8V1M1.5 3.5 4 1l2.5 2.5" /></svg>
            <span className="text-[11px] font-[450] text-ink-2">Eject model</span>
            <span className="text-[11px] font-[450] text-[#9B9B9F]">Qwen3.5-0.8B</span>
          </div>
          <span className="text-[11px] font-[450] text-[#9B9B9F]">Mirai 0.1.18</span>
        </div>
      </div>
    </div>
  )
}


/* Measured on the original: dotted 2px underline, 8px offset, #8F8F8F rule,
   colour and decoration-colour both easing to accent over 0.2s. */
function HeroLink({ href, children }) {
  return (
    <A
      href={href}
      className="underline decoration-dotted decoration-muted decoration-2 [text-underline-offset:8px] [transition:color_0.2s_cubic-bezier(0.44,0,0.56,1),text-decoration-color_0.2s_cubic-bezier(0.44,0,0.56,1)] hover:text-accent hover:decoration-accent"
    >
      {children}
    </A>
  )
}

export default function Hero() {
  return (
    <section className="pt-5 md:pt-10 lg:pt-16">
      <div className="shell">
        <div className="flex flex-col gap-12 md:gap-16 lg:block">
          <h1 className="type-h1 max-w-[350px] text-foreground md:max-w-none">
            <HeroLink href="/local-models">Models</HeroLink>,{' '}
            <HeroLink href="/inference-runtime">runtime</HeroLink> &amp;{' '}
            <HeroLink href="https://github.com/trymirai">infrastructure</HeroLink> to make
            <br className="hidden lg:block" /> on-device AI interactive, ambient &amp; continuous.
          </h1>
          <p className="type-body-lg max-w-[350px] md:max-w-none lg:mt-16">
            The coming wave of AI products will be shaped by continuous interaction rather than
            <br className="hidden lg:block" /> one-off prompts and chat turns. That shift only works once latency stops being felt.
          </p>
        </div>

        <div className="relative mt-6 flex h-[340px] justify-center overflow-hidden bg-ink transition-opacity duration-[400ms] ease-[cubic-bezier(0.34,1.12,0.64,1)] md:mt-10 md:h-[406px] lg:mt-16 lg:h-auto lg:min-h-[720px] lg:px-8 lg:py-12">
          <div className="absolute top-5 right-5 h-[560px] w-[760px] md:top-6 md:right-6 lg:static lg:inset-auto lg:h-[720px] lg:w-[958px]">
            <AppMock />
          </div>
        </div>
      </div>
    </section>
  )
}
