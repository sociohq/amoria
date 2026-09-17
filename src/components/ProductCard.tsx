import Link from "next/link";
import Image from "next/image";
import { Product } from "@/lib/types";
import { formatAed, percentOff } from "@/lib/money";
import { fragranceFamilyImage, genderTag } from "@/lib/fragrance";
import { WishlistButton } from "./WishlistButton";

export function ProductCard({ product }: { product: Product }) {
  // The dedicated listing thumbnail wins when set; falls back to the
  // first gallery image for a product that predates that field.
  const imageUrl = product.thumbnailImage ?? product.images[0]?.url;
  const imageAlt = product.thumbnailImage ? product.name : (product.images[0]?.altText ?? product.name);
  const off = percentOff(product.price, product.compareAtPrice);
  const gender = genderTag(product.categories);

  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden bg-cream-dark">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={imageAlt}
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
            <span className="flex items-center gap-1.5 rounded-full border border-border bg-white/90 py-1 pl-1 pr-3 text-xs text-ink-soft">
              <span className="relative h-4 w-4 shrink-0 overflow-hidden rounded-full">
                <Image src={fragranceFamilyImage(product.fragranceFamily)} alt="" fill sizes="16px" className="object-cover" />
              </span>
              {product.fragranceFamily}
            </span>
          )}
        </div>

        <WishlistButton
          productId={product.id}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-white/90 text-ink-soft transition-colors hover:text-crimson"
        />
      </div>
      {/* text-left guards against an ancestor's text-center — a plain <p>
          responds to inherited text-align, but the price row below is a
          flex container and doesn't, so the two would visibly disagree. */}
      <div className="mt-3 text-left">
        {(gender || product.fragranceFamily) && (
          <p className="text-[12px] uppercase tracking-[-0.20px] text-ink-soft/70">
            {[gender, product.fragranceFamily].filter(Boolean).join(" · ")}
          </p>
        )}
        <p className="mt-0.5 font-serif text-2xl text-ink">{product.name}</p>
        {product.scentAccords.length > 0 && (
          <p className="mt-1 text-xs text-ink-soft">{product.scentAccords.join(" · ")}</p>
        )}
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-lg font-semibold text-royal">{formatAed(product.price)}</span>
          {product.compareAtPrice && (
            <span className="text-xs text-ink-soft line-through">{formatAed(product.compareAtPrice)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
