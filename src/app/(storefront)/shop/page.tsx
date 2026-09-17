import Link from "next/link";
import { listProducts, listCategories, getPriceRange } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";
import { ShopFilterDrawer } from "@/components/ShopFilterDrawer";

interface ShopPageProps {
  searchParams: Promise<{ category?: string; sort?: string; page?: string; minPrice?: string; maxPrice?: string }>;
}

const SORTS = [
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
] as const;

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const category = params.category;
  const sort = (params.sort as (typeof SORTS)[number]["value"]) ?? "newest";
  const page = params.page ? Number(params.page) : 1;
  const minPrice = params.minPrice ? Number(params.minPrice) : undefined;
  const maxPrice = params.maxPrice ? Number(params.maxPrice) : undefined;

  const [{ products, totalPages }, categories, priceBounds] = await Promise.all([
    listProducts({ category, sort, page, minPrice, maxPrice, limit: 12 }).catch(() => ({
      products: [],
      totalPages: 1,
    })),
    listCategories().catch(() => []),
    getPriceRange().catch(() => ({ min: 0, max: 0 })),
  ]);

  // The real category name (e.g. "1KG Collection") reads far better than
  // guessing one from the slug — "1kg-collection" via CSS capitalize()
  // would render as "1kg-collection" verbatim, since capitalize only
  // affects space-separated words, not hyphens.
  const categoryName = category ? categories.find((c) => c.slug === category)?.name ?? category : null;

  function withParam(key: string, value: string) {
    const next = new URLSearchParams();
    if (category) next.set("category", category);
    if (sort !== "newest") next.set("sort", sort);
    if (params.minPrice) next.set("minPrice", params.minPrice);
    if (params.maxPrice) next.set("maxPrice", params.maxPrice);
    next.set(key, value);
    return `/shop?${next.toString()}`;
  }

  return (
    <div className="px-6 py-12">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-serif text-3xl text-ink">{categoryName ?? "All Fragrances"}</h1>
        <div className="flex items-center gap-4 sm:gap-6">
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
            currentSort={sort}
            currentMinPrice={params.minPrice}
            currentMaxPrice={params.maxPrice}
            priceBounds={priceBounds}
          />
        </div>
      </div>

      {products.length === 0 ? (
        <p className="py-20 text-center text-ink-soft">
          No products found yet. Check back soon, or ask an admin to add one.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-12 flex justify-center gap-4">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <Link
              key={n}
              href={withParam("page", String(n))}
              className={`h-8 w-8 text-center leading-8 ${n === page ? "bg-royal text-cream" : "text-ink-soft hover:text-royal"}`}
            >
              {n}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
