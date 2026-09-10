import Link from "next/link";
import Image from "next/image";
import { listProducts, listCategories } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";

export default async function HomePage() {
  const [{ products: featured }, categories] = await Promise.all([
    listProducts({ limit: 4, sort: "newest" }).catch(() => ({ products: [] })),
    listCategories().catch(() => []),
  ]);

  return (
    <div>
      <section className="relative flex min-h-[70vh] items-center overflow-hidden">
        <Image src="/hero-banner.jpg" alt="" fill priority sizes="100vw" className="object-cover" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/40 via-black/10 to-transparent" />
        <div className="relative z-10 mx-auto w-full max-w-6xl px-6">
          <div className="max-w-md">
            <h1 className="font-serif text-4xl leading-tight text-cream sm:text-5xl">
              Scent, the way Arabia remembers it.
            </h1>
            <p className="mt-5 text-cream/85">Ouds, attars and signature perfumes crafted for the Gulf, delivered across the UAE.</p>
            <Link href="/shop" className="mt-8 inline-block bg-ink px-8 py-3 label-caps text-cream hover:opacity-90">
              Shop Amoria Signature
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-6 sm:grid-cols-3">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/shop?category=${c.slug}`}
              className="group flex aspect-[4/3] flex-col items-center justify-center gap-3 bg-cream-dark transition-colors hover:bg-emerald"
            >
              <span className="font-serif text-2xl text-ink transition-colors group-hover:text-cream">{c.name}</span>
              <span className="label-caps text-ink-soft transition-colors group-hover:text-gold-light">
                Shop now
              </span>
            </Link>
          ))}
        </div>
      </section>

      {featured.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 pb-20">
          <h2 className="mb-8 font-serif text-3xl text-ink">New Arrivals</h2>
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
