import { listProducts, listCategories, getShopTheLook, getFeaturedReviews } from "@/lib/products";
import { Hero } from "@/components/Hero";
import { CategoryShowcase } from "@/components/CategoryShowcase";
import { ProductSection } from "@/components/ProductSection";
import { FindYourScentBanner } from "@/components/FindYourScentBanner";
import { ShopReels } from "@/components/ShopReels";
import { ShopTheLook } from "@/components/ShopTheLook";
import { ReviewsSection } from "@/components/ReviewsSection";
import { OurStores } from "@/components/OurStores";
import { Reveal } from "@/components/Reveal";

export default async function HomePage() {
  const [{ products: featured }, categories, shopTheLook, reviews] = await Promise.all([
    listProducts({ limit: 8, sort: "newest" }).catch(() => ({ products: [] })),
    listCategories().catch(() => []),
    getShopTheLook().catch(() => null),
    getFeaturedReviews().catch(() => []),
  ]);

  return (
    <div>
      <Hero />
      <CategoryShowcase categories={categories} />
      <Reveal>
        <FindYourScentBanner />
      </Reveal>
      <Reveal>
        <ProductSection eyebrow="Extrait de Parfum" title="Featured Products" products={featured} />
      </Reveal>
      {shopTheLook && (
        <Reveal>
          <ShopTheLook section={shopTheLook} />
        </Reveal>
      )}
      <Reveal>
        <ShopReels />
      </Reveal>
      <Reveal>
        <ReviewsSection eyebrow="Loved By Our Customers" title="What Our Customers Say" reviews={reviews} />
      </Reveal>
      <Reveal>
        <OurStores />
      </Reveal>
    </div>
  );
}
