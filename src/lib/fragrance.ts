// The product card's fragrance-family pill used to show an emoji guessed
// from the family name (an admin-entered string, e.g. "Tropical Fruity")
// — replaced with the same real ingredient photography used on the
// homepage's "Shop By Scent Family" scroller and the Custom Perfume
// wizard, for the same reason the gender-step emoji were replaced:
// consistent, on-brand imagery instead of emoji. Products are tagged with
// one of that same exact taxonomy now, so this matches by exact name
// first, falling back to a keyword guess only for anything off-list.
import { FRAGRANCE_FAMILIES } from "./fragranceFamilies";

const FALLBACK_IMAGE = FRAGRANCE_FAMILIES.find((f) => f.name === "Aromatic")!.image;

const FAMILY_IMAGE_KEYWORDS: Array<[string, string]> = [
  ["citrus", "Citrus Aromatic"],
  ["aquatic", "Aromatic Aquatic"],
  ["fresh", "Fresh"],
  ["green", "Aromatic Green"],
  ["aromatic", "Aromatic"],
  ["fruity", "Fruity"],
  ["floral", "Floral"],
  ["woody", "Woody"],
  ["gourmand", "Floral Fruity Gourmand"],
  ["vanilla", "Vanilla"],
  ["sweet", "Vanilla"],
  ["musk", "Woody Floral Musk"],
  ["oriental", "Oriental"],
  ["spicy", "Warm Spicy"],
  ["amber", "Oriental Woody"],
  ["leather", "Leather"],
  ["powder", "Powdery"],
  ["chypre", "Chypre"],
].map(([keyword, name]) => [keyword, FRAGRANCE_FAMILIES.find((f) => f.name === name)?.image ?? FALLBACK_IMAGE]);

export function fragranceFamilyImage(family: string): string {
  const exact = FRAGRANCE_FAMILIES.find((f) => f.name.toLowerCase() === family.toLowerCase());
  if (exact) return exact.image;

  const lower = family.toLowerCase();
  return FAMILY_IMAGE_KEYWORDS.find(([keyword]) => lower.includes(keyword))?.[1] ?? FALLBACK_IMAGE;
}

// The catalog's real product names carry a lot of info the card already
// shows elsewhere (gender via its own badge, size via the variant picker,
// concentration nobody reads on a grid) — "Amoria Perfume Aurora Extrait De
// Parfum For Men and Women 100ML" and "Inspired By: Tom Ford Fucking
// Fabulous" both run long enough to wrap onto 2-3 lines at a size big
// enough to read. This trims the redundant parts for the CARD specifically
// (the full name still shows on the product page, cart, etc.) so most
// names fit on one line at a normal size; truncate + ellipsis on the card
// itself is the safety net for the genuinely long outliers this can't fix.
export function cardDisplayName(name: string): string {
  return name
    .replace(/^Inspired By:\s*/i, "")
    .replace(/^Amoria Perfume\s+/i, "")
    .replace(/\s+Extrait De Parfum\b.*$/i, "")
    .replace(/\s+\d+\s?ML$/i, "")
    .trim();
}

// The category the header's mega menu groups as "Shop By Gender" doubles as
// the product's gender tag, shown as-is ("For Him", "For Unisex") in the
// card's category line beneath the product name.
// The small gold line above a card's name: "Women's Perfume", "Men's Perfume"…
// for perfumes (from the gender category), otherwise the product's first
// category. Null when it has neither.
export function cardLabel(product: {
  productType?: string;
  categories: { name: string; menuGroup: string | null }[];
}): string | null {
  const gender = genderTag(product.categories);
  if (gender && (product.productType ?? "PERFUME") === "PERFUME") {
    const g = gender.toLowerCase();
    if (g.includes("him")) return "Men's Perfume";
    if (g.includes("her")) return "Women's Perfume";
    return "Unisex Perfume";
  }
  return product.categories[0]?.name ?? null;
}

export function genderTag(categories: { name: string; menuGroup: string | null }[]): string | null {
  const category = categories.find((c) => c.menuGroup === "Shop By Gender");
  return category?.name ?? null;
}

// Royal/crimson accents for Him/Her mirror the Custom Perfume wizard's
// gender step. Unisex stays neutral (ink-soft) rather than gold — gold is
// also the price's color, and a unisex product would otherwise show its
// category and price in the same color with nothing to tell them apart.
export function genderTextClass(gender: string | null): string {
  if (!gender) return "text-ink-soft";
  const lower = gender.toLowerCase();
  if (lower.includes("him")) return "text-royal";
  if (lower.includes("her")) return "text-crimson";
  return "text-ink-soft";
}
