"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { GenderShowcaseSection as GenderShowcaseSectionType, Product } from "@/lib/types";
import { formatAed } from "@/lib/money";
import { useCart } from "@/lib/cart-context";
import { WishlistButton } from "./WishlistButton";

type Side = "him" | "her";

// Homepage-only "For Him / For Her" tabbed banner: a background photo per
// side, heading copy that crossfades with it, and a horizontally
// scrolling row of that side's products. Both sides are always mounted
// and stacked (opacity + a slight vertical drift) rather than swapped in
// React — a true crossfade with nothing to remount, which is what makes
// the tab switch feel instant and smooth instead of a flash-then-pop.
export function GenderShowcase({ section }: { section: GenderShowcaseSectionType }) {
  const [side, setSide] = useState<Side>("him");
  const isHim = side === "him";

  return (
    <section className="relative isolate min-h-[720px] overflow-hidden bg-ink sm:min-h-[680px]">
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
              <div className="h-full w-full bg-ink" />
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/40 to-ink/80" />
          </div>
        );
      })}

      <div className="relative z-10 flex flex-col items-center px-6 pt-20 pb-16 sm:px-12">
        {section.intro && (
          <p className="max-w-xl text-balance text-center font-serif text-lg text-cream/90 sm:text-xl">
            {section.intro}
          </p>
        )}

        {/* Tab toggle — a sliding cream pill behind whichever label is
            active, both the fill and the label colors transitioning
            together so nothing pops. */}
        <div className="relative mt-8 flex rounded-full border border-cream/25 bg-cream/10 p-1 backdrop-blur-sm">
          <span
            aria-hidden
            className={`absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-full bg-cream transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] ${
              isHim ? "translate-x-0" : "translate-x-full"
            }`}
          />
          <button
            type="button"
            onClick={() => setSide("him")}
            className={`relative z-10 w-32 py-2.5 label-caps transition-colors duration-500 sm:w-40 ${
              isHim ? "text-ink" : "text-cream/70 hover:text-cream"
            }`}
          >
            For Him
          </button>
          <button
            type="button"
            onClick={() => setSide("her")}
            className={`relative z-10 w-32 py-2.5 label-caps transition-colors duration-500 sm:w-40 ${
              !isHim ? "text-ink" : "text-cream/70 hover:text-cream"
            }`}
          >
            For Her
          </button>
        </div>

        <div className="mt-14 grid w-full max-w-7xl gap-8 md:grid-cols-[minmax(0,340px)_1fr] md:items-center md:gap-14">
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
                  <h2 className="mt-3 font-serif text-4xl leading-tight text-cream sm:text-5xl">{heading}</h2>
                  {subheading && <p className="mt-4 text-sm text-cream/75">{subheading}</p>}
                  <Link
                    href={`/shop?category=for-${s}`}
                    className="mt-7 inline-flex items-center gap-2 border border-cream/40 px-7 py-3 label-caps text-cream transition-colors duration-300 hover:bg-cream hover:text-ink"
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
    </section>
  );
}

function ProductRow({ products, visible }: { products: Product[]; visible: boolean }) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  function scrollBy(dir: 1 | -1) {
    scrollerRef.current?.scrollBy({ left: dir * 260, behavior: "smooth" });
  }

  return (
    <div
      aria-hidden={!visible}
      className={`transition-all duration-500 ease-out ${
        visible ? "relative opacity-100 delay-150" : "pointer-events-none absolute inset-0 translate-y-2 opacity-0"
      }`}
    >
      {products.length === 0 ? (
        <div className="flex h-full min-h-[380px] items-center justify-center border border-dashed border-cream/25 text-sm text-cream/60">
          No products yet
        </div>
      ) : (
        <>
          <div className="mb-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => scrollBy(-1)}
              aria-label="Scroll left"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-cream/30 text-cream transition-colors hover:bg-cream hover:text-ink"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => scrollBy(1)}
              aria-label="Scroll right"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-cream/30 text-cream transition-colors hover:bg-cream hover:text-ink"
            >
              ›
            </button>
          </div>
          <div ref={scrollerRef} className="themed-scroll flex gap-5 overflow-x-auto pb-2">
            {products.map((p) => (
              <MiniProductCard key={p.id} product={p} />
            ))}
          </div>
          <p className="mt-3 text-right text-xs text-cream/50">Scroll to explore more ↓</p>
        </>
      )}
    </div>
  );
}

function MiniProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [adding, setAdding] = useState(false);
  const variant = product.variants[0];
  const image = product.images[0];

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
    <div className="w-52 shrink-0 overflow-hidden rounded-2xl bg-cream sm:w-56">
      <div className="relative aspect-[3/4]">
        <Link href={`/product/${product.slug}`} className="absolute inset-0">
          {image ? (
            <Image src={image.url} alt={image.altText ?? product.name} fill sizes="224px" className="object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center bg-cream-dark">
              <span className="font-serif text-xs tracking-widest text-ink-soft">AMORIA</span>
            </div>
          )}
        </Link>
        <WishlistButton
          productId={product.id}
          className="absolute right-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-ink-soft transition-colors hover:text-crimson"
        />
      </div>
      <div className="p-4">
        <Link href={`/product/${product.slug}`}>
          <p className="font-serif text-lg text-ink hover:text-royal">{product.name}</p>
        </Link>
        {product.scentAccords.length > 0 && (
          <p className="mt-0.5 truncate text-xs text-ink-soft">{product.scentAccords.join(" · ")}</p>
        )}
        <p className="mt-2 text-sm font-medium text-ink">{formatAed(variant?.price ?? product.price)}</p>
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!variant || variant.stock === 0 || adding}
          className="mt-3 w-full rounded-full border border-ink py-2 label-caps text-xs text-ink transition-colors hover:bg-ink hover:text-cream disabled:opacity-40"
        >
          {variant?.stock === 0 ? "Out of Stock" : adding ? "Adding…" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
