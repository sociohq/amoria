import { apiFetch } from "./api";
import { Product, Category, ShopTheLookSection, Review, GenderShowcaseSection } from "./types";

export interface ListProductsParams {
  search?: string;
  category?: string;
  fragranceFamily?: string;
  designHouse?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: "price_asc" | "price_desc" | "newest" | "name_asc" | "name_desc";
  page?: number;
  limit?: number;
}

export interface ListProductsResult {
  products: Product[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export async function listProducts(params: ListProductsParams = {}): Promise<ListProductsResult> {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) query.set(key, String(value));
  }
  const qs = query.toString();
  return apiFetch<ListProductsResult>(`/api/products${qs ? `?${qs}` : ""}`);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const { product } = await apiFetch<{ product: Product }>(`/api/products/${slug}`);
    return product;
  } catch {
    return null;
  }
}

export async function listCategories(): Promise<Category[]> {
  const { categories } = await apiFetch<{ categories: Category[] }>("/api/categories");
  return categories;
}

// Bounds for the shop page's price-range slider — always the actual
// min/max across what's for sale, rather than a guessed, hardcoded range
// that drifts as the catalog changes.
export async function getPriceRange(): Promise<{ min: number; max: number }> {
  return apiFetch<{ min: number; max: number }>("/api/products/price-range");
}

// null until an admin has uploaded an image and added at least one
// hotspot — the homepage section simply doesn't render until then.
export async function getShopTheLook(): Promise<ShopTheLookSection | null> {
  const { section } = await apiFetch<{ section: ShopTheLookSection | null }>("/api/shop-the-look");
  return section;
}

// The homepage's curated testimonials — empty until an admin marks at
// least one review "featured", rather than ever showing invented ones.
export async function getFeaturedReviews(): Promise<Review[]> {
  const { reviews } = await apiFetch<{ reviews: Review[] }>("/api/reviews/featured");
  return reviews;
}

// Homepage-only "For Him / For Her" tabbed banner — null until an admin
// activates it (and at least one side has a product to show).
export async function getGenderShowcase(): Promise<GenderShowcaseSection | null> {
  const { section } = await apiFetch<{ section: GenderShowcaseSection | null }>("/api/gender-showcase");
  return section;
}

// "Recommended for you" on a product page — same fragrance family first,
// then category, then newest, filled server-side (see
// getRecommendedProducts in product.controller.ts).
export async function getRecommendedProducts(slug: string): Promise<Product[]> {
  const { products } = await apiFetch<{ products: Product[] }>(`/api/products/${slug}/recommended`);
  return products;
}

// The homepage's product rows ("Featured Products", "New Arrivals", …), as set up in
// the admin: heading, link and the products to show.
export interface HomeSectionData {
  key: string;
  eyebrow: string;
  title: string;
  viewAllHref: string;
  products: Product[];
}
export async function getHomeSections(): Promise<HomeSectionData[]> {
  const { sections } = await apiFetch<{ sections: HomeSectionData[] }>("/api/home-sections");
  return sections;
}

// The homepage "Featured Products" row: the ten New Arrival perfumes mixed in
// with the Premium Fragrance and Inspired Perfumes ranges (one of each in turn),
// instead of simply the newest products in the shop — which, as the catalogue
// grows, are often accessories. Only products that have a photo are used.
export async function listFeaturedMix(): Promise<Product[]> {
  const pick = (category: string, limit: number) =>
    listProducts({ category, limit: limit + 6, sort: "newest" })
      .then(({ products }) => products.filter((p) => p.images.length > 0).slice(0, limit))
      .catch(() => [] as Product[]);

  const [newArrivals, premium, inspired] = await Promise.all([
    pick("new-arrival", 10),
    pick("premium-collection", 4),
    pick("inspired-fragrance", 6),
  ]);

  const mixed: Product[] = [];
  const seen = new Set<string>();
  const longest = Math.max(newArrivals.length, premium.length, inspired.length);
  for (let i = 0; i < longest; i++) {
    for (const list of [newArrivals, premium, inspired]) {
      const product = list[i];
      if (product && !seen.has(product.id)) {
        seen.add(product.id);
        mixed.push(product);
      }
    }
  }
  return mixed;
}
