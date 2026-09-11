import Link from "next/link";
import Image from "next/image";
import { Product } from "@/lib/types";
import { formatAed, percentOff } from "@/lib/money";
import { fragranceFamilyIcon, genderTag } from "@/lib/fragrance";
import { WishlistButton } from "./WishlistButton";

export function ProductCard({ product }: { product: Product }) {
  const image = product.images[0];
  const off = percentOff(product.price, product.compareAtPrice);
  const gender = genderTag(product.categories);

  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden bg-cream-dark">
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
        {/* Product info (sale, gender, fragrance family) stays as its own
            group at top-left — separate from the wishlist control on the
            opposite corner, so an action and metadata don't compete in
            the same stack. */}
        <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {off && <span className="bg-crimson px-2 py-1 text-xs font-medium text-cream">{off}% OFF</span>}
          {gender && (
            <span className="rounded-full border border-border bg-white/90 px-3 py-1 text-xs text-ink-soft">{gender}</span>
          )}
          {product.fragranceFamily && (
            <span className="rounded-full border border-border bg-white/90 px-3 py-1 text-xs text-ink-soft">
              {fragranceFamilyIcon(product.fragranceFamily)} {product.fragranceFamily}
            </span>
          )}
        </div>

        <WishlistButton
          productId={product.id}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-white/90 text-ink-soft transition-colors hover:text-crimson"
        />
      </div>
      <div className="mt-3 space-y-1">
        <p className="font-serif text-xl text-ink">{product.name}</p>
        {product.scentAccords.length > 0 && (
          <p className="text-xs text-ink-soft">{product.scentAccords.join(" · ")}</p>
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
