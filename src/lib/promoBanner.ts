import { apiFetch } from "./api";

// A wide promo banner on the homepage, edited in admin (Statement Banner, Create Your Own Perfume Banner).
export interface PromoBannerData {
  heading: string;
  text: string | null;
  ctaText: string | null;
  ctaLink: string | null;
  textTone: "dark" | "light";
  image: string | null; // null = the picture built into the site
  mobileImage: string | null;
}

export type PromoBannerKey = "statement" | "customize";

// Shown if the admin's version can't be fetched, so a banner never just disappears because of a hiccup.
export const DEFAULT_PROMO_BANNERS: Record<PromoBannerKey, PromoBannerData> = {
  statement: {
    heading: "Discover Our Statement Perfume Oils.",
    text: "More fragrance. More presence. Discover our perfume oils, crafted for those who want to make a statement.",
    ctaText: "View Details",
    ctaLink: "/shop?category=perfume-oils",
    textTone: "dark",
    image: null,
    mobileImage: null,
  },
  customize: {
    heading: "Create Your Own Perfume",
    text: "Blend your own signature scent from our finest notes — crafted around you, bottled just for you.",
    ctaText: "Customize Your Perfume",
    ctaLink: "/custom-perfume",
    textTone: "dark",
    image: null,
    mobileImage: null,
  },
};

// null = switched off in the admin; if it can't be fetched the original banner is shown.
export async function getPromoBanner(key: PromoBannerKey): Promise<PromoBannerData | null> {
  try {
    const { banner } = await apiFetch<{ banner: PromoBannerData | null }>(`/api/promo-banners/${key}`);
    return banner;
  } catch {
    return DEFAULT_PROMO_BANNERS[key];
  }
}
