"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { getImageProps } from "next/image";
import { PromoBannerData } from "@/lib/promoBanner";

// The image drifts upward slightly as the section scrolls past — bounded to
// a fixed buffer below the visible frame (the wrapper is exactly that much
// taller than the section) so it never runs out of image to reveal. The picture, wording and button come from admin →
// Create Your Own Banner; with no picture uploaded the one built into the site is used.
const PARALLAX_BUFFER = 0.12; // fraction of the section's own height
const BUILT_IN_IMAGE = "/banners/customize-perfume.png";
const BUILT_IN_ALT = "Empty Amoria bottles beside beakers of fragrance oils, being blended into a custom scent";

export function CustomizePerfumeBanner({ banner }: { banner: PromoBannerData }) {
  const light = banner.textTone === "light";
  // A picture uploaded in the admin has no description of its own; the heading beside it already says what it is.
  const common = { alt: banner.image ? "" : BUILT_IN_ALT, fill: true, sizes: "100vw" } as const;
  const {
    props: { srcSet, ...img },
  } = getImageProps({ ...common, src: banner.image ?? BUILT_IN_IMAGE });
  const mobileSet = banner.mobileImage ? getImageProps({ ...common, src: banner.mobileImage }).props.srcSet : undefined;
  const sectionRef = useRef<HTMLElement>(null);
  const [offset, setOffset] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    function update() {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      // 0 when the section is just entering the bottom of the viewport, 1
      // once it has fully scrolled past the top — clamped so the image
      // never moves before/after that transit.
      const total = window.innerHeight + rect.height;
      const traveled = window.innerHeight - rect.top;
      const progress = Math.min(1, Math.max(0, traveled / total));
      setOffset(progress * PARALLAX_BUFFER * rect.height);
    }
    function onScroll() {
      if (rafRef.current != null) return;
      rafRef.current = requestAnimationFrame(() => {
        update();
        rafRef.current = null;
      });
    }
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative aspect-[4/5] w-full overflow-hidden sm:aspect-[16/9] lg:aspect-[21/9]">
      {/* Anchored to the section's top edge (not centered) and cropped from
          object-top, so the blank wall — not the bottles/beakers — sits
          behind the text, with the extra 12% height below as the
          parallax's scroll buffer. */}
      <div className="absolute inset-x-0 top-0 h-[112%]" style={{ transform: `translateY(-${offset}px)` }}>
        <picture>
          {mobileSet && <source media="(max-width: 767px), (orientation: portrait)" srcSet={mobileSet} />}
          <source srcSet={srcSet} />
          {/* eslint-disable-next-line jsx-a11y/alt-text -- the alt is among the props from next/image's getImageProps */}
          <img {...img} className="object-cover object-top" />
        </picture>
      </div>
      <div className="absolute inset-0 flex items-start px-6 pt-10 sm:px-12 sm:pt-16">
        <div className="max-w-md">
          <h2 className={`font-serif text-3xl leading-tight sm:text-4xl ${light ? "text-cream" : "text-ink"}`}>{banner.heading}</h2>
          {banner.text && <p className={`mt-3 text-sm ${light ? "text-cream/80" : "text-ink-soft"}`}>{banner.text}</p>}
          {banner.ctaText && banner.ctaLink && (
            <Link
              href={banner.ctaLink}
              className={`mt-6 inline-block px-8 py-3 label-caps hover:opacity-90 ${light ? "bg-cream text-ink" : "bg-ink text-cream"}`}
            >
              {banner.ctaText}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
