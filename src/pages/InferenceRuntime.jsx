import { useState } from 'react'
import { useMeta } from '../components/Page'
import { Reveal } from '../components/useInView'
import {
  PerfectFor, Faq, BenchStrip, ModelCards, ClosingBand,
  SectionHead, HeroRule, Cta, Frame, SunsetPlate, TerminalCard,
} from '../components/Shared'
import A from '../components/A'

const FRAMEWORKS = {
  Swift: [
    'import Uzu', '',
    '@main', 'struct Demo {',
    '    static func main() async throws {',
    '        let config = EngineConfig(',
    '            model: .local("Qwen3.5-0.8B"),',
    '            quantization: .int4,',
    '            speculativeDecoding: true',
    '        )', '',
    '        let engine = try await Engine.create(config)',
    '        let session = try engine.session(for: .chat)', '',
    '        let reply = try await session.run(prompt: "Hi")',
    '        print(reply.text)',
    '        print(reply.stats.decodeTokensPerSecond)',
    '    }',
    '}',
  ],
  'Node.js': [
    "import { Engine, Quantization } from '@trymirai/uzu'", '',
    'const engine = await Engine.create({',
    "  model: 'Qwen3.5-0.8B',",
    '  quantization: Quantization.Int4,',
    '  speculativeDecoding: true,',
    '})', '',
    "const session = await engine.session({ task: 'chat' })", '',
    "const reply = await session.run({ prompt: 'Hi' })", '',
    'console.log(reply.text)',
    'console.log(reply.stats.decodeTokensPerSecond)', '',
    'await engine.close()',
  ],
  Python: [
    'from uzu import Engine, Quantization', '',
    'engine = Engine.create(',
    '    model="Qwen3.5-0.8B",',
    '    quantization=Quantization.INT4,',
    '    speculative_decoding=True,',
    ')', '',
    'session = engine.session(task="chat")', '',
    'reply = session.run(prompt="Hi")', '',
    'print(reply.text)',
    'print(reply.stats.decode_tokens_per_second)', '',
    'engine.close()',
  ],
  Rust: [
    'use uzu::{Engine, EngineConfig, Quantization};', '',
    'fn main() -> anyhow::Result<()> {',
    '    let config = EngineConfig::builder()',
    '        .model("Qwen3.5-0.8B")',
    '        .quantization(Quantization::Int4)',
    '        .speculative_decoding(true)',
    '        .build()?;', '',
    '    let engine = Engine::create(config)?;',
    '    let mut session = engine.session("chat")?;', '',
    '    let reply = session.run("Hi")?;',
    '    println!("{}", reply.text);',
    '    println!("{}", reply.stats.decode_tps);', '',
    '    Ok(())',
    '}',
  ],
}
const INSTALL_CMD = {
  Swift: 'spm https://github.com/trymirai/uzu.git',
  'Node.js': 'pnpm add @trymirai/uzu',
  Python: 'uv add uzu',
  Rust: 'cargo add uzu',
}

const LANG_ICON = {
  Rust: '/inference-runtime/langs/rust.svg',
  Swift: '/inference-runtime/langs/swift.svg',
  TypeScript: '/inference-runtime/langs/typescript.svg',
  'Node.js': '/inference-runtime/langs/typescript.svg',
  Python: '/inference-runtime/langs/python.svg',
  Kotlin: '/inference-runtime/langs/kotlin.svg',
}

const INSTALL = [
  ['Rust', 'Cargo', 'cargo add uzu'],
  ['Swift', 'Swift Package Manager', 'https://github.com/trymirai/uzu.git'],
  ['TypeScript', 'NPM (Node.js)', 'pnpm add @trymirai/uzu'],
  ['Python', 'PyPI', 'uv add uzu'],
  ['Kotlin', 'Coming Soon', ''],
]

const PROMISES = [
  'Same high-level API across every language.',
  'Full performance on every supported device.',
  'One release train, one set of published benchmarks.',
]

const FEATURES = [
  { h: 'Speculative decoding.', b: 'A draft model proposes tokens ahead and the target model verifies them in a single pass, so generation roughly doubles in speed without changing the output.' },
  { h: 'Structured output.', b: 'Constrain generation to a schema and get valid JSON and typed responses back, rather than parsing prose and hoping it holds.' },
  { h: 'Task-specific sessions.', b: 'Reusable sessions keep context warm between calls, so a repeated task skips the cold-start cost every time it runs.' },
  { h: 'One API across languages.', b: 'The same high-level surface in Swift, Rust, TypeScript and Python, so moving between platforms is not a rewrite.' },
]

