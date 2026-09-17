"use client";

import { useRef } from "react";
import Link from "next/link";
import { Product } from "@/lib/types";
import { FeaturedProductCard } from "./FeaturedProductCard";
import { Reveal } from "./Reveal";

function ArrowButton({ direction, onClick }: { direction: "left" | "right"; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label={direction === "left" ? "Previous products" : "Next products"}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-ink-soft transition-colors hover:border-ink hover:text-ink"
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

export function ProductSection({
  eyebrow,
  title,
  products,
}: {
  eyebrow: string;
  title: string;
  products: Product[];
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  function scrollByPage(direction: 1 | -1) {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: el.clientWidth * 0.9 * direction, behavior: "smooth" });
  }

  if (products.length === 0) return null;

  // A horizontal-scroll carousel with arrows works fine once there's room
  // for 3-4 cards per view, but on a narrow phone it read as cramped and
  // cut-off — mobile instead gets a plain, static 2x2 grid of the first 4
  // products with a single "View All" underneath, no scroll/arrows at all.
  const mobileProducts = products.slice(0, 4);

  return (
    <section className="px-6 py-16">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="label-caps text-gold">{eyebrow}</p>
          <h2 className="mt-1 font-serif text-3xl text-ink">{title}</h2>
        </div>
        <div className="hidden items-center gap-5 sm:flex">
          <Link href="/shop" className="text-sm text-ink underline underline-offset-4 hover:text-royal">
            View all
          </Link>
          {products.length > 4 && (
            <div className="flex gap-2">
              <ArrowButton direction="left" onClick={() => scrollByPage(-1)} />
              <ArrowButton direction="right" onClick={() => scrollByPage(1)} />
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:hidden">
        {mobileProducts.map((p, i) => (
          <Reveal key={p.id} delayMs={(i % 4) * 100}>
            <FeaturedProductCard product={p} />
          </Reveal>
        ))}
      </div>
      <Link
        href="/shop"
        className="mt-8 block border border-ink py-3 text-center label-caps text-ink hover:bg-ink hover:text-cream sm:hidden"
      >
        View All
      </Link>

      <div
        ref={scrollerRef}
        className="no-scrollbar hidden gap-3 overflow-x-auto overflow-y-hidden scroll-smooth sm:flex sm:snap-x sm:snap-mandatory"
      >
        {products.map((p, i) => (
          <Reveal
            key={p.id}
            delayMs={(i % 4) * 100}
            className="shrink-0 snap-start sm:w-[calc(33.333%-8px)] md:w-[calc(25%-9px)]"
          >
            <FeaturedProductCard product={p} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
