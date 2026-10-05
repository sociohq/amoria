import { Category } from "./types";

// The shop navigation, in the order the business asked for it. Each node
// points at a category by slug; a parent that has children is also a real
// category (every product in a child is tagged with its parent as well), so
// clicking the parent lists everything beneath it. Nodes whose category
// doesn't exist yet are dropped rather than rendered as dead links.
export interface NavNode {
  label: string;
  slug: string;
  children?: NavNode[];
}

export const SHOP_NAV: NavNode[] = [
  { label: "Inspired Perfumes", slug: "inspired-fragrance" },
  { label: "Premium Fragrance", slug: "premium-collection" },
  { label: "Perfume", slug: "international-perfume" },
  {
    label: "Home Fragrance",
    slug: "home-fragrance",
    children: [
      { label: "Air Freshener", slug: "air-freshener" },
      { label: "Bukhoor", slug: "bukhoor" },
      { label: "Bukhoor Accessories", slug: "bukhoor-accessories" },
    ],
  },
  { label: "Miniature Perfume", slug: "miniature-perfumes" },
  { label: "Gift Set", slug: "gift-sets" },
  {
    label: "Body Care Fragrances",
    slug: "body-care-fragrances",
    children: [{ label: "Makhmariya", slug: "makhmariya" }],
  },
  { label: "Other Accessories", slug: "accessories" },
  { label: "Perfume Oils", slug: "perfume-oils" },
  {
    label: "Arabic Fragrance",
    slug: "arabic-fragrance",
    children: [
      { label: "Bukhoor", slug: "bukhoor" },
      { label: "Perfume Oils", slug: "perfume-oils" },
      { label: "Makhmariya", slug: "makhmariya" },
    ],
  },
];

export function shopHref(slug: string): string {
  return `/shop?category=${slug}`;
}

// Keeps only the nodes whose category exists in the fetched list, so a
// category that was removed or renamed in the admin never leaves a dead
// link in the menu.
export function availableShopNav(categories: Category[]): NavNode[] {
  const slugs = new Set(categories.map((c) => c.slug));
  const keep = (n: NavNode): NavNode | null => {
    if (!slugs.has(n.slug)) return null;
    const children = n.children?.map(keep).filter((c): c is NavNode => c !== null);
    return { ...n, children: children && children.length > 0 ? children : undefined };
  };
  return SHOP_NAV.map(keep).filter((n): n is NavNode => n !== null);
}
