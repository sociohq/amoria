import Link from "next/link";
import Image from "next/image";
import { Product } from "@/lib/types";
import { formatAed, percentOff } from "@/lib/money";

export function ProductCard({ product }: { product: Product }) {
  const image = product.images[0];
  const off = percentOff(product.price, product.compareAtPrice);

  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <div className="relative aspect-square overflow-hidden bg-cream-dark">
        {image ? (
          <Image
            src={image.url}
            alt={image.altText ?? product.name}
            fill
            sizes="(min-width: 768px) 25vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-ink-soft">
            <span className="font-serif text-sm tracking-widest">AMORIA</span>
          </div>
        )}
        {off && (
          <span className="absolute left-3 top-3 bg-crimson px-2 py-1 text-xs font-medium text-cream">
            {off}% OFF
          </span>
        )}
      </div>
      <div className="mt-3 space-y-1">
        <p className="text-sm text-ink">{product.name}</p>
        {product.scentAccords.length > 0 && (
          <p className="text-xs text-crimson">{product.scentAccords.join(" · ")}</p>
        )}
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-medium text-ink">{formatAed(product.price)}</span>
          {product.compareAtPrice && (
            <span className="text-xs text-ink-soft line-through">{formatAed(product.compareAtPrice)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
