"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { HeroSlide } from "@/lib/types";

// Same parallax feel as the old single-image Hero (see ParallaxHero.tsx) —
// reimplemented here rather than reused, since ParallaxHero's API only
// ever renders one fixed image and this needs to crossfade between
// several admin-managed slides.
const PARALLAX_SPEED = 0.35;
const AUTO_ADVANCE_MS = 7000;

export function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);
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

  useEffect(() => {
    if (slides.length < 2) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % slides.length), AUTO_ADVANCE_MS);
    return () => clearInterval(timer);
  }, [slides.length]);

  if (slides.length === 0) return null;

  function goTo(i: number) {
    setIndex((i + slides.length) % slides.length);
  }

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {slides.map((slide, i) => {
        const visible = i === index;
        return (
          <div
            key={slide.id}
            aria-hidden={!visible}
            className={`absolute inset-0 transition-opacity duration-[900ms] ease-out ${
              visible ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
          >
            <div
              className="absolute inset-x-0 -top-[15%] h-[130%]"
              style={{ transform: `translateY(${scrollY * PARALLAX_SPEED}px)` }}
            >
              <div className="hero-zoom relative h-full w-full">
                {slide.image && (
                  <Image
                    src={slide.image}
                    alt={slide.heading}
                    fill
                    priority={i === 0}
                    sizes="100vw"
                    className="object-cover"
                  />
                )}
              </div>
            </div>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/45 via-black/15 to-transparent" />

            <div className="relative z-10 flex h-full items-end px-6 pb-24 sm:pb-20">
              <div className="max-w-md">
                <h1 className="font-serif text-4xl leading-tight text-cream sm:text-5xl">{slide.heading}</h1>
                {slide.subtext && <p className="mt-5 text-cream/85">{slide.subtext}</p>}
                {slide.ctaText && slide.ctaLink && (
                  <Link
                    href={slide.ctaLink}
                    className="group relative mt-8 inline-block overflow-hidden bg-ink px-8 py-3 label-caps text-cream transition-all duration-500 ease-out hover:scale-[1.03] hover:bg-royal hover:shadow-lg hover:shadow-royal/30"
                  >
                    <span className="relative z-10">{slide.ctaText}</span>
                    {/* A thin gold sheen that sweeps across on hover — the
                        "luxury touch" rather than a plain opacity fade. */}
                    <span
                      aria-hidden
                      className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-gold-light/50 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
                    />
                  </Link>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {slides.length > 1 && (
        <div className="absolute inset-x-0 bottom-8 z-20 flex items-center justify-center gap-2">
          {slides.map((slide, i) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-6 bg-cream" : "w-1.5 bg-cream/40 hover:bg-cream/70"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
