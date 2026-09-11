import { listProducts, listCategories } from "@/lib/products";
import { Hero } from "@/components/Hero";
import { CategoryShowcase } from "@/components/CategoryShowcase";
import { ProductSection } from "@/components/ProductSection";
import { FindYourScentBanner } from "@/components/FindYourScentBanner";
import { ShopReels } from "@/components/ShopReels";
import { OurStores } from "@/components/OurStores";
import { Reveal } from "@/components/Reveal";

export default async function HomePage() {
  const [{ products: featured }, categories] = await Promise.all([
    listProducts({ limit: 8, sort: "newest" }).catch(() => ({ products: [] })),
    listCategories().catch(() => []),
  ]);

  return (
    <div>
      <Hero />
      <CategoryShowcase categories={categories} />
      <Reveal>
        <ProductSection eyebrow="Extrait de Parfum" title="Featured Products" products={featured} />
      </Reveal>
      <Reveal>
        <ShopReels />
      </Reveal>
      <Reveal>
        <FindYourScentBanner />
      </Reveal>
      <Reveal>
        <OurStores />
      </Reveal>
    </div>
  );
}
