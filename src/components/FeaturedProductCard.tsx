"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/lib/types";
import { formatAed, percentOff } from "@/lib/money";
import { useCart } from "@/lib/cart-context";

export function FeaturedProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [variantId, setVariantId] = useState(product.variants[0]?.id);
  const [adding, setAdding] = useState(false);
  const variant = product.variants.find((v) => v.id === variantId) ?? product.variants[0];
  const image = product.images[0];
  const off = percentOff(variant?.price ?? product.price, product.compareAtPrice);

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
    <div className="w-full shrink-0">
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
            <div className="flex h-full items-center justify-center">
              <span className="font-serif text-sm tracking-widest text-ink-soft">AMORIA</span>
            </div>
          )}
        </div>
      </Link>

      <div className="mt-3">
        <Link href={`/product/${product.slug}`}>
          <p className="text-sm text-ink hover:text-emerald">{product.name}</p>
        </Link>
        {product.scentAccords.length > 0 && (
          <p className="text-xs text-ink-soft">{product.scentAccords.join(" · ")}</p>
        )}
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-sm font-medium text-ink">{formatAed(variant?.price ?? product.price)}</span>
          {product.compareAtPrice && (
            <span className="text-xs text-ink-soft line-through">{formatAed(product.compareAtPrice)}</span>
          )}
          {off && <span className="text-xs text-emerald">{off}% Off</span>}
        </div>
      </div>

      {product.variants.length > 1 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {product.variants.map((v) => (
            <button
              key={v.id}
              onClick={() => setVariantId(v.id)}
              disabled={v.stock === 0}
              className={`border px-2.5 py-1 text-xs transition-colors ${
                v.id === variantId ? "border-emerald bg-emerald text-cream" : "border-border text-ink-soft hover:border-emerald"
              } ${v.stock === 0 ? "cursor-not-allowed opacity-40" : ""}`}
            >
              {v.size}
            </button>
          ))}
        </div>
      )}

      <button
        onClick={handleAddToCart}
        disabled={!variant || variant.stock === 0 || adding}
        className="mt-3 w-full bg-ink py-2.5 label-caps text-cream transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {variant?.stock === 0 ? "Out of Stock" : adding ? "Adding…" : "Add to Cart"}
      </button>
    </div>
  );
}
