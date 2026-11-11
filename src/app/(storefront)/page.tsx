import { listFeaturedMix, getHomeSections, listCategories, getShopTheLook, getFeaturedReviews, getGenderShowcase } from "@/lib/products";
import { listHeroSlides } from "@/lib/heroSlides";
import { getPromoBanner } from "@/lib/promoBanner";
import { listPosts } from "@/lib/posts";
import { BlogSection } from "@/components/BlogSection";
import { HeroSlider } from "@/components/HeroSlider";
import { CategoryShowcase } from "@/components/CategoryShowcase";
import { SaleSection } from "@/components/SaleSection";
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
  const [homeSections, categories, shopTheLook, reviews, genderShowcase, heroSlides, posts, statementBanner, customizeBanner] = await Promise.all([
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
    listPosts().catch(() => []),
    // null = switched off in the admin; if it can't be fetched the original banner is shown.
    getPromoBanner("statement"),
    getPromoBanner("customize"),
  ]);

  return (
    <div>
      <HeroSlider slides={heroSlides} />
      <SaleSection categories={categories} />
      <CategoryShowcase categories={categories} />
      <Reveal>
        <FragranceFamilyScroller />
      </Reveal>
      {customizeBanner && (
        <Reveal>
          <CustomizePerfumeBanner banner={customizeBanner} />
        </Reveal>
      )}
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
      {/* New Arrivals leads straight into the oil-bottle banner; the brand strip follows it. */}
      {statementBanner && (
        <Reveal>
          <StatementBottleBanner banner={statementBanner} />
        </Reveal>
      )}
      <Reveal>
        <BrandLogoGrid />
      </Reveal>
      {shopTheLook && (
        <Reveal>
          <ShopTheLook section={shopTheLook} />
        </Reveal>
      )}
      {/* The journal teaser: newest stories (up to three), just above the video reels. */}
      {posts.length > 0 && (
        <Reveal>
          <BlogSection posts={posts} />
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
