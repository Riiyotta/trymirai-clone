import { useMeta } from '../components/Page'
import { Reveal } from '../components/useInView'

/* The original is a narrow single-column article: a 600px measure centred in the
   shell, h2 at 28px, body at 17px/27.2, blocks separated by hairline dividers —
   not the two-column grid the rest of the site uses. */

/* Informative, not decorative: the heading announces who backs the company,
   so these carry real alt text rather than aria-hidden. */
const BACKERS = [
  ['yc', 'Y Combinator'], ['stripe', 'Stripe'], ['uncork', 'Uncork Capital'],
  ['mlx', 'MLX'], ['ben', 'Ben'], ['gokul', 'Gokul'], ['marcin', 'Marcin'], ['mati', 'Mati'],
]

const BLOCKS = [
  {
    h: 'What we believe?',
    paras: [
      'The trinity is model, inference stack and hardware, and the three only behave well when each one is designed against the other two. A company that owns a single piece of it inherits everyone else\u2019s architectural decisions and spends most of its time working around them.',
      'We would rather hold all three and be answerable for the whole result, including the parts that are inconvenient to own. It is a slower way to start, and it is the only arrangement where the hard problems are actually ours to fix rather than to route around.',
      'Most labs still treat on-device as a scaled-down cloud deployment, shipping a smaller model and hoping the experience survives the cut. We think that framing is precisely what has kept local intelligence feeling slow for as long as it has.',
    ],
  },
  {
    h: 'What we are building?',
    paras: [
      'A stack designed around the device rather than shrunk to fit it: models built for memory-bound execution, a runtime that assumes a batch size of one, and a quantization scheme designed alongside both instead of bolted on after the fact.',
      'Those three pieces are developed together, because on a phone the gains that matter come from how they interact rather than from any single one of them. Tuning one layer in isolation tends to move the bottleneck instead of removing it.',
      'Every layer is measured on real hardware under the same conditions, so a gain in one place cannot quietly cost you something somewhere else. If a change buys throughput and spends latency, we would rather see that in the numbers than discover it later.',
    ],
  },
  {
    h: 'What makes Mirai different?',
    paras: [
      'We start from the constraint instead of apologising for it. On-device is its own system, latency-first and memory-constrained and bandwidth-sensitive, and treating it that way rather than as a smaller cloud is what puts realtime local intelligence within reach.',
      'It is also why we build every layer ourselves rather than assembling someone else\u2019s and hoping the seams hold. Owning the whole path means a regression has one place to live, and an improvement does not have to be negotiated across three vendors.',
      'That is slower to start and harder to staff, and it is the only version of the problem we find worth solving properly. The alternative is a stack that looks fast in benchmarks and feels disappointing in the hand.',
    ],
  },
]

function Divider() {
  return (
    <div className="shell mt-8 min-[810px]:mt-12">
      <div className="mx-auto h-px max-w-[600px] bg-rail/60" />
    </div>
  )
}

function Block({ h, paras, children }) {
  return (
    <section className="mt-9 min-[810px]:mt-[86px]">
      <h2 className="text-[20px] leading-[1.3] text-ink md:text-[28px]">{h}</h2>
      <div className="mt-6 flex flex-col gap-5 text-[17px] leading-[27.2px] text-ink-soft">
        {paras.map((p, i) => <p key={i}>{p}</p>)}
      </div>
      {children}
    </section>
  )
}

