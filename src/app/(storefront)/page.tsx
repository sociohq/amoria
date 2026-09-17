import { listProducts, listCategories, getShopTheLook, getFeaturedReviews, getGenderShowcase } from "@/lib/products";
import { listHeroSlides } from "@/lib/heroSlides";
import { HeroSlider } from "@/components/HeroSlider";
import { CategoryShowcase } from "@/components/CategoryShowcase";
import { ProductSection } from "@/components/ProductSection";
import { CustomizePerfumeBanner } from "@/components/CustomizePerfumeBanner";
import { GenderShowcase } from "@/components/GenderShowcase";
import { ShopReels } from "@/components/ShopReels";
import { ShopTheLook } from "@/components/ShopTheLook";
import { StatementBottleBanner } from "@/components/StatementBottleBanner";
import { ReviewsSection } from "@/components/ReviewsSection";
import { OurStores } from "@/components/OurStores";
import { Reveal } from "@/components/Reveal";

export default async function HomePage() {
  const [{ products: featured }, categories, shopTheLook, reviews, genderShowcase, heroSlides] = await Promise.all([
    listProducts({ limit: 8, sort: "newest" }).catch(() => ({ products: [] })),
    listCategories().catch(() => []),
    getShopTheLook().catch(() => null),
    getFeaturedReviews().catch(() => []),
    getGenderShowcase().catch(() => null),
    listHeroSlides().catch(() => []),
  ]);

  return (
    <div>
      <HeroSlider slides={heroSlides} />
      <CategoryShowcase categories={categories} />
      <Reveal>
        <CustomizePerfumeBanner />
      </Reveal>
      {genderShowcase && <GenderShowcase section={genderShowcase} />}
      <Reveal>
        <ProductSection eyebrow="Extrait de Parfum" title="Featured Products" products={featured} />
      </Reveal>
      <Reveal>
        <StatementBottleBanner />
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
