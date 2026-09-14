"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShopTheLookSection } from "@/lib/types";
import { formatAed, percentOff } from "@/lib/money";

// Matches ProductSection's ArrowButton exactly (not exported there, so
// duplicated rather than reworking that component's file for one shared
// piece) — keeps the same circular-outline chevron language site-wide.
function ArrowButton({ direction, onClick }: { direction: "left" | "right"; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === "left" ? "Previous product" : "Next product"}
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border text-ink-soft transition-colors hover:border-ink hover:text-ink"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        {direction === "left" ? (
          <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
        ) : (
          <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
        )}
      </svg>
    </button>
  );
}

// Homepage "Shop The Look" banner: one lifestyle image with clickable
// hotspot dots pinned to it (as x/y percentages — see the admin page for
// how those get set), each swapping the product panel on the right. The
// active hotspot, the right panel, and the dot pagination all stay in
// sync off one piece of state.
export function ShopTheLook({ section }: { section: ShopTheLookSection }) {
  const [activeIndex, setActiveIndex] = useState(0);
  // Briefly fades/shifts the panel out, swaps the product underneath while
  // it's invisible, then fades it back in — so an arrow/dot/hotspot click
  // reads as a smooth transition instead of the name/image/price snapping
  // to the next product instantly.
  const [visible, setVisible] = useState(true);
  const hotspots = section.hotspots;
  const active = hotspots[activeIndex];
  if (!active || !section.image) return null;

  const product = active.product;
  const variant = product.variants[0];
  const price = variant?.price ?? product.price;
  const off = percentOff(price, product.compareAtPrice);

  function goTo(index: number) {
    if (index === activeIndex) return;
    setVisible(false);
    window.setTimeout(() => {
      setActiveIndex(index);
      setVisible(true);
    }, 200);
  }

  function go(delta: number) {
    goTo((activeIndex + delta + hotspots.length) % hotspots.length);
  }

  return (
    <section className="px-6 py-16 sm:px-12">
      <div className="mb-10 text-center">
        <p className="label-caps text-gold">Shop The Look</p>
        <h2 className="mt-1 font-serif text-3xl text-ink">{section.title}</h2>
        {section.subtitle && <p className="mt-2 text-ink-soft">{section.subtitle}</p>}
      </div>

      <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-2 lg:items-center">
        {/* Image + hotspots */}
        <div className="relative aspect-square overflow-hidden bg-cream-dark sm:aspect-[4/5]">
          <Image
            src={section.image}
            alt={section.title}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
          {hotspots.map((h, i) => (
            <button
              key={h.id}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Show ${h.product.name}`}
              className="absolute flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center"
              style={{ left: `${h.x}%`, top: `${h.y}%` }}
            >
              {i === activeIndex && (
                <span className="absolute h-4 w-4 animate-ping rounded-full bg-cream/70" />
              )}
              <span
                className={`relative h-3.5 w-3.5 rounded-full border-2 shadow-sm transition-colors ${
                  i === activeIndex ? "border-royal bg-cream" : "border-cream bg-cream/60 hover:bg-cream"
                }`}
              />
            </button>
          ))}
        </div>

        {/* Active product panel */}
        <div className="flex items-center gap-3 sm:gap-6">
          {hotspots.length > 1 && <ArrowButton direction="left" onClick={() => go(-1)} />}

          <div
            className={`flex-1 text-center transition-all duration-200 ease-out ${
              visible ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
            }`}
          >
            <div className="relative mx-auto h-64 w-64">
              {product.images[0]?.url && (
                <Image
                  src={product.images[0].url}
                  alt={product.name}
                  fill
                  sizes="256px"
                  className="object-contain"
                />
              )}
            </div>
            <h3 className="mt-4 font-serif text-2xl text-ink">{product.name}</h3>
            {product.scentAccords.length > 0 && (
              <p className="mt-1 text-sm text-crimson">{product.scentAccords.join(" · ")}</p>
            )}
            <div className="mt-3 flex items-center justify-center gap-3">
              <span className="text-lg text-ink">{formatAed(price)}</span>
              {product.compareAtPrice && (
                <span className="text-sm text-ink-soft line-through">{formatAed(product.compareAtPrice)}</span>
              )}
              {off && <span className="text-sm font-medium text-royal">{off}% Off</span>}
            </div>
            <Link
              href={`/product/${product.slug}`}
              className="mt-6 inline-block bg-ink px-10 py-3 label-caps text-cream hover:opacity-90"
            >
              View Product
            </Link>

            {hotspots.length > 1 && (
              <div className="mt-6 flex justify-center gap-2">
                {hotspots.map((h, i) => (
                  <button
                    key={h.id}
                    type="button"
                    onClick={() => goTo(i)}
                    aria-label={`Show ${h.product.name}`}
                    className={`h-1.5 w-1.5 rounded-full transition-colors ${
                      i === activeIndex ? "bg-royal" : "bg-border"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {hotspots.length > 1 && <ArrowButton direction="right" onClick={() => go(1)} />}
        </div>
      </div>
    </section>
  );
}
