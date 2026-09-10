import Link from "next/link";
import { listProducts, listCategories } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";

export default async function HomePage() {
  const [{ products: featured }, categories] = await Promise.all([
    listProducts({ limit: 4, sort: "newest" }).catch(() => ({ products: [] })),
    listCategories().catch(() => []),
  ]);

  return (
    <div>
      <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-emerald text-cream">
        <div className="relative z-10 mx-auto max-w-2xl px-6 text-center">
          <p className="label-caps mb-4 text-gold-light">The Amoria Collection</p>
          <h1 className="font-serif text-5xl leading-tight sm:text-6xl">Fragrance, considered.</h1>
          <p className="mx-auto mt-5 max-w-md text-cream/80">
            Extrait, parfum, and eau de toilette — crafted for men, women, and everyone in between.
          </p>
          <Link
            href="/shop"
            className="mt-8 inline-block border border-gold-light px-8 py-3 label-caps text-gold-light transition-colors hover:bg-gold-light hover:text-emerald"
          >
            Shop the Collection
          </Link>
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
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
