"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";

// Background moves slower than the page scrolls, giving the classic
// parallax depth illusion. The image wrapper is sized larger than the
// viewport so the translate never reveals an edge.
const PARALLAX_SPEED = 0.35;

export function Hero() {
  const [scrollY, setScrollY] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    function onScroll() {
      if (rafRef.current != null) return;
      rafRef.current = requestAnimationFrame(() => {
        setScrollY(window.scrollY);
        rafRef.current = null;
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden">
      <div
        className="absolute inset-x-0 -top-[15%] h-[130%]"
        style={{ transform: `translateY(${scrollY * PARALLAX_SPEED}px)` }}
      >
        {/* The ken-burns zoom lives on its own inner element so it can
            animate independently of the scroll-driven parallax transform
            above (two transforms on the same element would fight). */}
        <div className="hero-zoom relative h-full w-full">
          <Image src="/hero-banner.jpg" alt="" fill priority sizes="100vw" className="object-cover" />
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/45 via-black/15 to-transparent" />

      <div className="relative z-10 flex h-full items-end px-6 pb-20">
        <div className="max-w-md">
          <h1 className="font-serif text-4xl leading-tight text-cream sm:text-5xl">
            Scent, the way Arabia remembers it.
          </h1>
          <p className="mt-5 text-cream/85">Ouds, attars and signature perfumes crafted for the Gulf, delivered across the UAE.</p>
          <Link href="/shop" className="mt-8 inline-block bg-ink px-8 py-3 label-caps text-cream hover:opacity-90">
            Shop Amoria Signature
          </Link>
        </div>
      </div>
    </section>
  );
}
