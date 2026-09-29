import Link from "next/link";
import Image from "next/image";
import { Product } from "@/lib/types";
import { formatAed, percentOff } from "@/lib/money";
import { cardDisplayName, fragranceFamilyImage, genderTag, genderTextClass } from "@/lib/fragrance";
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
      <div className="relative aspect-[3/4] overflow-hidden bg-cream-dark">
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
        <WishlistButton
          productId={product.id}
          className="absolute left-3 top-3 hidden h-8 w-8 items-center justify-center rounded-full border border-border bg-white/90 text-ink-soft transition-colors hover:text-crimson sm:flex"
        />

        {/* Only the fragrance-family tag lives on the image — gender shows
            as text below instead, and the discount now reads as "X% Off"
            next to the price rather than a badge here. */}
        {product.fragranceFamily && (
          <span className="absolute right-3 top-3 hidden items-center gap-1.5 rounded-full border border-border bg-white/90 py-1 pl-1 pr-3 text-xs text-ink-soft sm:flex">
            <span className="relative h-4 w-4 shrink-0 overflow-hidden rounded-full">
              <Image src={fragranceFamilyImage(product.fragranceFamily)} alt="" fill sizes="16px" className="object-cover" />
            </span>
            {product.fragranceFamily}
          </span>
        )}
      </div>
      {/* text-left guards against an ancestor's text-center — a plain <p>
          responds to inherited text-align, but the price row below is a
          flex container and doesn't, so the two would visibly disagree. */}
      <div className="mt-2 text-left">
        <p className="truncate font-serif text-base font-medium leading-tight tracking-normal text-ink sm:text-xl" title={product.name}>
          {cardDisplayName(product.name)}
        </p>
        {gender && <p className={`mt-0.5 text-[12px] leading-tight tracking-[-0.11px] ${genderTextClass(gender)}`}>{gender}</p>}
        {product.scentAccords.length > 0 && (
          <p className="mt-1 text-xs text-ink-soft">{product.scentAccords.join(" · ")}</p>
        )}
        <div className="mt-1.5 flex items-baseline gap-2 sm:mt-3">
          <span className="text-[12px] font-medium tracking-[-0.11px] text-gold sm:text-lg sm:font-semibold sm:tracking-normal">
            {formatAed(product.price)}
          </span>
          {product.compareAtPrice && (
            <span className="text-[11px] text-ink-soft line-through">{formatAed(product.compareAtPrice)}</span>
          )}
          {off && <span className="text-[11px] font-medium text-green-600">{off}% Off</span>}
        </div>
      </div>
    </Link>
  );
}
