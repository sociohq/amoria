// The product card's fragrance-family pill used to show an emoji guessed
// from the family name (an admin-entered string, e.g. "Tropical Fruity")
// — replaced with the same real ingredient photography used on the
// Custom Perfume page's family step, for the same reason the gender-step
// emoji were replaced: consistent, on-brand imagery instead of emoji.
// Products still use free-text family names rather than the custom
// perfume's fixed 8-option list, so this keeps the same keyword-guess
// approach, just pointing at a photo instead of an emoji.
import { FRAGRANCE_FAMILY_IMAGES } from "./customPerfume";

const FAMILY_IMAGE_KEYWORDS: Array<[string, string]> = [
  ["citrus", FRAGRANCE_FAMILY_IMAGES["Fresh & Citrusy"]],
  ["aquatic", FRAGRANCE_FAMILY_IMAGES["Fresh & Citrusy"]],
  ["fresh", FRAGRANCE_FAMILY_IMAGES["Fresh & Citrusy"]],
  ["green", FRAGRANCE_FAMILY_IMAGES["Green & Aromatic"]],
  ["aromatic", FRAGRANCE_FAMILY_IMAGES["Green & Aromatic"]],
  ["fruity", FRAGRANCE_FAMILY_IMAGES["Fruity & Delicious"]],
  ["floral", FRAGRANCE_FAMILY_IMAGES["Floral & Delicate"]],
  ["woody", FRAGRANCE_FAMILY_IMAGES["Woody & Profound"]],
  ["gourmand", FRAGRANCE_FAMILY_IMAGES["Sweet & Gourmand"]],
  ["sweet", FRAGRANCE_FAMILY_IMAGES["Sweet & Gourmand"]],
  ["musk", FRAGRANCE_FAMILY_IMAGES["Sweet & Gourmand"]],
  ["oriental", FRAGRANCE_FAMILY_IMAGES["Spicy & Ambery"]],
  ["spicy", FRAGRANCE_FAMILY_IMAGES["Spicy & Ambery"]],
  ["amber", FRAGRANCE_FAMILY_IMAGES["Spicy & Ambery"]],
  ["leather", FRAGRANCE_FAMILY_IMAGES["Leathery & Distinctive"]],
];

export function fragranceFamilyImage(family: string): string {
  const lower = family.toLowerCase();
  return FAMILY_IMAGE_KEYWORDS.find(([keyword]) => lower.includes(keyword))?.[1] ?? FRAGRANCE_FAMILY_IMAGES["Green & Aromatic"];
}

// The category the header's mega menu groups as "Shop By Gender" doubles as
// the product's gender tag — trimming the "For " prefix ("For Unisex" ->
// "Unisex") reads better as a short badge than the full category name.
export function genderTag(categories: { name: string; menuGroup: string | null }[]): string | null {
  const category = categories.find((c) => c.menuGroup === "Shop By Gender");
  return category ? category.name.replace(/^For /, "") : null;
}