const FAQ = [
  { q: 'How does model support work?', a: 'The stack has two halves: a conversion and optimization toolkit that turns original checkpoints into an intermediate representation built from a unified operator set, and the engine that executes that representation on Apple Silicon.' },
  { q: 'Which devices are supported?', a: 'Apple Silicon across iPhone, iPad and Mac. Android inference is in progress and has not shipped yet.' },
  { q: 'Can I bring a fine-tune?', a: 'Yes. Fine-tunes and adaptations of supported architectures convert in a single command, with no hand-written kernel work for standard layers.' },
  { q: 'How are the benchmarks produced?', a: 'Every runner is executed back to back on one machine, in one thermal state, with the same prompt set and generation length, so the comparison is like for like.' },
  { q: 'What about quantization quality?', a: 'Each checkpoint is validated against its unquantized baseline, so a speed win that costs accuracy shows up as a quality number rather than hiding in throughput.' },
  { q: 'Is the engine open source?', a: 'The runtime is developed in the open. Conversion and optimization run as a toolkit alongside it.' },
]

/* The hero transcript is static once rendered — it is a still of a session,
   not a typing animation. Tones map onto the terminal palette. */
const HERO_TRANSCRIPT = [
  ['user %  uzu run Qwen3.5-0.8B'],
  ['Loaded: Qwen3.5-0.8B · 4-bit · 460 MB resident'],
  ['> Hi', 'ink'],
  ['', 'blank'],
  ['Reading the greeting, no tools needed…', 'muted'],
  ['', 'blank'],
  ['Hi there — running locally on this device.'],
  ['', 'blank'],
  ['1.904s, 53.8 tok/s', 'accent'],
  ['> Where does this run?', 'ink'],
  ['', 'blank'],
  ['Checking the active device profile…', 'muted'],
  ['', 'blank'],
  ['Entirely on the Neural Engine and GPU of the machine'],
  ['in front of you. No network calls in the loop.'],
  ['', 'blank'],
  ['3.217s, 52.6 tok/s', 'accent'],
  ['?  Send a message', 'caret'],
]

const STEPS = [
  { n: '1', label: 'Choose framework' },
  { n: '2', label: 'Run the following command to install the SDK' },
  { n: '3', label: 'Apply code' },
]

const MENU = ['File', 'Edit', 'View', 'Window', 'Help']


