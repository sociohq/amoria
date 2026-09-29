"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { FRAGRANCE_FAMILIES } from "@/lib/fragranceFamilies";
import { Reveal } from "./Reveal";

function ArrowButton({ direction, onClick }: { direction: "left" | "right"; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label={direction === "left" ? "Previous scent families" : "Next scent families"}
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

// A round-icon horizontal scroller for the full scent-family taxonomy —
// distinct from CategoryShowcase's rectangular gender/collection cards.
// Each circle links straight into the shop, pre-filtered to that family
// (see /shop's `family` query param and the fragranceFamily filter on
// GET /api/products). All 37 families are in the DOM at once — the arrow
// buttons (same pattern as ProductSection's carousel) are what make that
// discoverable instead of relying on a scrollbar hidden by `no-scrollbar`.
export function FragranceFamilyScroller() {
  const scrollerRef = useRef<HTMLDivElement>(null);

  function scrollByPage(direction: 1 | -1) {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: el.clientWidth * 0.9 * direction, behavior: "smooth" });
  }

  return (
    <section className="px-6 py-16">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="label-caps text-gold">Find Your Signature</p>
          <h2 className="mt-1 font-serif text-3xl text-ink">Shop By Scent Family</h2>
        </div>
        <div className="hidden gap-2 sm:flex">
          <ArrowButton direction="left" onClick={() => scrollByPage(-1)} />
          <ArrowButton direction="right" onClick={() => scrollByPage(1)} />
        </div>
      </div>

      <div
        ref={scrollerRef}
        className="no-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto overflow-y-hidden pb-2"
      >
        {FRAGRANCE_FAMILIES.map((family, i) => (
          <Reveal key={family.name} delayMs={(i % 8) * 60} className="shrink-0 snap-start">
            <Link href={`/shop?family=${encodeURIComponent(family.name)}`} className="group flex w-24 flex-col items-center gap-2 sm:w-28">
              <span className="relative h-24 w-24 overflow-hidden rounded-full border border-border bg-cream-dark transition-colors group-hover:border-royal sm:h-28 sm:w-28">
                {/* padding on the outer circle would be ignored by the fill
                    Image below (inset:0 sits on the padding edge, not the
                    content edge) — this inner absolutely-positioned box is
                    what actually creates the breathing room. */}
                <span className="absolute inset-4 sm:inset-5">
                  <Image src={family.image} alt="" fill sizes="112px" className="object-contain transition-transform duration-500 group-hover:scale-110" />
                </span>
              </span>
              <span className="text-center text-xs text-ink-soft group-hover:text-royal">{family.name}</span>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
