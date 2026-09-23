import { useParams } from 'react-router-dom'
import { useMeta } from '../components/Page'
import { Reveal } from '../components/useInView'
import A from '../components/A'

const POSTS = [
  { slug: 'speculative-decoding-in-uzu', title: 'Speculative decoding in uzu', tag: 'Engineering',
    blurb: 'How a draft model proposes tokens ahead of time and the target model verifies them in a single pass.' },
  { slug: 'trees-from-marginals', title: 'Trees from Marginals: autoregressive drafting with factorized heads', tag: 'Research',
    blurb: 'Building draft trees from marginal distributions instead of sampling each branch sequentially.' },
  { slug: 'sparse-buffers-for-kv-cache', title: 'Sparse Buffers for KV Cache', tag: 'Engineering',
    blurb: 'Keeping the key/value cache resident on memory-constrained devices without paying for the gaps.' },
  { slug: 'tackling-random-foreign-characters', title: 'Tackling random foreign characters', tag: 'Engineering',
    blurb: 'Chasing down stray tokens that surface when a quantized model drifts outside its expected vocabulary.' },
  { slug: 'quantization', title: 'Introducing Mirai Quantization', tag: 'Research',
    blurb: 'A quantization scheme co-designed with the architecture, so compression does not cost interaction quality.' },
]

export function BlogIndex() {
  useMeta(
    'On-Device AI Research: Quantization, KV Cache | Mirai Labs',
    'Research and engineering notes from Mirai Labs on quantization, KV cache and speculative decoding.',
  )
  return (
    <section className="mx-auto w-full max-w-[992px] px-5 pt-8 pb-5 min-[810px]:px-0 min-[810px]:pt-14">
      <div className="flex flex-col items-center text-center">
        <h1 className="type-h1 text-foreground">Research &amp; Blog</h1>
        <p className="type-body-lg mt-4 max-w-[560px]">
          Notes on what we are building and what we measured while building it.
        </p>
      </div>

      <div className="mt-10 flex flex-col md:mt-[68px] lg:mt-16">
        {POSTS.map((p) => (
          <Reveal key={p.slug}>
            {/* 992x400 card: 40px inset, image and copy side by side with a 40px gap */}
            <A
              href={`/blog/${p.slug}`}
              className="flex flex-col gap-6 p-5 transition-opacity hover:opacity-80 min-[810px]:h-[400px] min-[810px]:flex-row min-[810px]:gap-10 min-[810px]:p-10"
            >
              <img
                src={`/blog/${p.slug}.webp`}
                alt=""
                aria-hidden
                loading="lazy"
                className="h-[200px] w-full shrink-0 rounded-[4px] bg-[#f7f7f7] object-cover min-[810px]:h-[320px] min-[810px]:w-[436px]"
              />
              <div className="flex flex-col justify-center gap-3 min-[810px]:h-[320px] min-[810px]:w-[436px]">
                <p className="type-caption">{p.tag}</p>
                <h2 className="font-sans text-[32px] leading-[48px] font-normal text-[#252525]">{p.title}</h2>
                <p className="type-body">{p.blurb}</p>
              </div>
            </A>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

export function BlogPost() {
  const { slug } = useParams()
  const post = POSTS.find((p) => p.slug === slug)
  useMeta(
    `${post ? post.title : 'Post'} | Mirai Labs`,
    post ? post.blurb : 'Mirai Labs research post.',
  )
  if (!post) {
    return (
      <section className="mx-auto w-full max-w-[720px] px-5 py-20">
        <h1 className="type-h1 text-foreground">Post not found</h1>
        <A href="/blog" className="mt-6 inline-block text-[15px] underline decoration-dotted underline-offset-4">Back to the blog</A>
      </section>
    )
  }
  return (
    <article className="mx-auto w-full max-w-[720px] px-5 pt-8 pb-20 min-[810px]:pt-14">
      <p className="type-caption font-mono uppercase">{post.tag}</p>
      <h1 className="type-h1 mt-4 text-foreground">{post.title}</h1>
      <p className="type-body-lg mt-6">{post.blurb}</p>
      <img src={`/blog/${post.slug}.webp`} alt="" aria-hidden className="mt-10 h-[320px] w-full rounded-[4px] bg-cream object-cover" />
      <p className="type-body mt-10">
        The article body on trymirai.com is Mirai Labs’ own editorial writing and is not reproduced in this
        clone. The route, metadata, index behaviour and layout are matched; the prose is not.
      </p>
      <A href="/blog" className="mt-8 inline-block text-[15px] text-ink underline decoration-dotted underline-offset-4 hover:opacity-70">
        Back to the blog
      </A>
    </article>
  )
}
