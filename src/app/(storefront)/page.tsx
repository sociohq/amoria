import { listFeaturedMix, getHomeSections, listCategories, getShopTheLook, getFeaturedReviews, getGenderShowcase } from "@/lib/products";
import { listHeroSlides } from "@/lib/heroSlides";
import { HeroSlider } from "@/components/HeroSlider";
import { CategoryShowcase } from "@/components/CategoryShowcase";
import { FragranceFamilyScroller } from "@/components/FragranceFamilyScroller";
import { ProductSection } from "@/components/ProductSection";
import { BrandLogoGrid } from "@/components/BrandLogoGrid";
import { CustomizePerfumeBanner } from "@/components/CustomizePerfumeBanner";
import { GenderShowcase } from "@/components/GenderShowcase";
import { ShopReels } from "@/components/ShopReels";
import { ShopTheLook } from "@/components/ShopTheLook";
import { StatementBottleBanner } from "@/components/StatementBottleBanner";
import { ReviewsSection } from "@/components/ReviewsSection";
import { OurStores } from "@/components/OurStores";
import { Reveal } from "@/components/Reveal";

export default async function HomePage() {
  const [homeSections, categories, shopTheLook, reviews, genderShowcase, heroSlides] = await Promise.all([
    // The rows are set up in the admin; if that can't be reached, fall back to the plain Featured mix.
    getHomeSections().catch(async () => {
      const products = await listFeaturedMix().catch(() => []);
      return [{ key: "featured", eyebrow: "Extrait de Parfum", title: "Featured Products", viewAllHref: "/shop", products }];
    }),
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
        <FragranceFamilyScroller />
      </Reveal>
      <Reveal>
        <CustomizePerfumeBanner />
      </Reveal>
      {genderShowcase && <GenderShowcase section={genderShowcase} />}
      {homeSections.map((section) => (
        <Reveal key={section.key}>
          <ProductSection
            eyebrow={section.eyebrow}
            title={section.title}
            products={section.products}
            viewAllHref={section.viewAllHref}
          />
        </Reveal>
      ))}
      <Reveal>
        <BrandLogoGrid />
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
