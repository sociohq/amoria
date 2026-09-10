import { listProducts, listCategories } from "@/lib/products";
import { Hero } from "@/components/Hero";
import { CategoryShowcase } from "@/components/CategoryShowcase";
import { ProductSection } from "@/components/ProductSection";
import { OurStores } from "@/components/OurStores";

export default async function HomePage() {
  const [{ products: featured }, categories] = await Promise.all([
    listProducts({ limit: 8, sort: "newest" }).catch(() => ({ products: [] })),
    listCategories().catch(() => []),
  ]);

  return (
    <div>
      <Hero />
      <CategoryShowcase categories={categories} />
      <ProductSection eyebrow="Extrait de Parfum" title="Featured Products" products={featured} />
      <OurStores />
    </div>
  );
}
