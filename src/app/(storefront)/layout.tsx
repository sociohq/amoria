import { AuthDrawerProvider } from "@/lib/auth-drawer-context";
import { CartProvider } from "@/lib/cart-context";
import { WishlistProvider } from "@/lib/wishlist-context";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { AuthDrawer } from "@/components/AuthDrawer";
import { NewsletterPopup } from "@/components/NewsletterPopup";
import { AuroraMark } from "@/components/AuroraMark";
import { PageLoader } from "@/components/PageLoader";
import { SmoothScroll } from "@/components/SmoothScroll";
import { listCategories } from "@/lib/products";

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
  const categories = await listCategories().catch(() => []);

  return (
    <SmoothScroll>
      <PageLoader />
      <AuthDrawerProvider>
        <CartProvider>
          <WishlistProvider>
            <Header categories={categories} />
            <main className="min-h-screen">{children}</main>
            <Footer />
            <CartDrawer />
            <AuthDrawer />
            <NewsletterPopup />
            <AuroraMark />
          </WishlistProvider>
        </CartProvider>
      </AuthDrawerProvider>
    </SmoothScroll>
  );
}
