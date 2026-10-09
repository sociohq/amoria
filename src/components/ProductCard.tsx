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

const BADGE_LABELS = {
  BESTSELLER: "Bestseller",
  NEW: "New",
  LIMITED: "Limited",
} as const;

// The product card used everywhere products are listed (shop, homepage
// sections, brand pages, blog embeds), built to the Figma "Card" frame: a
// photo with an optional label and the wishlist heart, then category, name,
// scent notes and price. Buying straight from the card: on a mouse device the
// size tiles and Add to cart rise over the photo on hover; on touch (phone,
// tablet) a bag button opens a bottom sheet. Either way picking a size also
// swaps to that size's own photo.
//
// Sizes follow the card's own width (container queries), not the screen's:
// the Figma sizes apply from about 260px wide up; narrower cards (two across on a
// phone, three on a tablet) step down so nothing crowds.
export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [variantId, setVariantId] = useState(product.variants[0]?.id);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [adding, setAdding] = useState(false);

  const variant =
    product.variants.find((v) => v.id === variantId) ?? product.variants[0];
  // A single size has nothing to choose — the card then offers just Add to cart.
  const hasSizes = product.variants.length > 1;
  const price = variant?.price ?? product.price;
  const off = percentOff(price, product.compareAtPrice);
  const label = cardLabel(product);
  const imageUrl =
    imageForSize(product, variant?.size) ??
    product.thumbnailImage ??
    product.images[0]?.url ??
    null;
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
    <div className="group @container w-full shrink-0">
      <div className="flex flex-col gap-3 text-left @min-[260px]:gap-4">
        <div className="relative aspect-[4/5] overflow-hidden rounded-md bg-[#f3f0f1] transition-shadow duration-300 lg:group-hover:shadow-[0_14px_30px_-6px_rgba(51,38,26,0.14)]">
          <Link
            href={href}
            className="absolute inset-0"
            aria-label={product.name}
          >
            {imageUrl ? (
              <ProductCardImage
                src={imageUrl}
                alt={product.name}
                sizes="(min-width: 1024px) 25vw, 50vw"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-ink-soft">
                <span className="font-serif text-sm tracking-widest">
                  AMORIA
                </span>
              </div>
            )}
          </Link>

          {badge && (
            <span className="pointer-events-none absolute left-2 top-2 z-10 rounded-[2px] bg-white/90 px-2 py-1 text-[9px] font-medium uppercase leading-normal tracking-[1.8px] text-[#111] @min-[260px]:left-3.5 @min-[260px]:top-3.5 @min-[260px]:px-2.5 @min-[260px]:py-1.5 @min-[260px]:text-[10px]">
              {badge}
            </span>
          )}

          <WishlistButton
            productId={product.id}
            className="absolute right-2 top-2 z-10 flex h-[30px] w-[30px] items-center justify-center rounded-full bg-white/90 text-[#111] transition-colors hover:text-crimson group-hover:bg-white @min-[260px]:right-3.5 @min-[260px]:top-3.5 @min-[260px]:h-[38px] @min-[260px]:w-[38px]"
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

              {/* Mouse devices: sizes + Add to cart rise over the bottom of the photo on hover. */}
              <div className="pointer-events-none absolute inset-x-3.5 bottom-0.5 z-10 hidden flex-col gap-2 opacity-0 transition-all duration-300 group-focus-within:pointer-events-auto group-focus-within:bottom-3.5 group-focus-within:opacity-100 group-hover:pointer-events-auto group-hover:bottom-3.5 group-hover:opacity-100 lg:flex [@media(hover:none)]:hidden">
                {hasSizes && (
                  <SizeTiles
                    overlay
                    variants={product.variants}
                    value={variant?.id}
                    onChange={setVariantId}
                  />
                )}
                <button
                  type="button"
                  onClick={() => add(1)}
                  disabled={!variant || variant.stock === 0 || adding}
                  className="flex w-full items-center justify-center gap-2.5 rounded bg-[#111] py-[13px] text-[12px] font-medium uppercase tracking-[3px] text-[#f4efe8] transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  <BagIcon className="h-4 w-4" />
                  {variant?.stock === 0
                    ? "Out of stock"
                    : adding
                      ? "Adding…"
                      : "Add to cart"}
                </button>
              </div>
            </>
          )}
        </div>

        <div className="flex flex-col gap-2 @min-[260px]:gap-2.5">
          {label && (
            <p className="text-[10px] font-medium uppercase leading-normal tracking-[2px] text-[#8a6a3a]">
              {label}
            </p>
          )}
          <Link href={href} title={product.name} className="block">
            <span className="block truncate font-serif text-lg font-medium leading-[1.25] tracking-normal! text-[#111] decoration-[#111] decoration-1 underline-offset-[5px] group-hover:underline @min-[200px]:text-[22px] @min-[260px]:text-[26px] @min-[260px]:leading-[30px]">
              {cardDisplayName(product.name)}
            </span>
          </Link>
          {product.scentAccords.length > 0 && (
            <p className="truncate text-xs leading-normal tracking-[0.3px] text-[#6e6a65] @min-[260px]:text-[13px]">
              {product.scentAccords.join(" · ")}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-0.5">
            <span className="text-base font-medium leading-normal text-[#111] @min-[260px]:text-lg">
              {formatAed(price)}
            </span>
            {product.compareAtPrice && off && (
              <span className="text-xs leading-normal text-[#9c968f] line-through @min-[260px]:text-[13px]">
                {formatAed(product.compareAtPrice)}
              </span>
            )}
            {off && (
              <span className="py-[3px] text-[11px] font-medium leading-normal tracking-[0.3px] text-[#8a6a3a]">
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
    </div>
  );
}
