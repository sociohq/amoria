"use client";

import { useState } from "react";
import Link from "next/link";
import { Product } from "@/lib/types";
import { formatAed, percentOff } from "@/lib/money";
import { cardDisplayName, cardLabel } from "@/lib/fragrance";
import { imageForSize } from "@/lib/productImages";
import { useCart } from "@/lib/cart-context";
import { WishlistButton } from "./WishlistButton";
import { ProductCardImage } from "./ProductCardImage";
import { BagIcon, QuickShopSheet, SizeTiles } from "./QuickShop";

const BADGE_LABELS = { BESTSELLER: "Bestseller", NEW: "New", LIMITED: "Limited" } as const;

// The product card used everywhere products are listed (shop, homepage
// sections, brand pages, blog embeds). The photo carries an optional label and
// the wishlist heart; below it sit the category, name, scent notes and price.
// Buying straight from the card: on a mouse device a size panel slides up over
// the photo on hover; on touch (phone, tablet) a bag button opens a bottom
// sheet. Either way picking a size also swaps to that size's own photo.
export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [variantId, setVariantId] = useState(product.variants[0]?.id);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [adding, setAdding] = useState(false);

  const variant = product.variants.find((v) => v.id === variantId) ?? product.variants[0];
  // A single size has nothing to choose — the card then offers just Add to cart.
  const hasSizes = product.variants.length > 1;
  const price = variant?.price ?? product.price;
  const off = percentOff(price, product.compareAtPrice);
  const label = cardLabel(product);
  const imageUrl = imageForSize(product, variant?.size) ?? product.thumbnailImage ?? product.images[0]?.url ?? null;
  const imageAlt = product.name;
  const badge = product.badge ? BADGE_LABELS[product.badge] : null;
  const href = `/product/${product.slug}`;

  async function add(quantity: number) {
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
        image: imageUrl,
        quantity,
      });
      setSheetOpen(false);
    } finally {
      setAdding(false);
    }
  }

  return (
    <div className="group @container w-full shrink-0 text-left">
      <div className="relative aspect-[4/5] overflow-hidden rounded-md bg-[#f3f0f1]">
        <Link href={href} className="absolute inset-0" aria-label={product.name}>
          {imageUrl ? (
            <ProductCardImage src={imageUrl} alt={imageAlt} sizes="(min-width: 1024px) 25vw, 50vw" />
          ) : (
            <div className="flex h-full items-center justify-center text-ink-soft">
              <span className="font-serif text-sm tracking-widest">AMORIA</span>
            </div>
          )}
        </Link>

        {badge && (
          <span className="pointer-events-none absolute left-2 top-2 z-10 bg-[#111] px-2 py-1 text-[9px] font-medium uppercase leading-none tracking-[0.2em] text-white @min-[200px]:left-3.5 @min-[200px]:top-3.5 @min-[200px]:px-3 @min-[200px]:py-2 @min-[200px]:text-[11px]">
            {badge}
          </span>
        )}

        <WishlistButton
          productId={product.id}
          className="absolute right-2 top-2 z-10 flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#fcfcfc] text-ink shadow-sm transition-colors hover:text-crimson @min-[200px]:right-3.5 @min-[200px]:top-3.5 @min-[200px]:h-[38px] @min-[200px]:w-[38px]"
        />

        {product.variants.length > 0 && (
          <>
            {/* Touch devices (and anything narrower than a desktop): bag button → sheet. */}
            <button
              type="button"
              onClick={() => setSheetOpen(true)}
              aria-label={`Add ${product.name} to cart`}
              className="absolute bottom-2 right-2 z-10 flex h-[34px] w-[34px] items-center justify-center rounded-full bg-[#111] text-white shadow-lg lg:hidden [@media(hover:none)]:flex @min-[200px]:h-10 @min-[200px]:w-10"
            >
              <BagIcon className="h-4 w-4" />
            </button>

            {/* Mouse devices: size panel over the bottom of the photo on hover. */}
            <div className="pointer-events-none absolute inset-x-3 bottom-3 z-10 hidden translate-y-2 rounded-md bg-[#f9f8f8]/95 p-3.5 opacity-0 shadow-[0_8px_30px_rgba(0,0,0,0.12)] backdrop-blur-sm transition-all duration-300 group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 lg:block [@media(hover:none)]:hidden">
              {hasSizes && (
                <>
                  <p className="mb-2.5 text-[11px] font-medium uppercase tracking-[0.18em] text-ink-soft">Select size</p>
                  <SizeTiles variants={product.variants} value={variant?.id} onChange={setVariantId} />
                </>
              )}
              <button
                type="button"
                onClick={() => add(1)}
                disabled={!variant || variant.stock === 0 || adding}
                className={`${hasSizes ? "mt-2" : ""} flex h-11 w-full items-center justify-center gap-2.5 rounded bg-[#111] text-[12px] font-medium uppercase tracking-[0.3em] text-white transition-opacity hover:opacity-90 disabled:opacity-50`}
              >
                <BagIcon className="h-4 w-4" />
                {variant?.stock === 0 ? "Out of stock" : adding ? "Adding…" : "Add to cart"}
              </button>
            </div>
          </>
        )}
      </div>

      <div className="mt-3 @min-[200px]:mt-3.5">
        {label && (
          <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-royal-light @min-[200px]:text-[11px]">{label}</p>
        )}
        <Link href={href} className="mt-1.5 block @min-[200px]:mt-2" title={product.name}>
          <span className="block truncate font-serif text-lg leading-tight tracking-normal! text-ink decoration-ink decoration-1 underline-offset-4 group-hover:underline @min-[200px]:text-2xl">
            {cardDisplayName(product.name)}
          </span>
        </Link>
        {product.scentAccords.length > 0 && (
          <p className="mt-1 truncate text-xs text-ink-soft/80 @min-[200px]:mt-1.5 @min-[200px]:text-[13px]">{product.scentAccords.join(" · ")}</p>
        )}
        <div className="mt-3 hidden border-t border-ink/10 @min-[200px]:block" />
        <div className="mt-2.5 flex flex-wrap items-center gap-x-2.5 gap-y-1.5 @min-[200px]:mt-3">
          <span className="text-base font-semibold text-ink @min-[200px]:text-xl @min-[200px]:font-medium">{formatAed(price)}</span>
          {product.compareAtPrice && off && (
            <span className="text-xs text-ink-soft/70 line-through @min-[200px]:text-sm">{formatAed(product.compareAtPrice)}</span>
          )}
          {off && (
            <span className="rounded-full bg-[#ddd3c2] px-2.5 py-1 text-[11px] font-medium leading-none text-royal @min-[200px]:text-xs">
              Save {off}%
            </span>
          )}
        </div>
      </div>

      {sheetOpen && (
        <QuickShopSheet
          product={product}
          imageUrl={imageUrl}
          label={label}
          variantId={variant?.id}
          onVariantChange={setVariantId}
          onClose={() => setSheetOpen(false)}
          onAdd={add}
          adding={adding}
        />
      )}
    </div>
  );
}
