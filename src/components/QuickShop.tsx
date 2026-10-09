"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { Product, ProductVariant } from "@/lib/types";
import { formatAed, percentOff } from "@/lib/money";
import { cardDisplayName } from "@/lib/fragrance";

export function BagIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className} aria-hidden>
      <path d="M6 8h12l-1 12H7L6 8Z" strokeLinejoin="round" />
      <path d="M9 8V7a3 3 0 0 1 6 0v1" strokeLinecap="round" />
    </svg>
  );
}

// The size picker shared by the desktop hover panel and the mobile sheet:
// one tile per size, the chosen one filled black. The line under the size is
// that size's price, so the choice carries its cost.
export function SizeTiles({
  variants,
  value,
  onChange,
  tall = false,
}: {
  variants: ProductVariant[];
  value: string | undefined;
  onChange: (id: string) => void;
  tall?: boolean;
}) {
  return (
    <div role="radiogroup" aria-label="Select size" className="grid grid-cols-2 gap-2">
      {variants.map((v) => {
        const selected = v.id === value;
        const soldOut = v.stock === 0;
        return (
          <button
            key={v.id}
            type="button"
            role="radio"
            aria-checked={selected}
            disabled={soldOut}
            onClick={() => onChange(v.id)}
            className={`flex flex-col items-center justify-center rounded border px-2 text-center transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
              tall ? "h-[65px]" : "h-[54px]"
            } ${selected ? "border-[#111] bg-[#111] text-white" : "border-border bg-white text-ink hover:border-ink"}`}
          >
            <span className="text-[13px] font-medium uppercase tracking-[0.04em] sm:text-sm">{v.size}</span>
            <span className={`mt-0.5 text-[11px] ${selected ? "text-white/70" : "text-ink-soft/80"}`}>
              {soldOut ? "Sold out" : formatAed(v.price)}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// Mobile "quick add": opens from the bag button on a card and slides up as a
// sheet — the product, its sizes, a quantity and one Add to Cart button — so
// a shopper never has to leave the listing. Rendered into <body> so no
// ancestor's overflow or transform can clip it.
export function QuickShopSheet({
  product,
  imageUrl,
  label,
  variantId,
  onVariantChange,
  onClose,
  onAdd,
  adding,
}: {
  product: Product;
  imageUrl: string | null;
  label: string | null;
  variantId: string | undefined;
  onVariantChange: (id: string) => void;
  onClose: () => void;
  onAdd: (quantity: number) => void;
  adding: boolean;
}) {
  const [quantity, setQuantity] = useState(1);
  const [shown, setShown] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const variant = product.variants.find((v) => v.id === variantId) ?? product.variants[0];
  const price = variant?.price ?? product.price;
  const off = percentOff(price, product.compareAtPrice);
  const maxQty = Math.max(1, Math.min(10, variant?.stock ?? 1));
  const hasSizes = product.variants.length > 1;

  useEffect(() => {
    const raf = requestAnimationFrame(() => setShown(true));
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label={`Add ${product.name} to cart`}>
      <div
        className={`absolute inset-0 bg-ink/50 transition-opacity duration-300 ${shown ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
      />
      <div
        className={`absolute inset-x-0 bottom-0 mx-auto max-h-[92dvh] w-full max-w-lg overflow-y-auto rounded-t-[20px] bg-[#faf8f5] px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-3 shadow-2xl transition-transform duration-300 ease-out ${
          shown ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="mx-auto mb-4 h-1 w-9 rounded-full bg-ink/20" aria-hidden />

        <div className="flex items-start gap-4 pb-5">
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded bg-[#f3f0f1]">
            {imageUrl && <Image src={imageUrl} alt="" fill sizes="64px" className="object-cover" />}
          </div>
          <div className="min-w-0 flex-1">
            {label && <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-royal-light">{label}</p>}
            <p className="truncate font-serif text-[22px] leading-tight tracking-normal text-ink">{cardDisplayName(product.name)}</p>
            {product.scentAccords.length > 0 && (
              <p className="mt-0.5 truncate text-xs text-ink-soft/80">{product.scentAccords.join(" · ")}</p>
            )}
            <p className="mt-1.5 flex flex-wrap items-baseline gap-x-2">
              <span className="text-lg font-semibold text-ink">{formatAed(price)}</span>
              {product.compareAtPrice && off && (
                <span className="text-xs text-ink-soft/70 line-through">{formatAed(product.compareAtPrice)}</span>
              )}
            </p>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="-mr-2 -mt-1 flex h-10 w-10 shrink-0 items-center justify-center text-ink"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
              <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="border-t border-border pt-5">
          {hasSizes && (
            <>
              <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.18em] text-ink-soft">Select size</p>
              <SizeTiles variants={product.variants} value={variant?.id} onChange={(id) => { onVariantChange(id); setQuantity(1); }} tall />
            </>
          )}

          <div className={`${hasSizes ? "mt-4" : ""} flex gap-3`}>
            <div className="flex h-[50px] shrink-0 items-center rounded border border-border bg-white">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
                className="h-full w-10 text-lg text-ink"
              >
                −
              </button>
              <span className="w-6 text-center text-sm text-ink" aria-live="polite">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
                aria-label="Increase quantity"
                className="h-full w-10 text-lg text-ink"
              >
                +
              </button>
            </div>
            <button
              type="button"
              onClick={() => onAdd(quantity)}
              disabled={!variant || variant.stock === 0 || adding}
              className="flex h-[50px] min-w-0 flex-1 items-center justify-center gap-2 rounded bg-[#111] px-3 text-[11px] font-medium uppercase tracking-[0.12em] text-white transition-opacity disabled:opacity-50 min-[400px]:text-[12px] min-[400px]:tracking-[0.18em]"
            >
              <BagIcon className="h-4 w-4 shrink-0" />
              <span className="truncate">
                {variant?.stock === 0 ? "Out of stock" : adding ? "Adding…" : `Add to cart · ${formatAed(price * quantity)}`}
              </span>
            </button>
          </div>
          <p className="mt-4 text-center text-xs text-ink-soft/80">Free delivery in UAE on orders above AED 250</p>
        </div>
      </div>
    </div>,
    document.body
  );
}
