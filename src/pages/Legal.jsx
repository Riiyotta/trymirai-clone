import { useMeta } from '../components/Page'

/* Structure only — the original's policy text is its own legal copy and is not
   reproduced here. */
const SECTIONS = [
  'Who we are', 'What we collect', 'How we use it', 'Sharing and processors',
  'Retention', 'Your rights', 'Contact',
]

function LegalPage({ title, description, kind }) {
  useMeta(title, description)
  return (
    <section className="mx-auto w-full max-w-[720px] px-5 pt-8 pb-20 min-[810px]:pt-14">
      <h1 className="type-h1 text-foreground">{title.split(' |')[0]}</h1>
      <p className="type-body mt-6">
        This clone reproduces the page structure and typography only. The {kind} text on trymirai.com is
        Mirai Labs’ own legal copy and is not reproduced here.
      </p>
      <div className="mt-10 flex flex-col gap-8">
        {SECTIONS.map((s) => (
          <div key={s} className="flex flex-col gap-3 border-t-[0.5px] border-rail pt-6">
            <h2 className="text-[17px] text-ink">{s}</h2>
            <p className="type-body">Section placeholder.</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export const PrivacyPolicy = () => (
  <LegalPage title="Privacy Policy | Mirai Labs" description="Privacy policy for Mirai Labs." kind="policy" />
)
export const TermsOfUse = () => (
  <LegalPage title="Terms of Use | Mirai Labs" description="Terms of use for Mirai Labs." kind="terms" />
)
