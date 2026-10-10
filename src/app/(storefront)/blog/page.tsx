import Image from "next/image";
import Link from "next/link";
import { listPosts } from "@/lib/posts";
import { formatPostDate } from "@/lib/format";

export const metadata = {
  title: "Journal",
  description: "Fragrance guides, new arrivals and stories from the Amoria Perfume journal.",
};


export default async function BlogIndexPage() {
  const posts = await listPosts().catch(() => []);

  return (
    <div>
      {/* Static hero — introduces the Journal, doesn't preview any one
          post. Every post (the one dummy story today, more later) is
          listed as an equal card in the grid below instead. */}
      <section className="relative flex h-[50vh] min-h-[340px] items-end overflow-hidden bg-ink">
        <Image src="/categories/inspired-fragrance.png" alt="" fill sizes="100vw" className="object-cover" priority />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="relative z-10 px-6 pb-16 sm:px-12">
          <p className="label-caps text-gold-light">The Journal</p>
          <h1 className="mt-3 max-w-2xl font-serif text-4xl leading-tight text-cream sm:text-5xl">
            Stories from the house of Amoria.
          </h1>
          <p className="mt-4 max-w-xl text-cream/85">Fragrance guides, rituals, and notes from behind the counter.</p>
        </div>
      </section>

      <div className="px-6 py-16 sm:px-12">
        {posts.length === 0 ? (
          <p className="py-16 text-center text-ink-soft">No stories yet. Check back soon.</p>
        ) : (
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
            {posts.map((p) => (
              <Link key={p.id} href={`/blog/${p.slug}`} className="group block">
                {/* Small landscape rectangle, not a tall portrait — reads
                    as a compact preview thumbnail rather than a second
                    hero image. */}
                <div className="relative aspect-[3/2] overflow-hidden bg-cream-dark">
                  <Image
                    src={p.heroImage}
                    alt={p.title}
                    fill
                    sizes="(min-width: 1024px) 25vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="mt-3">
                  {p.heroEyebrow && <p className="label-caps text-gold">{p.heroEyebrow}</p>}
                  <p className="mt-1 text-xs text-ink-soft">{formatPostDate(p.publishedAt ?? p.createdAt)}</p>
                  <p className="mt-1 font-serif text-lg text-ink group-hover:text-royal">{p.title}</p>
                  <p className="mt-1 line-clamp-2 text-sm text-ink-soft">{p.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
