"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { getImageProps } from "next/image";
import { HeroSlide } from "@/lib/types";

// Same parallax feel as the old single-image Hero (see ParallaxHero.tsx) —
// reimplemented here rather than reused, since ParallaxHero's API only
// ever renders one fixed image and this needs to crossfade between
// several admin-managed slides.
const PARALLAX_SPEED = 0.35;
const AUTO_ADVANCE_MS = 7000;

// A slide's picture, with an optional portrait version for phones. The browser
// takes the phone picture on narrow screens and the main one everywhere else, so
// a wide desktop picture never has to be squeezed into a tall phone screen.
function HeroPicture({
  src,
  mobileSrc,
  alt,
  priority,
  className,
}: {
  src: string;
  mobileSrc?: string | null;
  alt: string;
  priority: boolean;
  className: string;
}) {
  const common = { alt, fill: true, sizes: "100vw", priority } as const;
  const {
    props: { srcSet, ...img },
  } = getImageProps({ ...common, src });
  const mobileSet = mobileSrc ? getImageProps({ ...common, src: mobileSrc }).props.srcSet : undefined;
  return (
    <picture>
      {mobileSet && <source media="(max-width: 767px)" srcSet={mobileSet} />}
      <source srcSet={srcSet} />
      {/* eslint-disable-next-line jsx-a11y/alt-text -- the alt is among the props from next/image's getImageProps */}
      <img {...img} className={className} />
    </picture>
  );
}

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
    const timer = setInterval(
      () => setIndex((i) => (i + 1) % slides.length),
      AUTO_ADVANCE_MS,
    );
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
        const banner = Boolean(slide.imageOnly);
        return (
          <div
            key={slide.id}
            aria-hidden={!visible}
            className={`absolute inset-0 transition-opacity duration-[900ms] ease-out ${
              visible ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
          >
            {/* Every slide's picture — banners included — sits in the same parallax + slow-zoom box. */}
            <div
              className="absolute inset-x-0 -top-[15%] h-[130%]"
              style={{ transform: `translateY(${scrollY * PARALLAX_SPEED}px)` }}
            >
              <div className="hero-zoom relative h-full w-full">
                {slide.image && (
                  <HeroPicture
                    src={slide.image}
                    mobileSrc={slide.mobileImage}
                    alt={banner ? "" : slide.heading}
                    priority={i === 0}
                    className="object-cover"
                  />
                )}
              </div>
            </div>
            {!banner && (
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/45 via-black/15 to-transparent" />
            )}

            {banner ? (
              <>
                {/* A soft dark shade across the top keeps the header's logo and menu readable over the picture. */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/50 via-black/20 to-transparent"
                />
                <h1 className="sr-only">{slide.heading}</h1>
                {slide.ctaLink && (
                  <Link
                    href={slide.ctaLink}
                    aria-label={slide.ctaText || slide.heading}
                    className="absolute inset-0 z-10"
                  />
                )}
              </>
            ) : (
              <div className="relative z-10 flex h-full items-end px-6 pb-24 sm:pb-20">
                <div className="max-w-md">
                  <h1 className="font-serif text-4xl leading-tight text-cream sm:text-5xl">
                    {slide.heading}
                  </h1>
                  {slide.subtext && (
                    <p className="mt-5 text-cream/85">{slide.subtext}</p>
                  )}
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
            )}
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
                i === index
                  ? "w-6 bg-cream"
                  : "w-1.5 bg-cream/40 hover:bg-cream/70"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
