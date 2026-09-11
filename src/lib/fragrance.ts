// A small cosmetic touch for the product card's fragrance-family pill — an
// icon guessed from the family name (an admin-entered string, e.g. "Fresh
// Fruity") so admins don't have to also pick an icon by hand. Checked in
// order, first match wins.
const FAMILY_ICONS: Array<[string, string]> = [
  ["citrus", "🍋"],
  ["fruity", "🍑"],
  ["floral", "🌸"],
  ["oriental", "✨"],
  ["woody", "🌳"],
  ["musk", "🌙"],
  ["spicy", "🌶️"],
  ["gourmand", "🍯"],
  ["sweet", "🍯"],
  ["aquatic", "💧"],
  ["fresh", "💧"],
];

export function fragranceFamilyIcon(family: string): string {
  const lower = family.toLowerCase();
  return FAMILY_ICONS.find(([keyword]) => lower.includes(keyword))?.[1] ?? "🌿";
}

// The category the header's mega menu groups as "Shop By Gender" doubles as
// the product's gender tag — trimming the "For " prefix ("For Unisex" ->
// "Unisex") reads better as a short badge than the full category name.
export function genderTag(categories: { name: string; menuGroup: string | null }[]): string | null {
  const category = categories.find((c) => c.menuGroup === "Shop By Gender");
  return category ? category.name.replace(/^For /, "") : null;
}
