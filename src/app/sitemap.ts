import type { MetadataRoute } from "next";
import { BRANDS } from "@/lib/brands";

// Production origin. Kept literal so a staging env cannot emit another host.
const SITE_URL = "https://amoriaperfume.ae";

// Regenerated at most once an hour. The value has to be a literal so Next can
// read it as segment config.
export const revalidate = 3600;

// The catalog API rejects limit > 100 ("Too big: expected number to be <=100").
const PAGE_SIZE = 100;
// Guard against a broken totalPages that would otherwise keep requesting.
const MAX_PAGES = 100;

type ChangeFrequency = NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;

// Real storefront pages only. Cart, checkout, wishlist, set-password, order
// confirmation, account, admin, and API paths are left out.
const STATIC_PAGES: { path: string; changeFrequency: ChangeFrequency; priority: number }[] = [
  { path: "/", changeFrequency: "daily", priority: 1 },
  { path: "/shop", changeFrequency: "daily", priority: 0.9 },
  { path: "/our-story", changeFrequency: "monthly", priority: 0.6 },
  { path: "/stores", changeFrequency: "monthly", priority: 0.6 },
  { path: "/faq", changeFrequency: "monthly", priority: 0.5 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
  { path: "/returns", changeFrequency: "yearly", priority: 0.4 },
  { path: "/shipping", changeFrequency: "yearly", priority: 0.4 },
  { path: "/blog", changeFrequency: "weekly", priority: 0.7 },
  { path: "/brands", changeFrequency: "weekly", priority: 0.7 },
  { path: "/sustainability", changeFrequency: "monthly", priority: 0.5 },
  { path: "/custom-perfume", changeFrequency: "monthly", priority: 0.7 },
  { path: "/contact", changeFrequency: "yearly", priority: 0.5 },
  { path: "/track", changeFrequency: "monthly", priority: 0.4 },
  { path: "/gift-cards", changeFrequency: "monthly", priority: 0.4 },
];

interface ProductPage {
  products?: { slug?: string; status?: string; updatedAt?: string }[];
  totalPages?: number;
  total?: number;
  limit?: number;
}

interface CategoryPage {
  categories?: { slug?: string }[];
}

interface PostPage {
  posts?: { slug?: string; status?: string; updatedAt?: string; publishedAt?: string | null }[];
}

// Same resolution as src/lib/api.ts: the storefront server prefers the
// internal API, then the public one, then local dev.
function apiOrigin(): string {
  const base = process.env.INTERNAL_API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
  return base.replace(/\/$/, "");
}

async function apiGet<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${apiOrigin()}${path}`, {
      headers: {
        Accept: "application/json",
        ...(process.env.INTERNAL_API_KEY ? { "X-Internal-Key": process.env.INTERNAL_API_KEY } : {}),
      },
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(20000),
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

function absolute(path: string): string {
  return `${SITE_URL}${path}`;
}

function modified(value: string | null | undefined): Date | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

function entry(path: string, changeFrequency: ChangeFrequency, priority: number, lastModified?: Date): MetadataRoute.Sitemap[number] {
  return {
    url: absolute(path),
    changeFrequency,
    priority,
    ...(lastModified ? { lastModified } : {}),
  };
}

function staticEntries(): MetadataRoute.Sitemap {
  return STATIC_PAGES.map((page) => entry(page.path, page.changeFrequency, page.priority));
}

// Brand pages are real routes backed by the in-repo catalog, not the API,
// so they stay in the sitemap even when the API is down.
function brandEntries(): MetadataRoute.Sitemap {
  return BRANDS.map((brand) => entry(`/brand/${encodeURIComponent(brand.slug)}`, "weekly", 0.5));
}

function pageCount(data: ProductPage, fallback: number): number {
  if (typeof data.totalPages === "number" && data.totalPages >= 1) return data.totalPages;
  if (typeof data.total === "number" && typeof data.limit === "number" && data.limit > 0) {
    return Math.max(1, Math.ceil(data.total / data.limit));
  }
  return fallback;
}

async function productEntries(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];
  const seen = new Set<string>();
  let totalPages = 1;

  for (let page = 1; page <= totalPages && page <= MAX_PAGES; page += 1) {
    const data = await apiGet<ProductPage>(`/api/products?limit=${PAGE_SIZE}&page=${page}`);
    if (!data?.products) break;
    if (page === 1) totalPages = pageCount(data, 1);

    for (const product of data.products) {
      if (product.status !== "ACTIVE" || !product.slug || seen.has(product.slug)) continue;
      seen.add(product.slug);
      entries.push(entry(`/product/${encodeURIComponent(product.slug)}`, "weekly", 0.8, modified(product.updatedAt)));
    }
  }

  return entries;
}

// A category is the collection page: /shop?category=<slug> (see shopHref).
async function categoryEntries(): Promise<MetadataRoute.Sitemap> {
  const data = await apiGet<CategoryPage>("/api/categories");
  if (!data?.categories) return [];

  const seen = new Set<string>();
  const entries: MetadataRoute.Sitemap = [];
  for (const category of data.categories) {
    if (!category.slug || seen.has(category.slug)) continue;
    seen.add(category.slug);
    entries.push(entry(`/shop?category=${encodeURIComponent(category.slug)}`, "weekly", 0.7));
  }
  return entries;
}

async function postEntries(): Promise<MetadataRoute.Sitemap> {
  const data = await apiGet<PostPage>("/api/posts");
  if (!data?.posts) return [];

  const seen = new Set<string>();
  const entries: MetadataRoute.Sitemap = [];
  for (const post of data.posts) {
    if (post.status !== "PUBLISHED" || !post.slug || seen.has(post.slug)) continue;
    seen.add(post.slug);
    entries.push(entry(`/blog/${encodeURIComponent(post.slug)}`, "monthly", 0.6, modified(post.updatedAt ?? post.publishedAt)));
  }
  return entries;
}

function unique(entries: MetadataRoute.Sitemap): MetadataRoute.Sitemap {
  const seen = new Set<string>();
  return entries.filter((item) => {
    if (seen.has(item.url)) return false;
    seen.add(item.url);
    return true;
  });
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Each fetch fails soft. A down API still returns the public static pages
  // (and the in-repo brand pages) instead of failing the route.
  const [products, categories, posts] = await Promise.all([
    productEntries().catch(() => []),
    categoryEntries().catch(() => []),
    postEntries().catch(() => []),
  ]);

  return unique([...staticEntries(), ...brandEntries(), ...categories, ...products, ...posts]);
}
