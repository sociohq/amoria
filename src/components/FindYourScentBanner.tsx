"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";

// The image drifts upward slightly as the section scrolls past — bounded to
// a fixed buffer below the visible frame (the wrapper is exactly that much
// taller than the section) so it never runs out of image to reveal.
const PARALLAX_BUFFER = 0.12; // fraction of the section's own height

export function FindYourScentBanner() {
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
    <section ref={sectionRef} className="relative aspect-[16/9] w-full overflow-hidden sm:aspect-[21/9]">
      {/* Anchored to the section's top edge (not centered) and cropped from
          object-top, so the sky — not the bottles — sits behind the text,
          with the extra 12% height below as the parallax's scroll buffer. */}
      <div className="absolute inset-x-0 top-0 h-[112%]" style={{ transform: `translateY(-${offset}px)` }}>
        <Image
          src="/banners/find-your-scent.png"
          alt="Amoria Mystique, Nocturne, Aurora, Velaris and Solstice"
          fill
          sizes="100vw"
          className="object-cover object-top"
        />
      </div>
      <div className="absolute inset-0 flex items-start px-6 pt-10 sm:px-12 sm:pt-16">
        <div className="max-w-md">
          <h2 className="font-serif text-3xl leading-tight text-ink sm:text-4xl">Find Your Perfect Scent</h2>
          <p className="mt-3 text-sm text-ink-soft">
            Answer a few questions and we&apos;ll match you with fragrances made for exactly who you are.
          </p>
          <Link href="/shop" className="mt-6 inline-block bg-ink px-8 py-3 label-caps text-cream hover:opacity-90">
            Begin the Experience
          </Link>
        </div>
      </div>
    </section>
  );
}
