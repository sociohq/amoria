import Link from "next/link";
import { Product } from "@/lib/types";
import { FeaturedProductCard } from "./FeaturedProductCard";
import { Reveal } from "./Reveal";

export function ProductSection({
  eyebrow,
  title,
  products,
}: {
  eyebrow: string;
  title: string;
  products: Product[];
}) {
  if (products.length === 0) return null;

  return (
    <section className="px-6 py-16">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="label-caps text-gold">{eyebrow}</p>
          <h2 className="mt-1 font-serif text-3xl text-ink">{title}</h2>
        </div>
        <Link href="/shop" className="text-sm text-ink underline underline-offset-4 hover:text-emerald">
          View all
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
        {products.map((p, i) => (
          <Reveal key={p.id} delayMs={(i % 4) * 100}>
            <FeaturedProductCard product={p} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
