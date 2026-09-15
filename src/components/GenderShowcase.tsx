"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { GenderShowcaseSection as GenderShowcaseSectionType, Product } from "@/lib/types";
import { FeaturedProductCard } from "./FeaturedProductCard";

type Side = "him" | "her";

// Homepage-only "For Him / For Her" banner.
//
// Earlier versions repeated a full eyebrow/heading/subheading/CTA block
// per tab on top of the photo — between that, the tab toggle, and a
// product row, it read as three separate things stacked on top of each
// other. Simplified to one job per element: the intro line is the
// section's only heading (it doesn't change with the tab), the toggle
// switches the photo and products, and the products speak for
// themselves — no repeated copy block, no per-card badges competing
// with the photo.
export function GenderShowcase({ section }: { section: GenderShowcaseSectionType }) {
  const [side, setSide] = useState<Side>("him");
  const isHim = side === "him";

  return (
    <section className="relative isolate min-h-[760px] overflow-hidden bg-cream-dark">
      {/* Background photo — crossfades between sides, full-bleed. */}
      {(["him", "her"] as const).map((s) => {
        const image = s === "him" ? section.himImage : section.herImage;
        const visible = side === s;
        return (
          <div
            key={s}
            aria-hidden={!visible}
            className={`absolute inset-0 transition-opacity duration-[900ms] ease-out ${
              visible ? "opacity-100" : "opacity-0"
            }`}
          >
            {image ? (
              <Image src={image} alt="" fill priority={s === "him"} sizes="100vw" className="object-cover" />
            ) : (
              <div className="h-full w-full bg-cream-dark" />
            )}
          </div>
        );
      })}
      {/* One even, light wash for the whole photo — reads as part of the
          image rather than a box drawn over it, and keeps every layer of
          text legible regardless of what's directly behind it. */}
      <div className="absolute inset-0 bg-gradient-to-b from-cream/20 via-cream/45 to-cream/70" />

      <div className="relative z-10 flex min-h-[760px] flex-col items-center px-6 pb-14 pt-16 text-center sm:pt-20">
        {section.intro && (
          <h2 className="max-w-xl text-balance font-serif text-2xl leading-snug text-ink sm:text-3xl">
            {section.intro}
          </h2>
        )}

        {/* Tab toggle — a sliding ink pill behind whichever label is
            active, both the fill and the label colors transitioning
            together so nothing pops. Kept compact — this is a small
            switch, not another headline. */}
        <div className="relative mt-7 flex rounded-full border border-ink/15 bg-white/60 p-1 backdrop-blur-sm">
          <span
            aria-hidden
            className={`absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-full bg-ink transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] ${
              isHim ? "translate-x-0" : "translate-x-full"
            }`}
          />
          <button
            type="button"
            onClick={() => setSide("him")}
            className={`relative z-10 w-24 py-2 label-caps transition-colors duration-500 sm:w-28 ${
              isHim ? "text-cream" : "text-ink/60 hover:text-ink"
            }`}
          >
            For Him
          </button>
          <button
            type="button"
            onClick={() => setSide("her")}
            className={`relative z-10 w-24 py-2 label-caps transition-colors duration-500 sm:w-28 ${
              !isHim ? "text-cream" : "text-ink/60 hover:text-ink"
            }`}
          >
            For Her
          </button>
        </div>

        {/* Products — the sole payoff below the toggle, crossfaded per
            side. A single "Explore All" for whichever side is active
            sits beneath them rather than repeating per-tab copy above.
            No max-width here (same as the "Featured Products" section
            below it) so the shared sizing formula on each card lands at
            the same actual pixel size, not a smaller one. */}
        <div className="relative mt-12 w-full flex-1">
          {(["him", "her"] as const).map((s) => (
            <ProductRow key={s} products={s === "him" ? section.him : section.her} visible={side === s} />
          ))}
        </div>

        <Link
          href={`/shop?category=for-${side}`}
          className="mt-10 inline-flex items-center gap-2 border border-ink bg-white/70 px-8 py-3 label-caps text-ink backdrop-blur-sm transition-colors duration-300 hover:bg-ink hover:text-cream"
        >
          Explore {isHim ? "For Him" : "For Her"} <span aria-hidden>→</span>
        </Link>
      </div>
    </section>
  );
}

function ProductRow({ products, visible }: { products: Product[]; visible: boolean }) {
  return (
    <div
      aria-hidden={!visible}
      className={`transition-all duration-500 ease-out ${
        visible ? "relative opacity-100 delay-150" : "pointer-events-none absolute inset-0 translate-y-2 opacity-0"
      }`}
    >
      {products.length === 0 ? (
        <div className="flex min-h-[320px] items-center justify-center border border-dashed border-ink/25 bg-white/40 text-sm text-ink-soft backdrop-blur-sm">
          No products yet
        </div>
      ) : (
        <div className="flex flex-wrap justify-center gap-6">
          {products.slice(0, 3).map((p) => (
            <div key={p.id} className="w-[calc(50%-12px)] shrink-0 sm:w-[calc(33.333%-16px)] md:w-[calc(25%-18px)]">
              <FeaturedProductCard product={p} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
