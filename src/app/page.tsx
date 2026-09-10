import Link from "next/link";
import { listProducts, listCategories } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";
import { Hero } from "@/components/Hero";

export default async function HomePage() {
  const [{ products: featured }, categories] = await Promise.all([
    listProducts({ limit: 4, sort: "newest" }).catch(() => ({ products: [] })),
    listCategories().catch(() => []),
  ]);

  return (
    <div>
      <Hero />

      <section className="px-6 py-16">
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
        <section className="px-6 pb-20">
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
