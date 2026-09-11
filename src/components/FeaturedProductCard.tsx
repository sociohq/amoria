"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/lib/types";
import { formatAed, percentOff } from "@/lib/money";
import { fragranceFamilyIcon, fragranceFamilyColor, genderTag } from "@/lib/fragrance";
import { useCart } from "@/lib/cart-context";

export function FeaturedProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [variantId, setVariantId] = useState(product.variants[0]?.id);
  const [adding, setAdding] = useState(false);
  const variant = product.variants.find((v) => v.id === variantId) ?? product.variants[0];
  const image = product.images[0];
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
        image: image?.url ?? null,
      });
    } finally {
      setAdding(false);
    }
  }

  return (
    <div className="group w-full shrink-0">
      <div className="relative aspect-[4/5] overflow-hidden bg-cream-dark">
        <Link href={`/product/${product.slug}`} className="absolute inset-0">
          {image ? (
            <Image
              src={image.url}
              alt={image.altText ?? product.name}
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

        {/* Gender + fragrance-family tags, sourced from the product's real
            categories/fragranceFamily fields (not hardcoded) — always
            visible, top-right of the image, above the hover overlay. */}
        {(gender || product.fragranceFamily) && (
          <div className="pointer-events-none absolute right-3 top-3 flex flex-col items-end gap-1.5">
            {gender && (
              <span className="rounded-full border border-border bg-white/90 px-3 py-1 text-xs text-ink-soft">
                {gender}
              </span>
            )}
            {product.fragranceFamily && (
              <span className="rounded-full border border-border bg-white/90 px-3 py-1 text-xs text-ink-soft">
                {fragranceFamilyIcon(product.fragranceFamily)} {product.fragranceFamily}
              </span>
            )}
          </div>
        )}

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
                      name={`variant-${product.id}`}
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

      <div className="mt-3">
        <Link href={`/product/${product.slug}`}>
          <p className="font-serif text-lg text-ink hover:text-emerald">{product.name}</p>
        </Link>
        {product.scentAccords.length > 0 && (
          <p
            className="text-xs"
            style={{ color: product.fragranceFamily ? fragranceFamilyColor(product.fragranceFamily) : "var(--color-ink-soft)" }}
          >
            {product.scentAccords.join(" · ")}
          </p>
        )}
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-sm font-medium text-ink">{formatAed(variant?.price ?? product.price)}</span>
          {product.compareAtPrice && (
            <span className="text-xs text-ink-soft line-through">{formatAed(product.compareAtPrice)}</span>
          )}
          {off && <span className="text-xs text-emerald">{off}% Off</span>}
        </div>
      </div>
    </div>
  );
}
