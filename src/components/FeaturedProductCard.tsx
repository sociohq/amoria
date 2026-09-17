"use client";

import { useId, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/lib/types";
import { formatAed, percentOff } from "@/lib/money";
import { fragranceFamilyImage, genderTag } from "@/lib/fragrance";
import { useCart } from "@/lib/cart-context";
import { WishlistButton } from "./WishlistButton";

export function FeaturedProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  // The same product can render in more than one FeaturedProductCard at
  // once (e.g. GenderShowcase keeps both the "him" and "her" rows mounted
  // for the crossfade, and the same product can also appear in Featured
  // Products/Shop The Look on the same page) — a radio group's `name`
  // groups natively by the browser across the WHOLE page, not per React
  // instance, so keying it on product.id alone let separate cards'
  // radios fight over the same native group. useId() scopes it to this
  // specific card instance instead.
  const instanceId = useId();
  const [variantId, setVariantId] = useState(product.variants[0]?.id);
  const [adding, setAdding] = useState(false);
  const variant = product.variants.find((v) => v.id === variantId) ?? product.variants[0];
  // The dedicated listing thumbnail wins when set; falls back to the
  // first gallery image for a product that predates that field.
  const imageUrl = product.thumbnailImage ?? product.images[0]?.url;
  const imageAlt = product.thumbnailImage ? product.name : (product.images[0]?.altText ?? product.name);
  const off = percentOff(variant?.price ?? product.price, product.compareAtPrice);
  const gender = genderTag(product.categories);

  async function handleAddToCart() {
    if (!variant) return;
    setAdding(true);
    try {
      await addItem({
        variantId: variant.id,
        productId: product.id,
        productName: product.name,
        productSlug: product.slug,
        variantSize: variant.size,
        price: variant.price,
        image: imageUrl ?? null,
      });
    } finally {
      setAdding(false);
    }
  }

  return (
    <div className="group w-full shrink-0">
      <div className="relative aspect-[4/5] overflow-hidden bg-cream-dark">
        <Link href={`/product/${product.slug}`} className="absolute inset-0">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={imageAlt}
              fill
              sizes="(min-width: 768px) 25vw, 50vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="font-serif text-sm tracking-widest text-ink-soft">AMORIA</span>
            </div>
          )}
        </Link>

        {/* Gender + fragrance-family tags stay their own group at
            top-left — separate from the wishlist control on the opposite
            corner, so an action and metadata don't compete in the same
            stack. Always visible, above the hover overlay. */}
        <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
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

        {/* Hover quick-shop overlay: size selector + Add to Cart, revealed
            over a faded-white panel at the bottom of the image. */}
        {product.variants.length > 0 && (
          <div className="absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-white from-55% to-transparent px-4 pb-4 pt-10 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            {product.variants.length > 1 && (
              <div className="mb-3 space-y-1.5">
                {product.variants.map((v) => (
                  <label
                    key={v.id}
                    className={`flex items-center gap-2 text-xs ${v.stock === 0 ? "cursor-not-allowed opacity-40" : "cursor-pointer"}`}
                  >
                    <input
                      type="radio"
                      name={`variant-${instanceId}`}
                      checked={v.id === variantId}
                      onChange={() => setVariantId(v.id)}
                      disabled={v.stock === 0}
                      style={{ accentColor: "var(--color-ink)" }}
                    />
                    <span className="text-ink">{v.size}</span>
                  </label>
                ))}
              </div>
            )}
            <button
              onClick={handleAddToCart}
              disabled={!variant || variant.stock === 0 || adding}
              className="w-full border border-ink bg-white/80 py-2.5 label-caps text-ink transition-colors hover:bg-ink hover:text-cream disabled:opacity-50"
            >
              {variant?.stock === 0 ? "Out of Stock" : adding ? "Adding…" : "Add to Cart"}
            </button>
          </div>
        )}
      </div>

      {/* text-left overrides an ancestor's text-center (e.g. GenderShowcase's
          section wrapper, needed for its own heading/tab toggle) — without
          it, the name (a plain <p>, which text-align does affect) centers
          while the price row (a flex container, which text-align does not
          affect — flex items follow justify-content instead) stays left,
          so the two visibly disagree. */}
      <div className="mt-3 text-left">
        {(gender || product.fragranceFamily) && (
          <p className="text-[12px] uppercase tracking-[-0.20px] text-ink-soft/70">
            {[gender, product.fragranceFamily].filter(Boolean).join(" · ")}
          </p>
        )}
        <Link href={`/product/${product.slug}`}>
          <p className="mt-0.5 font-serif text-lg text-ink hover:text-royal sm:text-2xl">{product.name}</p>
        </Link>
        {product.scentAccords.length > 0 && (
          <p className="mt-1 text-xs text-ink-soft">{product.scentAccords.join(" · ")}</p>
        )}
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-base font-semibold text-royal sm:text-lg">{formatAed(variant?.price ?? product.price)}</span>
          {product.compareAtPrice && (
            <span className="text-xs text-ink-soft line-through">{formatAed(product.compareAtPrice)}</span>
          )}
          {off && <span className="text-xs text-royal">{off}% Off</span>}
        </div>
      </div>
    </div>
  );
}
