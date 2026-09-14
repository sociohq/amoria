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
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-serif text-3xl capitalize text-ink">{category ?? "All Fragrances"}</h1>
        <div className="flex items-center gap-6">
          <div className="flex gap-4">
            {SORTS.map((s) => (
              <Link
                key={s.value}
                href={withParam("sort", s.value)}
                className={`label-caps ${sort === s.value ? "text-emerald" : "text-ink-soft hover:text-emerald"}`}
              >
                {s.label}
              </Link>
            ))}
          </div>
          <div className="h-4 w-px bg-border" />
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
          No products found yet — check back soon, or ask an admin to add one.
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
              className={`h-8 w-8 text-center leading-8 ${n === page ? "bg-emerald text-cream" : "text-ink-soft hover:text-emerald"}`}
            >
              {n}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
