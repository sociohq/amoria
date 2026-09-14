import Link from "next/link";
import Image from "next/image";
import { listPosts } from "@/lib/posts";

export default async function BlogIndexPage() {
  const posts = await listPosts().catch(() => []);
  const [featured, ...rest] = posts;

  return (
    <div>
      <section className="relative flex h-[60vh] min-h-[380px] items-end overflow-hidden bg-ink">
        {featured && (
          <Image src={featured.heroImage} alt="" fill sizes="100vw" className="object-cover" priority />
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="relative z-10 px-6 pb-16 sm:px-12">
          <p className="label-caps text-gold-light">The Journal</p>
          {featured ? (
            <Link href={`/blog/${featured.slug}`}>
              <h1 className="mt-3 max-w-3xl font-serif text-4xl leading-tight text-cream hover:text-gold-light sm:text-5xl">
                {featured.title}
              </h1>
            </Link>
          ) : (
            <h1 className="mt-3 font-serif text-4xl text-cream sm:text-5xl">Stories from Amoria</h1>
          )}
          {featured && <p className="mt-4 max-w-xl text-cream/85">{featured.excerpt}</p>}
        </div>
      </section>

      {/* Only the featured post exists yet — no padded, empty section
          reserving space below the hero for a "more stories" grid that
          has nothing in it. */}
      {rest.length === 0 && !featured && (
        <p className="px-6 py-16 text-center text-ink-soft sm:px-12">No stories yet — check back soon.</p>
      )}
      {rest.length > 0 && (
        <div className="px-6 py-16 sm:px-12">
          <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((p) => (
              <Link key={p.id} href={`/blog/${p.slug}`} className="group block">
                <div className="relative aspect-[4/5] overflow-hidden bg-cream-dark">
                  <Image
                    src={p.heroImage}
                    alt={p.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, 50vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="mt-3">
                  {p.heroEyebrow && <p className="label-caps text-gold">{p.heroEyebrow}</p>}
                  <p className="mt-1 font-serif text-xl text-ink group-hover:text-emerald">{p.title}</p>
                  <p className="mt-1 line-clamp-2 text-sm text-ink-soft">{p.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
