import { Reveal } from './useInView'

const COLS = [
  { h: 'Cloud', items: ['Large batches', 'Throughput-first', 'Memory-rich', 'Compute-saturating'] },
  { h: 'On-device', items: ['Batch size = 1', 'Latency-first', 'Memory-constrained', 'Bandwidth-sensitive'], accent: true },
]

export default function CloudVsDevice() {
  return (
    <Reveal>
      <section>
        <div className="shell">
          <div className="grid bg-white md:grid-cols-2 md:border-y-[0.5px] md:border-rail">
            <div className="flex flex-col gap-6 pt-6 md:min-h-[301px] md:justify-between md:gap-10 md:border-r-[0.5px] md:border-rail md:py-10 md:pr-10">
              <p className="type-body">Why can&apos;t we just run a cloud model on a device?</p>
              <h2 className="type-h2 max-w-[301px] text-ink md:max-w-none xl:max-w-[442px]">
                On-device is not a smaller cloud. It&rsquo;s a different system entirely.
              </h2>
            </div>

            <div className="flex gap-0 bg-white pt-5 md:gap-3 md:p-3 lg:gap-5 lg:p-5">
              {COLS.map(({ h, items, accent }) => (
                <div key={h} className="flex flex-1 flex-col overflow-clip border-[0.5px] border-rail bg-cream p-5 md:min-h-[277px]">
                  <h3 className="type-h3 text-ink">{h}</h3>
                  <ul className="mt-5 flex flex-col gap-2.5">
                    {items.map((i) => (
                      <li key={i} className="flex items-center gap-2.5 text-[14px] leading-[22px] text-ink-soft">
                        <span className={`size-1 shrink-0 rounded-full ${accent ? 'bg-accent' : 'bg-rail'}`} />
                        {i}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Reveal>
  )
}
