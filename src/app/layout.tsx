import type { Metadata } from "next";
import { Cormorant, Jost } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
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

const cormorant = Cormorant({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["400", "500", "600", "700"],
  // Italic loaded for editorial pages (e.g. Our Story) that lean on it for
  // emphasis — without this an `italic` class would fall back to a
  // browser-synthesized slant instead of Cormorant's own italic glyphs.
  style: ["normal", "italic"],
});

const jost = Jost({
  subsets: ["latin"],
  variable: "--font-jost",
});

export const metadata: Metadata = {
  title: "Amoria | Luxury Perfumes",
  description: "Fragrances for men, women, and unisex, crafted for the moments that matter.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Resilient to the backend/DB being unavailable — the header should
  // never take the whole site down over a categories fetch.
  const categories = await listCategories().catch(() => []);

  return (
    <html lang="en">
      <body className={`${cormorant.variable} ${jost.variable} font-sans antialiased`}>
        <SmoothScroll>
          <PageLoader />
          <AuthProvider>
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
          </AuthProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
