import type { Metadata } from "next";
import { Cormorant, Jost } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { CartProvider } from "@/lib/cart-context";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { listCategories } from "@/lib/products";

const cormorant = Cormorant({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["400", "500", "600", "700"],
});

const jost = Jost({
  subsets: ["latin"],
  variable: "--font-jost",
});

export const metadata: Metadata = {
  title: "Amoria — Luxury Perfumes",
  description: "Fragrances for men, women, and unisex — crafted for the moments that matter.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Resilient to the backend/DB being unavailable — the header should
  // never take the whole site down over a categories fetch.
  const categories = await listCategories().catch(() => []);

  return (
    <html lang="en">
      <body className={`${cormorant.variable} ${jost.variable} font-sans antialiased`}>
        <AuthProvider>
          <CartProvider>
            <Header categories={categories} />
            <main className="min-h-screen">{children}</main>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