function Steps({ fw, setFw, className = '' }) {
  return (
    <div className={className}>
      {STEPS.map(({ n, label }, si) => (
        <div key={n} className="flex gap-1">
          <div className="flex w-[30px] shrink-0 flex-col items-center">
            <span className="flex size-[30px] shrink-0 items-center justify-center rounded-full border border-hairline text-[14.4px] leading-[21.6px] text-ink-muted">{n}</span>
            {n !== '3' && <span className="mt-2 w-px flex-1 bg-hairline" />}
          </div>
          <div className={`min-w-0 flex-1 ${si < 2 ? 'pb-8' : ''}`}>
            <p className="text-[14px] leading-[30px] text-ink-soft">{label}</p>

            {n === '1' && (
              <div className="flex flex-wrap gap-2">
                {Object.keys(FRAMEWORKS).map((k) => (
                  <button
                    key={k} onClick={() => setFw(k)}
                    className={`flex h-10 items-center gap-2 border px-4 text-[15px] leading-[22.5px] transition-colors ${fw === k ? 'border-rail bg-beige-chip text-ink' : 'border-hairline bg-white text-ink-soft hover:bg-beige'}`}
                  >
                    {LANG_ICON[k] && <img src={LANG_ICON[k]} alt="" aria-hidden className="size-4 shrink-0 object-contain" />}
                    {k}
                  </button>
                ))}
              </div>
            )}

            {n === '2' && (
              <div className="overflow-x-auto border border-hairline bg-beige px-3 py-[10px] font-mono text-[15px] leading-[22.5px] whitespace-nowrap text-ink">{INSTALL_CMD[fw]}</div>
            )}

            {n === '3' && (
              <pre className="h-[515px] overflow-auto border border-hairline bg-beige p-5 font-mono text-[13px] leading-[22px] text-ink">
                {FRAMEWORKS[fw].map((l, i) => (
                  <div key={i} className="flex gap-4">
                    <span className="w-5 shrink-0 text-right text-ink-muted">{i + 1}</span>
                    <span>{l}</span>
                  </div>
                ))}
              </pre>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default function InferenceRuntime() {
  useMeta(
    'uzu: On-device LLM inference engine for iPhone, iPad & Mac',
    'uzu runs LLMs on iPhone, iPad and Mac, with benchmarks published for each release.',
  )
  const [fw, setFw] = useState('Swift')
  const [feat, setFeat] = useState(0)

  return (
    <>
      {/* Hero — 64 + 616. Two columns at 1200: 572 copy, 588 photo plate. */}
      <section className="pt-6 min-[810px]:pt-14 min-[1200px]:pt-16">
        <div className="shell">
          <div className="flex flex-col gap-8 min-[810px]:gap-20 min-[1200px]:flex-row min-[1200px]:items-stretch min-[1200px]:gap-10">
            <div className="flex flex-col min-[1200px]:w-[572px] min-[1200px]:shrink-0 min-[1200px]:justify-between">
              <div className="flex flex-col">
                <span className="type-eyebrow text-ink-muted">Inference Engine</span>
                <HeroRule className="mt-8" />
                <h1 className="product-hero-title mt-5 max-w-[265px] text-ink md:mt-8 min-[810px]:max-w-[480px]">
                  The fastest inference runtime for iPhone, iPad and Mac.
                </h1>
              </div>
              <div className="mt-10 flex flex-col min-[810px]:mt-8 min-[1200px]:mt-0">
                <p className="type-pbody max-w-[541px] text-ink-soft">
                  Optimize and run your model on every Apple device, with prompt processing measurably quicker
                  than the general-purpose alternatives.
                </p>
                <HeroRule className="mt-8" />
                <div className="mt-8 min-[810px]:mt-10"><Cta /></div>
              </div>
            </div>

            <div className="min-[1200px]:flex-1">
              <div className="h-[485px] w-full min-[810px]:h-[616px]">
                <Frame tight hideOnMobile>
                  <SunsetPlate>
                    <div className="absolute top-[6%] left-1/2 h-[89.333%] w-[88.811%] -translate-x-1/2">
                      <TerminalCard
                        caption="uzu by mirai labs"
                        className="h-full"
                        headerClass="h-10 px-3.5"
                        bodyClass="p-5 text-[14px] leading-[23.8px]"
                        lines={HERO_TRANSCRIPT}
                      />
                    </div>
                  </SunsetPlate>
                </Frame>
              </div>
            </div>
          </div>
        </div>
      </section>

      <PerfectFor title="Run your model on 2 billion Apple devices. Perfect for:" />

      <BenchStrip />

      {/* Browser mock — 120 + 52 head, then a 48 + 800 plate. */}
      <Reveal>
        <SectionHead className="pb-6 min-[810px]:pb-0">From install to first token.</SectionHead>
        <div className="h-[0.5px] w-full bg-rail min-[810px]:hidden" />
        <section className="pt-3 min-[810px]:hidden">
          <div className="shell pr-5 pl-2">
            <Steps fw={fw} setFw={setFw} className="bg-white" />
          </div>
        </section>
        <section className="hidden overflow-x-clip pt-6 min-[810px]:block min-[810px]:pt-6 min-[1200px]:pt-12">
          <div className="shell px-2 min-[1240px]:px-2">
            <div className="relative h-[800px] w-full">
              <Frame>
                <SunsetPlate>
                  {/* macOS menu bar */}
                  <div className="absolute inset-x-0 top-0 flex h-[3.75%] min-h-[18px] items-center justify-between px-3 text-[13px] leading-[19.5px] text-white">
                    <div className="flex items-center gap-[1.4em]">
                      <svg viewBox="0 0 14 17" width="13" height="16" fill="currentColor" aria-hidden>
                        <path d="M11.2 9c0-1.6 1.2-2.4 1.3-2.5-.7-1-1.8-1.2-2.2-1.2-1-.1-1.9.6-2.4.6s-1.3-.6-2.1-.6c-1.1 0-2.1.6-2.7 1.6-1.1 2-.3 5 .8 6.6.5.8 1.2 1.7 2 1.7.8 0 1.1-.5 2.1-.5s1.2.5 2.1.5c.9 0 1.4-.8 1.9-1.6.6-.9.9-1.8.9-1.9-.1 0-1.7-.7-1.7-2.7zM9.6 3.6c.4-.5.7-1.3.6-2-.6 0-1.4.4-1.9 1-.4.5-.7 1.3-.6 2 .7 0 1.4-.4 1.9-1z" />
                      </svg>
                      <span className="font-semibold">Safari</span>
                      {MENU.map((m) => <span key={m} className="hidden min-[640px]:inline">{m}</span>)}
                    </div>
                    <span className="hidden text-[0.85em] opacity-90 min-[560px]:block">Mirai · Wed 12:04</span>
                  </div>

                  {/* Browser window */}
                  <div className="absolute top-[10.1%] left-1/2 flex w-[90%] max-w-[864px] -translate-x-1/2 flex-col overflow-hidden rounded-[12px] border border-hairline bg-white shadow-2xl">
                    <div className="flex h-9 items-center gap-2 px-3 min-[810px]:h-11 min-[810px]:gap-3 min-[810px]:px-4">
                      <div className="flex shrink-0 gap-2">
                        <span className="size-3 rounded-full bg-mac-red" />
                        <span className="size-3 rounded-full bg-mac-yellow" />
                        <span className="size-3 rounded-full bg-mac-green" />
                      </div>
                      <div className="mx-auto flex h-7 w-full max-w-[58%] items-center justify-center gap-1.5 rounded-[7px] bg-terminal-chrome px-3 text-[14px] leading-[21px] text-ink-2">
                        <svg viewBox="0 0 12 14" width="11" height="13" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden>
                          <rect x="2" y="6" width="8" height="6" rx="1" />
                          <path d="M4 6V4a2 2 0 0 1 4 0v2" />
                        </svg>
                        <span className="truncate">platform.trymirai.com/settings</span>
                      </div>
                      <span className="hidden w-[73px] shrink-0 min-[640px]:block" />
                    </div>

                    <Steps fw={fw} setFw={setFw} className="border-t border-divider bg-white px-[18px]" />
                  </div>
                </SunsetPlate>
              </Frame>
            </div>
          </div>
        </section>
      </Reveal>

      {/* Install matrix — 120 + 104 head, then 48 + 601 beige panel. */}
      <Reveal>
        <SectionHead maxW="max-w-[500px]">One runtime, integrated from any language.</SectionHead>
        <section className="pt-6 min-[810px]:pt-12">
          <div className="shell">
            <div className="border-[0.5px] border-hairline bg-beige p-5 min-[810px]:p-10">
              <div className="flex flex-col gap-5">
                <div className="hidden gap-3 border-b-[0.5px] border-hairline pb-5 text-[17px] leading-[27.2px] text-ink-soft min-[810px]:grid min-[810px]:grid-cols-[228px_240px_1fr]">
                  {['Language', 'Distribution', 'Snippet'].map((h) => <span key={h}>{h}</span>)}
                </div>
                {INSTALL.map(([l, d, s]) => (
                  <div key={l} className="flex flex-col gap-3 border-b-[0.5px] border-hairline pb-5 last:border-0 min-[810px]:grid min-[810px]:grid-cols-[228px_240px_1fr] min-[810px]:items-center min-[810px]:gap-3">
                    <span className="flex items-center gap-2.5 text-[15px] leading-[25.5px] text-ink min-[810px]:text-[17px] min-[810px]:leading-[27.2px]">
                      {LANG_ICON[l] && <img src={LANG_ICON[l]} alt="" aria-hidden className="size-5 shrink-0 object-contain" />}
                      {l}
                    </span>
                    <span className="hidden text-[15px] leading-[25.5px] text-ink-soft min-[810px]:block min-[810px]:text-[17px] min-[810px]:leading-[27.2px]">{d}</span>
                    <code className="font-mono text-[13px] leading-[20.8px] break-words whitespace-pre-wrap text-ink min-[810px]:text-[17px] min-[810px]:leading-[27.2px]">{s}</code>
                  </div>
                ))}
              </div>
              <div className="mt-5 flex flex-col gap-6 min-[810px]:flex-row min-[810px]:items-end min-[810px]:justify-between">
                <ul className="hidden flex-col gap-4 min-[810px]:flex">
                  {PROMISES.map((p) => (
                    <li key={p} className="flex items-start gap-2.5 text-[17px] leading-[27.2px] text-ink">
                      <span className="mt-[11px] size-1 shrink-0 rounded-full bg-accent" />{p}
                    </li>
                  ))}
                </ul>
                <A href="/i-am-interested" className="inline-flex shrink-0 items-center gap-2 text-[15px] leading-[22.5px] font-medium text-ink hover:opacity-70">
                  Read the docs
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <line x1="5" y1="12" x2="18" y2="12" /><polyline points="12 6 18 12 12 18" />
                  </svg>
                </A>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      {/* Features — 120 + 104 head, then 48 + 560 (dark accordion beside a photo plate). */}
      <Reveal>
        <SectionHead maxW="max-w-[500px]">Built in to every model you ship:</SectionHead>
        <section className="pt-6 min-[810px]:pt-12">
          <div className="shell">
            <div className="grid grid-cols-1 min-[1200px]:grid-cols-2">
              <div className="flex flex-col border-[0.5px] border-ink-soft">
                {FEATURES.map(({ h, b }, i) => (
                  <div key={h} className={`flex flex-col transition-colors ${i > 0 ? 'border-t-[0.5px] border-ink-soft' : ''} ${feat === i ? 'bg-surface-dark-hover' : 'bg-surface-dark hover:bg-surface-dark-hover'}`}>
                    <button
                      onClick={() => setFeat(feat === i ? -1 : i)}
                      aria-expanded={feat === i}
                      className="flex w-full cursor-pointer items-center gap-3 p-8 text-left"
                    >
                      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#FF6A20" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0" aria-hidden>
                        <path d="M2 17l5-5-5-5M10 17h12" />
                      </svg>
                      <span className="flex-1 font-serif text-[24px] leading-[31.2px] text-white">{h}</span>
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                        className={`shrink-0 text-white/60 transition-transform duration-300 ${feat === i ? 'rotate-180' : ''}`} aria-hidden>
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </button>
                    <div
                      className="grid transition-[grid-template-rows] duration-300"
                      style={{ gridTemplateRows: feat === i ? '176px' : '0fr' }}
                    >
                      <div className="overflow-hidden">
                        <p className="max-w-[482px] px-8 pt-6 pb-8 text-[17px] leading-[27.2px] text-white">{b}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="relative hidden min-h-[400px] overflow-hidden min-[810px]:min-h-[420px] min-[1200px]:block min-[1200px]:min-h-[560px]">
                <img src="/shared/sunset-sun-1920.webp" alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-x-4 top-4 h-[440px] min-[810px]:inset-x-8 min-[810px]:top-8 min-[810px]:h-[480px] min-[1200px]:inset-8 min-[1200px]:h-auto">
                  <TerminalCard
                    caption="uzu bench"
                    className="h-full"
                    headerClass="h-10 px-3.5"
                    bodyClass="p-5 text-[13.5px] leading-[23.8px]"
                    lines={[
                      ['$ uzu bench --tokens 2048'],
                      ['', 'blank'],
                      ['engine       … uzu 0.9.2'],
                      ['device       … Apple M5 Max 128GB'],
                      ['checkpoint   … Qwen3.5-0.8B (4-bit)'],
                      ['draft model  … ready'],
                      ['verify pass  … 1 of 1'],
                      ['schema       … constrained (JSON)'],
                      ['session      … warm, reused'],
                      ['', 'blank'],
                      ['decode      114 tok/s', 'accent'],
                      ['prefill     872 tok/s', 'accent'],
                      ['ttft         71 ms', 'accent'],
                      ['resident   15.4 GB'],
                      ['accepted    3.2 draft tok / step'],
                      ['', 'blank'],
                      ['parity vs fp16   0.9993 cosine'],
                      ['', 'blank'],
                      ['done in 2.418s', 'muted'],
                      ['$', 'caret'],
                    ]}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      <ModelCards title="Supported models:" />

      <Faq items={FAQ} />

      <ClosingBand
        title="Bring your model to every Apple device."
        blurb="Converted, quantized, benchmarked on real hardware, and shipped behind one API."
      />
    </>
  )
}
