import { useState } from 'react'
import { useMeta } from '../components/Page'
import { Frame } from '../components/Shared'

const FIELDS = [
  { id: 'name', label: 'Full name:', type: 'text' },
  { id: 'company', label: 'Company:', type: 'text' },
  { id: 'email', label: 'Email:', type: 'email' },
]

function ContactCard() {
  const [sent, setSent] = useState(false)
  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-[10px] bg-white">
      <div className="flex flex-1 flex-col px-4 pt-4 pb-5 min-[810px]:p-6">
        <form
          className="flex h-full w-full flex-col gap-5"
          onSubmit={(e) => { e.preventDefault(); setSent(true) }}
        >
          <div className="flex items-center gap-2 border-b border-hairline pb-3">
            <span className="shrink-0 text-[14px] leading-[18.2px] text-muted">To:</span>
            <a
              href="mailto:contact@trymirai.com"
              className="text-[14px] leading-[18.2px] text-ink underline decoration-dotted underline-offset-4"
            >
              contact@trymirai.com
            </a>
          </div>

          {FIELDS.map(({ id, label, type }) => (
            <label key={id} className="flex h-9 items-center gap-2 border-b border-hairline">
              <span className="shrink-0 text-[14px] leading-[18.2px] text-muted">{label}</span>
              <input
                type={type} name={id} required={id === 'email'} maxLength={200}
                className="min-w-0 flex-1 bg-transparent text-[14px] leading-[18.2px] text-ink outline-none"
              />
            </label>
          ))}

          <div className="flex flex-1 flex-col">
            <div className="flex items-start justify-between gap-4">
              <label htmlFor="interest" className="text-[14px] leading-[18.2px] text-muted">
                What interests you in Mirai:
              </label>
              <span className="text-[14px] leading-[18.2px] text-muted">Optional</span>
            </div>
            <textarea
              id="interest" name="interest" maxLength={5000}
              className="mt-2 w-full flex-1 resize-none bg-transparent text-[14px] leading-[20px] text-ink outline-none"
            />
          </div>

          <button
            type="submit"
            className="flex h-10 w-full shrink-0 items-center justify-center rounded-md bg-ink text-[15px] leading-[22.5px] font-medium text-white transition-opacity hover:opacity-85"
          >
            {sent ? 'Sent' : 'Send'}
          </button>
          {sent && (
            <p className="type-caption" role="status">This clone does not submit anywhere.</p>
          )}
        </form>
      </div>
    </div>
  )
}

export default function Interested() {
  useMeta(
    'Contact Mirai Labs: uzu, models, Mac app & SDK | Mirai Labs',
    'Get in touch with Mirai Labs about the inference engine, model conversion, the macOS app or the SDK.',
  )
  return (
    <div className="pb-[30px] min-[810px]:pb-20">
      <div className="shell pt-[42px] min-[810px]:pt-[72px]">
        <h1 className="type-h1-page text-foreground">Talk to us</h1>
      </div>

      {/* Desktop: a 1200x696 framed panel with the 600x482 card inside */}
      <section className="mx-auto mt-20 hidden h-[696px] w-[1200px] max-w-[calc(100%-40px)] min-[810px]:block">
        <Frame tight>
          <div className="absolute inset-2 overflow-hidden">
            <div className="absolute top-[15.528%] left-1/2 h-[482px] w-[600px] -translate-x-1/2">
              <ContactCard />
            </div>
          </div>
        </Frame>
      </section>

      {/* Mobile */}
      <section className="mx-5 mt-10 min-[810px]:hidden">
        <div className="h-[482px]"><ContactCard /></div>
      </section>
    </div>
  )
}
