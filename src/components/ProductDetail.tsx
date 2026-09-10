"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Product } from "@/lib/types";
import { formatAed, percentOff } from "@/lib/money";
import { formatConcentration, deliveryEstimate } from "@/lib/format";
import { StarRating } from "./StarRating";
import { Accordion } from "./Accordion";
import { useCart } from "@/lib/cart-context";

export function ProductDetail({ product }: { product: Product }) {
  const router = useRouter();
  const { addItem } = useCart();
  const [activeImage, setActiveImage] = useState(0);
  const [variantId, setVariantId] = useState(product.variants[0]?.id);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  const variant = product.variants.find((v) => v.id === variantId) ?? product.variants[0];
  const off = percentOff(variant?.price ?? product.price, product.compareAtPrice);
  const images = product.images.length > 0 ? product.images : [{ id: "placeholder", url: "", altText: null, position: 0 }];
  const category = product.categories[0]?.name;

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
        image: product.images[0]?.url ?? null,
        quantity,
      });
    } finally {
      setAdding(false);
    }
  }

  async function handleBuyNow() {
    await handleAddToCart();
    router.push("/checkout");
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-12 px-6 py-12 lg:grid-cols-2">
      {/* Gallery */}
      <div>
        <div className="relative aspect-square overflow-hidden bg-cream-dark">
          {images[activeImage]?.url ? (
            <Image
              src={images[activeImage].url}
              alt={images[activeImage].altText ?? product.name}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="font-serif text-2xl tracking-widest text-ink-soft">AMORIA</span>
            </div>
          )}
        </div>
        {product.images.length > 1 && (
          <div className="mt-4 flex gap-3">
            {product.images.map((img, i) => (
              <button
                key={img.id}
                onClick={() => setActiveImage(i)}
                className={`relative h-20 w-20 overflow-hidden bg-cream-dark ${i === activeImage ? "ring-2 ring-emerald" : ""}`}
              >
                {img.url && (
                  <Image src={img.url} alt={img.altText ?? product.name} fill sizes="80px" className="object-cover" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Details */}
      <div>
        {category && <p className="label-caps text-ink-soft">The Shop · {category}</p>}
        <h1 className="mt-2 font-serif text-3xl leading-snug text-ink">
          {product.name} {formatConcentration(product.concentrationType)}
        </h1>
        {product.scentAccords.length > 0 && (
          <p className="mt-2 text-sm text-crimson">{product.scentAccords.join(" · ")}</p>
        )}

        <div className="mt-3">
          <StarRating rating={product.avgRating} reviewCount={product.reviewCount} />
        </div>

        <div className="mt-4 flex items-baseline gap-3">
          <span className="text-2xl text-ink">{formatAed(variant?.price ?? product.price)}</span>
          {product.compareAtPrice && (
            <span className="text-ink-soft line-through">{formatAed(product.compareAtPrice)}</span>
          )}
          {off && <span className="font-medium text-emerald">{off}% Off</span>}
        </div>
        <p className="mt-1 text-xs text-ink-soft">Tax included. Shipping calculated at checkout.</p>

        {product.variants.length > 0 && (
          <div className="mt-6 flex gap-3">
            {product.variants.map((v) => (
              <button
                key={v.id}
                onClick={() => setVariantId(v.id)}
                disabled={v.stock === 0}
                className={`border px-4 py-2 text-sm transition-colors ${
                  v.id === variantId ? "border-emerald bg-emerald text-cream" : "border-border text-ink hover:border-emerald"
                } ${v.stock === 0 ? "cursor-not-allowed opacity-40" : ""}`}
              >
                {v.size}
              </button>
            ))}
          </div>
        )}

        <div className="mt-8 grid grid-cols-3 gap-4 border-y border-border py-6 text-center">
          {[
            { label: "Up To 85% Off", sub: "On All Your Perfume Orders" },
            { label: "100% Authentic", sub: "Original & Verified Products" },
            { label: "Free Shipping", sub: "All Orders Above AED 99" },
          ].map((b) => (
            <div key={b.label}>
              <p className="text-xs font-medium text-ink">{b.label}</p>
              <p className="mt-1 text-[11px] text-ink-soft">{b.sub}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex gap-3">
          <div className="flex items-center border border-border">
            <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="px-3 py-3 text-ink-soft">
              −
            </button>
            <span className="w-8 text-center text-sm">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => Math.min(variant?.stock ?? 1, q + 1))}
              className="px-3 py-3 text-ink-soft"
            >
              +
            </button>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={!variant || variant.stock === 0 || adding}
            className="flex-1 bg-crimson py-3 label-caps text-cream transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {variant?.stock === 0 ? "Out of Stock" : adding ? "Adding…" : "Add to Cart"}
          </button>
        </div>
        <button
          onClick={handleBuyNow}
          disabled={!variant || variant.stock === 0 || adding}
          className="mt-3 w-full bg-ink py-3 label-caps text-cream transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          Buy Now
        </button>

        <div className="mt-8">
          {(product.topNotes.length > 0 || product.heartNotes.length > 0 || product.baseNotes.length > 0) && (
            <Accordion title="Scent Pyramid" defaultOpen>
              <div className="space-y-2">
                {product.topNotes.length > 0 && <p><strong className="text-ink">Top:</strong> {product.topNotes.join(", ")}</p>}
                {product.heartNotes.length > 0 && <p><strong className="text-ink">Heart:</strong> {product.heartNotes.join(", ")}</p>}
                {product.baseNotes.length > 0 && <p><strong className="text-ink">Base:</strong> {product.baseNotes.join(", ")}</p>}
              </div>
            </Accordion>
          )}
          {product.perfumerNote && (
            <Accordion title="Perfumer's Note">
              <p>{product.perfumerNote}</p>
            </Accordion>
          )}
          <Accordion title="Sizes and Refills">
            <p>Available in {product.variants.map((v) => v.size).join(", ")}. Refills coming soon.</p>
          </Accordion>
          <Accordion title="How, When & Where to Apply Fragrances">
            <p>
              Apply to pulse points — wrists, neck, and behind the ears — right after showering, when skin is
              warm and slightly damp for the longest-lasting effect.
            </p>
          </Accordion>
          <Accordion title="Shipping, Returns and Questions">
            <p>Free shipping on orders above AED 99. Unopened items can be returned within 14 days of delivery.</p>
          </Accordion>
        </div>

        <p className="mt-6 flex items-center gap-2 text-sm text-emerald">
          <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor"><circle cx="10" cy="10" r="9" /></svg>
          Order today, you&apos;ll receive your package between <strong>{deliveryEstimate()}</strong>
        </p>
      </div>
    </div>
  );
}
