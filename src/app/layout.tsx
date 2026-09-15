import type { Metadata } from "next";
import { Cormorant, Jost } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";

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

// The true root: fonts, metadata, and AuthProvider only (the admin route
// guard needs auth state too, so that stays shared) — every other
// provider and every piece of storefront chrome (header, footer, cart/
// auth drawers, newsletter popup, smooth-scroll) now lives in
// (storefront)/layout.tsx instead, since /admin is a sibling segment
// that needs none of it and a completely different shell of its own.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${cormorant.variable} ${jost.variable} font-sans antialiased`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
