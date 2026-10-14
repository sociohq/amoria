import type { Metadata } from "next";
import Link from "next/link";
import { listProducts, listCategories, getPriceRange } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";
import { ShopFilterDrawer } from "@/components/ShopFilterDrawer";
import { Pagination } from "@/components/Pagination";
import { ShopMobileBar } from "@/components/ShopMobileBar";

interface ShopPageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
    family?: string;
    sort?: string;
    page?: string;
    minPrice?: string;
    maxPrice?: string;
  }>;
}

// A–Z is the default order: products read alphabetically by the name on the card.
const DEFAULT_SORT = "name_asc";
const SORTS = [
  { value: "name_asc", label: "A–Z" },
  { value: "name_desc", label: "Z–A" },
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
] as const;

export async function generateMetadata({ searchParams }: ShopPageProps): Promise<Metadata> {
  const params = await searchParams;
  const search = params.search?.trim();
  // Search results are different for every query — keep them out of search engines.
  if (search) return { title: `Results for “${search}”`, robots: { index: false, follow: true } };
  if (params.category) {
    const categories = await listCategories().catch(() => []);
    const name = categories.find((c) => c.slug === params.category)?.name;
    if (name) {
      return {
        title: name,
        description: `Shop ${name} at Amoria Perfume: premium fragrances with fast delivery across the UAE.`,
        alternates: { canonical: `/shop?category=${params.category}` },
      };
    }
  }
  return {
    title: "Shop All Fragrances",
    description: "Shop every Amoria Perfume fragrance: extrait de parfum, inspired perfumes, bukhoor and body care, delivered across the UAE.",
    alternates: { canonical: "/shop" },
  };
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const category = params.category;
  const family = params.family;
  const search = params.search?.trim() || undefined;
  const sort = SORTS.some((s) => s.value === params.sort) ? (params.sort as (typeof SORTS)[number]["value"]) : DEFAULT_SORT;
  const page = params.page ? Number(params.page) : 1;
  const minPrice = params.minPrice ? Number(params.minPrice) : undefined;
  const maxPrice = params.maxPrice ? Number(params.maxPrice) : undefined;

  const [{ products, totalPages, total }, categories, priceBounds] = await Promise.all([
    listProducts({ category, search, fragranceFamily: family, sort, page, minPrice, maxPrice, limit: 12 }).catch(() => ({
      products: [],
      totalPages: 1,
      total: 0,
    })),
    listCategories().catch(() => []),
    getPriceRange().catch(() => ({ min: 0, max: 0 })),
  ]);

  // The real category name (e.g. "1KG Collection") reads far better than
  // guessing one from the slug — "1kg-collection" via CSS capitalize()
  // would render as "1kg-collection" verbatim, since capitalize only
  // affects space-separated words, not hyphens.
  const categoryName = category ? categories.find((c) => c.slug === category)?.name ?? category : null;
  const heading = search ? `Results for “${search}”` : family ? `${family} Fragrances` : (categoryName ?? "All Fragrances");

  function withParam(key: string, value: string) {
    const next = new URLSearchParams();
    if (category) next.set("category", category);
    if (family) next.set("family", family);
    if (search) next.set("search", search);
    if (sort !== DEFAULT_SORT) next.set("sort", sort);
    if (params.minPrice) next.set("minPrice", params.minPrice);
    if (params.maxPrice) next.set("maxPrice", params.maxPrice);
    next.set(key, value);
    return `/shop?${next.toString()}`;
  }

  return (
    <div className="px-4 pb-28 pt-8 sm:px-6 sm:py-12">
      <div className="mb-5 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl text-ink">{heading}</h1>
          <p className="mt-1 text-sm text-ink-soft">
            {total} {total === 1 ? "product" : "products"}
          </p>
        </div>
        {/* Desktop and tablet: sort links + filter button. On phones the bottom bar below replaces them. */}
        <div className="hidden items-center gap-4 sm:flex sm:gap-6">
          <div className="no-scrollbar flex gap-4 overflow-x-auto">
            {SORTS.map((s) => (
              <Link
                key={s.value}
                href={withParam("sort", s.value)}
                className={`label-caps shrink-0 whitespace-nowrap ${sort === s.value ? "text-royal" : "text-ink-soft hover:text-royal"}`}
              >
                {s.label}
              </Link>
            ))}
          </div>
          <div className="h-4 w-px shrink-0 bg-border" />
          <ShopFilterDrawer
            categories={categories}
            currentCategory={category}
            currentFamily={family}
            currentSort={sort}
            currentMinPrice={params.minPrice}
            currentMaxPrice={params.maxPrice}
            priceBounds={priceBounds}
          />
        </div>
      </div>

      <ShopMobileBar
        sorts={SORTS.map((s) => ({ value: s.value, label: s.label, href: withParam("sort", s.value) }))}
        currentSort={sort}
        filter={
          <ShopFilterDrawer
            variant="bar"
            categories={categories}
            currentCategory={category}
            currentFamily={family}
            currentSort={sort}
            currentMinPrice={params.minPrice}
            currentMaxPrice={params.maxPrice}
            priceBounds={priceBounds}
          />
        }
      />

      {products.length === 0 ? (
        <p className="py-20 text-center text-ink-soft">
          No products found yet. Check back soon, or ask an admin to add one.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-x-3 gap-y-7 sm:gap-x-6 sm:gap-y-10 md:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}

      <Pagination current={page} total={totalPages} hrefFor={(n) => withParam("page", String(n))} />
    </div>
  );
}
