import { notFound } from "next/navigation";
import Image from "next/image";
import { getBrandBySlug } from "@/lib/brands";
import { listProducts } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";

interface BrandPageProps {
  params: Promise<{ slug: string }>;
}

export default async function BrandPage({ params }: BrandPageProps) {
  const { slug } = await params;
  const brand = getBrandBySlug(slug);
  if (!brand) notFound();

  // designHouse is null for a brand whose logo we have but that has no
  // matching products yet — skip the fetch rather than querying with an
  // empty filter (which would return the whole catalog).
  const { products } = brand.designHouse
    ? await listProducts({ designHouse: brand.designHouse, limit: 100 }).catch(() => ({ products: [] }))
    : { products: [] };

  return (
    <div className="px-6 py-16 sm:px-12">
      <div className="mx-auto max-w-5xl text-center">
        <p className="label-caps text-gold">Shop By Brand</p>
        <div className="relative mx-auto mt-6 h-20 w-full max-w-xs">
          <Image src={brand.logo} alt={brand.name} fill sizes="320px" className="object-contain" />
        </div>
        <h1 className="mt-6 font-serif text-3xl text-ink sm:text-4xl">Inspired By {brand.name}</h1>
      </div>

      {products.length === 0 ? (
        <p className="py-20 text-center text-ink-soft">
          No {brand.name} fragrances yet — check back soon, or ask an admin to add one.
        </p>
      ) : (
        <div className="mx-auto mt-12 grid max-w-6xl grid-cols-2 gap-x-4 gap-y-6 sm:gap-x-6 sm:gap-y-10 md:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
