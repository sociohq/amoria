"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { getImageProps } from "next/image";
import { useLenis } from "lenis/react";
import { PromoBannerData } from "@/lib/promoBanner";

// Homepage-only promo banner for the perfume oils — same
// scroll-linked parallax drift as OurStores.tsx's background video
// (useLenis rather than a raw scroll listener, so it stays in sync with
// the site's own eased smooth-scroll), applied to a still photo instead.
// The picture, wording and button come from admin → Statement Banner; with no picture uploaded the one built
// into the site is used.
const PARALLAX_STRENGTH = 0.15;
const IMAGE_SCALE = 1.15;
const BUILT_IN_IMAGE = "/banners/1kg-bottle-banner.png";

export function StatementBottleBanner({ banner }: { banner: PromoBannerData }) {
  const light = banner.textTone === "light";
  const common = { alt: "", fill: true, sizes: "100vw" } as const;
  const {
    props: { srcSet, ...img },
  } = getImageProps({ ...common, src: banner.image ?? BUILT_IN_IMAGE });
  const mobileSet = banner.mobileImage ? getImageProps({ ...common, src: banner.mobileImage }).props.srcSet : undefined;
  const sectionRef = useRef<HTMLElement>(null);
  const [parallaxOffset, setParallaxOffset] = useState(0);

  useLenis(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = sectionRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const distanceFromCenter = rect.top + rect.height / 2 - window.innerHeight / 2;
    // The scale-up above only buys ((IMAGE_SCALE - 1) / 2) * height of
    // headroom before an edge is exposed — distanceFromCenter can run far
    // past that while the section is still entering/leaving the viewport,
    // so the raw offset needs clamping to that same headroom rather than
    // being applied straight through.
    const maxOffset = ((IMAGE_SCALE - 1) / 2) * rect.height;
    const offset = Math.max(-maxOffset, Math.min(maxOffset, distanceFromCenter * PARALLAX_STRENGTH));
    setParallaxOffset(offset);
  });

  return (
    <section ref={sectionRef} className="relative flex min-h-[520px] items-center overflow-hidden bg-cream-dark sm:min-h-[600px]">
      {/* Scaled up beyond the section's own bounds so the parallax
          translate never exposes an edge. */}
      <picture>
        {mobileSet && <source media="(max-width: 767px), (orientation: portrait)" srcSet={mobileSet} />}
        <source srcSet={srcSet} />
        {/* eslint-disable-next-line jsx-a11y/alt-text -- the alt is among the props from next/image's getImageProps */}
        <img
          {...img}
          className="pointer-events-none object-cover"
          style={{ ...img.style, transform: `scale(${IMAGE_SCALE}) translateY(${parallaxOffset}px)` }}
        />
      </picture>

      {/* The photo is already bright and even-toned, so dark ink text
          sitting directly on it (no scrim) matches the source photo's
          own look rather than crushing it under a gradient. */}
      <div className="relative z-10 max-w-lg px-6 sm:px-12 md:px-16">
        <h2 className={`font-serif text-3xl leading-tight sm:text-4xl ${light ? "text-cream" : "text-ink"}`}>
          {banner.heading}
        </h2>
        {banner.text && (
          <p className={`mt-4 max-w-sm text-sm sm:text-base ${light ? "text-cream/80" : "text-ink-soft"}`}>{banner.text}</p>
        )}
        {banner.ctaText && banner.ctaLink && (
          <Link
            href={banner.ctaLink}
            className={`mt-7 inline-block px-8 py-3 label-caps transition-opacity hover:opacity-90 ${
              light ? "bg-cream text-ink" : "bg-ink text-cream"
            }`}
          >
            {banner.ctaText}
          </Link>
        )}
      </div>
    </section>
  );
}
