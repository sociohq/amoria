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
      <div className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4">
        {products.map((p, i) => (
          <Reveal
            key={p.id}
            delayMs={(i % 4) * 100}
            className="w-[calc(50%-12px)] shrink-0 snap-start sm:w-[calc(33.333%-16px)] md:w-[calc(25%-18px)]"
          >
            <FeaturedProductCard product={p} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
