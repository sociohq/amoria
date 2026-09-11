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

// Same idea for the scent-accords line on product cards — a single flat
// color across every card (as it was before) makes a grid of different
// perfumes hard to tell apart at a glance. Colors stay inside the site's
// warm, muted palette rather than going bright/saturated.
const FAMILY_COLORS: Array<[string, string]> = [
  ["citrus", "#b08d57"],
  ["fruity", "#c1653f"],
  ["floral", "#a85a72"],
  ["oriental", "#8c4a2f"],
  ["woody", "#6b4a34"],
  ["musk", "#6b4a6b"],
  ["spicy", "#b5651d"],
  ["gourmand", "#a97142"],
  ["sweet", "#a97142"],
  ["aquatic", "#3f7a7a"],
  ["fresh", "#3f7a7a"],
];

export function fragranceFamilyColor(family: string): string {
  const lower = family.toLowerCase();
  return FAMILY_COLORS.find(([keyword]) => lower.includes(keyword))?.[1] ?? "var(--color-ink-soft)";
}

// The category the header's mega menu groups as "Shop By Gender" doubles as
// the product's gender tag — trimming the "For " prefix ("For Unisex" ->
// "Unisex") reads better as a short badge than the full category name.
export function genderTag(categories: { name: string; menuGroup: string | null }[]): string | null {
  const category = categories.find((c) => c.menuGroup === "Shop By Gender");
  return category ? category.name.replace(/^For /, "") : null;
}
