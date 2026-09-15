"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { GenderShowcaseSection as GenderShowcaseSectionType, Product } from "@/lib/types";
import { FeaturedProductCard } from "./FeaturedProductCard";

type Side = "him" | "her";

// Homepage-only "For Him / For Her" tabbed banner: a background photo per
// side, heading copy that crossfades with it, and a horizontally
// scrolling row of that side's products (the same FeaturedProductCard
// used in the "Featured Products" section — no bespoke card here). Both
// sides are always mounted and stacked (opacity + a slight drift) rather
// than swapped in React — a true crossfade with nothing to remount,
// which is what makes the tab switch feel instant and smooth instead of
// a flash-then-pop.
//
// The site owner's actual background photos are bright, mostly-white
// editorial shots with the model posed in the left third and the rest
// left deliberately blank — so, unlike a dark moody banner, this reads
// with dark ink text on a light scrim, and the copy/products are pushed
// right to sit on that blank space rather than over the model.
export function GenderShowcase({ section }: { section: GenderShowcaseSectionType }) {
  const [side, setSide] = useState<Side>("him");
  const isHim = side === "him";

  return (
    <section className="relative isolate min-h-[720px] overflow-hidden bg-cream-dark sm:min-h-[680px]">
      {(["him", "her"] as const).map((s) => {
        const image = s === "him" ? section.himImage : section.herImage;
        const visible = side === s;
        return (
          <div
            key={s}
            aria-hidden={!visible}
            className={`absolute inset-0 transition-opacity duration-[900ms] ease-out ${
              visible ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
          >
            {image ? (
              <Image src={image} alt="" fill priority={s === "him"} sizes="100vw" className="object-cover" />
            ) : (
              <div className="h-full w-full bg-cream-dark" />
            )}
            {/* A light, even wash rather than a dark gradient — these
                photos are already bright, so the scrim just guarantees
                the dark ink text reads cleanly without crushing the
                photo underneath it. */}
            <div className="absolute inset-0 bg-cream/35" />
          </div>
        );
      })}

      <div className="relative z-10 flex flex-col items-center px-6 pt-20 pb-16 sm:px-12">
        {section.intro && (
          <p className="max-w-xl text-balance text-center font-serif text-lg text-ink sm:text-xl">
            {section.intro}
          </p>
        )}

        {/* Tab toggle — a sliding ink pill behind whichever label is
            active, both the fill and the label colors transitioning
            together so nothing pops. */}
        <div className="relative mt-8 flex rounded-full border border-ink/15 bg-white/50 p-1 backdrop-blur-sm">
          <span
            aria-hidden
            className={`absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-full bg-ink transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] ${
              isHim ? "translate-x-0" : "translate-x-full"
            }`}
          />
          <button
            type="button"
            onClick={() => setSide("him")}
            className={`relative z-10 w-32 py-2.5 label-caps transition-colors duration-500 sm:w-40 ${
              isHim ? "text-cream" : "text-ink/60 hover:text-ink"
            }`}
          >
            For Him
          </button>
          <button
            type="button"
            onClick={() => setSide("her")}
            className={`relative z-10 w-32 py-2.5 label-caps transition-colors duration-500 sm:w-40 ${
              !isHim ? "text-cream" : "text-ink/60 hover:text-ink"
            }`}
          >
            For Her
          </button>
        </div>

        {/* Pushed toward the right (the blank two-thirds of the source
            photos) via ml-auto on a capped-width inner block, rather than
            centered, so the copy and product row never sit over the
            model on the left. */}
        <div className="mt-14 w-full md:pl-[44%] lg:pl-[42%]">
          <div className="grid gap-8 md:max-w-3xl md:grid-cols-[minmax(0,300px)_1fr] md:items-center md:gap-10">
            {/* Left: heading copy, same crossfade-stack technique as the
                background so switching tabs never reflows this column. */}
            <div className="relative min-h-[200px] sm:min-h-[180px]">
              {(["him", "her"] as const).map((s) => {
                const visible = side === s;
                const eyebrow = s === "him" ? section.himEyebrow : section.herEyebrow;
                const heading = s === "him" ? section.himHeading : section.herHeading;
                const subheading = s === "him" ? section.himSubheading : section.herSubheading;
                return (
                  <div
                    key={s}
                    aria-hidden={!visible}
                    className={`transition-all duration-500 ease-out ${
                      visible
                        ? "relative opacity-100 delay-150"
                        : "pointer-events-none absolute inset-0 -translate-y-2 opacity-0"
                    }`}
                  >
                    <p className="label-caps text-gold">{eyebrow}</p>
                    <h2 className="mt-3 font-serif text-4xl leading-tight text-ink sm:text-5xl">{heading}</h2>
                    {subheading && <p className="mt-4 text-sm text-ink-soft">{subheading}</p>}
                    <Link
                      href={`/shop?category=for-${s}`}
                      className="mt-7 inline-flex items-center gap-2 border border-ink px-7 py-3 label-caps text-ink transition-colors duration-300 hover:bg-ink hover:text-cream"
                    >
                      Explore All <span aria-hidden>→</span>
                    </Link>
                  </div>
                );
              })}
            </div>

            {/* Right: the product row — also crossfade-stacked so the
                carousel underneath swaps just as smoothly. */}
            <div className="relative min-h-[420px] sm:min-h-[440px]">
              {(["him", "her"] as const).map((s) => (
                <ProductRow key={s} products={s === "him" ? section.him : section.her} visible={side === s} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProductRow({ products, visible }: { products: Product[]; visible: boolean }) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  function scrollBy(dir: 1 | -1) {
    scrollerRef.current?.scrollBy({ left: dir * 240, behavior: "smooth" });
  }

  return (
    <div
      aria-hidden={!visible}
      className={`transition-all duration-500 ease-out ${
        visible ? "relative opacity-100 delay-150" : "pointer-events-none absolute inset-0 translate-y-2 opacity-0"
      }`}
    >
      {products.length === 0 ? (
        <div className="flex h-full min-h-[380px] items-center justify-center border border-dashed border-ink/20 text-sm text-ink-soft">
          No products yet
        </div>
      ) : (
        <>
          <div className="mb-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => scrollBy(-1)}
              aria-label="Scroll left"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/25 text-ink transition-colors hover:bg-ink hover:text-cream"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => scrollBy(1)}
              aria-label="Scroll right"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/25 text-ink transition-colors hover:bg-ink hover:text-cream"
            >
              ›
            </button>
          </div>
          <div ref={scrollerRef} className="themed-scroll flex gap-5 overflow-x-auto pb-2">
            {products.map((p) => (
              <div key={p.id} className="w-40 shrink-0 sm:w-44">
                <FeaturedProductCard product={p} />
              </div>
            ))}
          </div>
          <p className="mt-3 text-right text-xs text-ink-soft">Scroll to explore more ↓</p>
        </>
      )}
    </div>
  );
}
