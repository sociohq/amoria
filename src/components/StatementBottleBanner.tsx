"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLenis } from "lenis/react";

// Homepage-only promo banner for the perfume oils — same
// scroll-linked parallax drift as OurStores.tsx's background video
// (useLenis rather than a raw scroll listener, so it stays in sync with
// the site's own eased smooth-scroll), applied to a still photo instead.
// "View Details" links to the Perfume Oils category via the normal shop
// filter, so it's a real collection page rather than a bespoke one-off.
const PARALLAX_STRENGTH = 0.15;
const IMAGE_SCALE = 1.15;

export function StatementBottleBanner() {
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
      <Image
        src="/banners/1kg-bottle-banner.png"
        alt=""
        fill
        sizes="100vw"
        className="pointer-events-none object-cover"
        style={{ transform: `scale(${IMAGE_SCALE}) translateY(${parallaxOffset}px)` }}
      />

      {/* The photo is already bright and even-toned, so dark ink text
          sitting directly on it (no scrim) matches the source photo's
          own look rather than crushing it under a gradient. */}
      <div className="relative z-10 max-w-lg px-6 sm:px-12 md:px-16">
        <h2 className="font-serif text-3xl leading-tight text-ink sm:text-4xl">
          Discover Our Statement Perfume Oils.
        </h2>
        <p className="mt-4 max-w-sm text-sm text-ink-soft sm:text-base">
          More fragrance. More presence. Discover our perfume oils, crafted for those who want to make a
          statement.
        </p>
        <Link
          href="/shop?category=perfume-oils"
          className="mt-7 inline-block bg-ink px-8 py-3 label-caps text-cream transition-opacity hover:opacity-90"
        >
          View Details
        </Link>
      </div>
    </section>
  );
}
