import { apiFetch } from "./api";

// The wide promo banner on the homepage, edited in admin → Statement Banner.
export interface StatementBannerData {
  heading: string;
  text: string | null;
  ctaText: string | null;
  ctaLink: string | null;
  textTone: "dark" | "light";
  image: string | null; // null = the picture built into the site
  mobileImage: string | null;
}

// Shown if the admin's version can't be fetched, so the banner never just disappears because of a hiccup.
export const DEFAULT_STATEMENT_BANNER: StatementBannerData = {
  heading: "Discover Our Statement Perfume Oils.",
  text: "More fragrance. More presence. Discover our perfume oils, crafted for those who want to make a statement.",
  ctaText: "View Details",
  ctaLink: "/shop?category=perfume-oils",
  textTone: "dark",
  image: null,
  mobileImage: null,
};

// null = switched off in the admin.
export async function getStatementBanner(): Promise<StatementBannerData | null> {
  const { banner } = await apiFetch<{ banner: StatementBannerData | null }>("/api/statement-banner");
  return banner;
}
