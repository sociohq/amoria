import type { Metadata, Viewport } from "next";
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

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://amoriaperfume.ae";
const SITE_DESCRIPTION =
  "Amoria Perfume: signature extrait de parfum, inspired fragrances, bukhoor and body care. Premium scents with fast delivery across the UAE.";

// Every page's own title slots into the template ("Our Story | Amoria Perfume");
// the home page uses the default. The share image comes from opengraph-image.png
// next to this file, and the tab icons from icon.png / favicon.ico.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Amoria Perfume | Luxury Perfumes in the UAE", template: "%s | Amoria Perfume" },
  description: SITE_DESCRIPTION,
  applicationName: "Amoria Perfume",
  // No title/description here on purpose: each page's own title and description
  // flow into its share preview.
  openGraph: { type: "website", siteName: "Amoria Perfume", locale: "en_AE" },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = { themeColor: "#eeeae1" };

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
