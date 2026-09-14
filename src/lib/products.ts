import { apiFetch } from "./api";
import { Product, Category, ShopTheLookSection } from "./types";

export interface ListProductsParams {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: "price_asc" | "price_desc" | "newest";
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
