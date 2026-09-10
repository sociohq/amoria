import { listProducts, listCategories } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";
import { Hero } from "@/components/Hero";
import { CategoryShowcase } from "@/components/CategoryShowcase";

export default async function HomePage() {
  const [{ products: featured }, categories] = await Promise.all([
    listProducts({ limit: 4, sort: "newest" }).catch(() => ({ products: [] })),
    listCategories().catch(() => []),
  ]);

  return (
    <div>
      <Hero />

      <CategoryShowcase categories={categories} />

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