export default function AboutUs() {
  useMeta(
    'About Mirai Labs: the On-Device AI Lab for Apple Silicon',
    'Mirai Labs builds the models, inference runtime and quantization stack for realtime local intelligence on Apple Silicon.',
  )
  return (
    <>
      <div className="shell pt-5 min-[810px]:pt-20">
        <div className="mx-auto max-w-[276px] text-left min-[810px]:max-w-[720px] min-[810px]:text-center">
          <h1 className="type-h1-page text-foreground">
            We&rsquo;re a small, senior team building the full on-device stack to achieve realtime local
            intelligence
          </h1>
        </div>
      </div>

      <Divider />

      <Reveal>
        <div className="shell">
          <div className="mx-auto max-w-[600px]">
            <Block h="Who we are?" paras={[
              'We are a frontier lab working only on on-device AI \u2014 the models, the inference runtime and the quantization stack, built from the device constraint up.',
            ]} />

            {BLOCKS.map((b) => <Block key={b.h} {...b} />)}

            {/* Team: two 302px cards with a 64px avatar, as measured */}
            <Block h="The team" paras={[
              'A small, senior team in which each person covers a lot of ground: the problems here run from kernel-level scheduling through quantization to model architecture, and nobody is boxed into one layer of the stack.',
              'That breadth is deliberate. The gains we care about show up between the layers, and they are hard to find if the people working on them never cross over.',
              'The original names its founders here with short biographies and photographs. This clone keeps the card layout and leaves the people anonymous.',
            ]}>
              <div className="-mx-5 mt-10 flex flex-col gap-6 min-[810px]:mx-0">
                {[0, 1].map((i) => (
                  <div
                    key={i}
                    className="flex min-h-[302px] flex-col gap-5 border-[0.5px] border-hairline bg-beige p-6"
                  >
                    <div className="flex flex-col items-start gap-4 min-[810px]:flex-row min-[810px]:items-center">
                      <span
                        className="flex size-16 shrink-0 items-center justify-center rounded-full bg-ink/10 text-ink/40"
                        aria-hidden
                      >
                        {/* generic avatar — portraits deliberately not used */}
                        <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
                          <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10m0 2c-5 0-9 2.5-9 5.5V22h18v-2.5c0-3-4-5.5-9-5.5" />
                        </svg>
                      </span>
                      <div className="flex flex-col gap-1.5">
                        <p className="text-[17px] text-ink">Co-founder &amp; co-CEO</p>
                        <p className="type-caption">Mirai Labs</p>
                      </div>
                    </div>
                    <p className="text-[13px] leading-[20.8px] text-ink-soft">
                      Biography withheld in this clone. The layout, card size and avatar placement match the
                      original; the text about the person does not.
                    </p>
                    <span className="text-[13px] leading-[20.8px] text-muted">Placeholder line</span>
                  </div>
                ))}
              </div>
            </Block>
          </div>
        </div>
      </Reveal>

      <Divider />

      <Reveal>
        <div className="shell">
          <div className="mx-auto max-w-[600px]">
            <Block h="Our Vision" paras={[
              'The silicon has already shipped and the devices are in people\u2019s hands. Two billion of them are sitting there waiting, and what remains unsolved is the software that would let them work at full capability without asking permission from a datacentre.',
              'We think an on-device frontier lab is what closes that gap, and that the work belongs in the open with the numbers published rather than asserted. Benchmarks that cannot be reproduced on the same machine are marketing, not measurement.',
              'If the interaction becomes fast enough that nobody notices the model is there, the argument about where it runs stops mattering to anyone except us. That is the point at which local intelligence stops being a trade-off and becomes the default.',
            ]} />
          </div>
        </div>
      </Reveal>

      {/* 4-up investor band: 292.5px columns, 10px gap, 293x160 beige cards */}
      <Reveal>
        <section className="shell mt-[86px]">
          <h2 className="mx-auto max-w-[600px] text-[20px] leading-[1.3] text-ink md:text-[28px]">
            Backed by leading AI builders and investors:
          </h2>
          <div className="mt-8 grid grid-cols-2 gap-[10px] md:grid-cols-4">
            {BACKERS.map(([name, label]) => (
              <div
                key={name}
                className="flex h-[160px] items-center justify-center border-[0.5px] border-hairline bg-beige p-4"
              >
                <img
                  src={`/about-us/logo-${name}.svg`}
                  alt={label}
                  className="max-h-[56px] max-w-[70%] object-contain"
                />
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      <div className="pb-20" />
    </>
  )
}
