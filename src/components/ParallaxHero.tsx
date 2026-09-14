"use client";

import { useEffect, useRef, useState, ReactNode } from "react";
import Image from "next/image";

// Background moves slower than the page scrolls, giving the classic
// parallax depth illusion. The image wrapper is sized larger than the
// section so the translate never reveals an edge. Shared by Hero.tsx (the
// homepage) and any other full-bleed hero that wants the same effect
// (see our-story/page.tsx) rather than each reimplementing the scroll math.
const PARALLAX_SPEED = 0.35;

interface ParallaxHeroProps {
  image: string;
  imageAlt?: string;
  heightClassName?: string;
  overlayClassName?: string;
  contentClassName?: string;
  priority?: boolean;
  children: ReactNode;
}

export function ParallaxHero({
  image,
  imageAlt = "",
  heightClassName = "h-screen",
  overlayClassName,
  contentClassName = "flex h-full items-end px-6 pb-20",
  priority = true,
  children,
}: ParallaxHeroProps) {
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
    <section className={`relative w-full overflow-hidden ${heightClassName}`}>
      <div
        className="absolute inset-x-0 -top-[15%] h-[130%]"
        style={{ transform: `translateY(${scrollY * PARALLAX_SPEED}px)` }}
      >
        {/* The ken-burns zoom lives on its own inner element so it can
            animate independently of the scroll-driven parallax transform
            above (two transforms on the same element would fight). */}
        <div className="hero-zoom relative h-full w-full">
          <Image src={image} alt={imageAlt} fill priority={priority} sizes="100vw" className="object-cover" />
        </div>
      </div>

      {overlayClassName && <div className={`pointer-events-none absolute inset-0 ${overlayClassName}`} />}

      <div className={`relative z-10 ${contentClassName}`}>{children}</div>
    </section>
  );
}
