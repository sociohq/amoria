import { AuthDrawerProvider } from "@/lib/auth-drawer-context";
import { CartProvider } from "@/lib/cart-context";
import { WishlistProvider } from "@/lib/wishlist-context";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { AuthDrawer } from "@/components/AuthDrawer";
import { NewsletterPopup } from "@/components/NewsletterPopup";
import { AuroraMark } from "@/components/AuroraMark";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { ScrollToTopButton } from "@/components/ScrollToTopButton";
import { PageLoader } from "@/components/PageLoader";
import { SmoothScroll } from "@/components/SmoothScroll";
import { listCategories } from "@/lib/products";
import { listHeroSlides } from "@/lib/heroSlides";

// All the storefront-only chrome — announcement bar, mega-menu header,
// footer, cart/auth drawers, the newsletter popup, the floating Aurora
// mark, smooth-scroll — lives here instead of the true root layout, so
// /admin (a sibling top-level segment with its own layout.tsx) never
// mounts any of it. AuthProvider stays in the shared root since the
// admin route guard needs it too; everything else here is storefront-
// specific and would just be dead weight — or actively wrong chrome —
// on a dashboard page.
export default async function StorefrontLayout({ children }: { children: React.ReactNode }) {
  // Resilient to the backend/DB being unavailable — the header should
  // never take the whole site down over a categories fetch.
  const [categories, heroSlides] = await Promise.all([
    listCategories().catch(() => []),
    listHeroSlides().catch(() => []),
  ]);
  // A hero made only of finished banners has its own artwork at the top, so the
  // header stays solid above it instead of floating over the picture.
  const bannerHero = heroSlides.length > 0 && heroSlides.every((s) => s.imageOnly);

  return (
    <SmoothScroll>
      <PageLoader />
      <AuthDrawerProvider>
        <CartProvider>
          <WishlistProvider>
            <Header categories={categories} bannerHero={bannerHero} />
            <main className="min-h-screen">{children}</main>
            <Footer />
            <CartDrawer />
            <AuthDrawer />
            <NewsletterPopup />
            <AuroraMark />
            <WhatsAppButton />
            <ScrollToTopButton />
          </WishlistProvider>
        </CartProvider>
      </AuthDrawerProvider>
    </SmoothScroll>
  );
}
