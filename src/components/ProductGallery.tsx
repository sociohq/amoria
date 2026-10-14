"use client";

import { useRef, useState } from "react";
import type { ReactNode } from "react";
import Image from "next/image";

interface GalleryImage {
  id: string;
  url: string;
  altText: string | null;
}

// The product page's photo gallery as a native scroll-snap carousel: on a
// phone the main image can simply be swiped sideways (it used to change
// only by tapping a thumbnail underneath), with dots showing which photo
// you're on; on desktop the same strip is driven by arrow buttons and the
// thumbnails. Scroll position is the source of truth, so a swipe, a
// thumbnail tap and the arrows all stay in step.
export function ProductGallery({
  images,
  name,
  label,
  heart,
}: {
  images: GalleryImage[];
  name: string;
  // Phones: a small pill in the top-right corner (e.g. the concentration) …
  label?: string | null;
  // … and a slot for the wishlist heart in the bottom-right corner.
  heart?: ReactNode;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const frame = useRef<number | null>(null);
  const [active, setActive] = useState(0);
  const many = images.length > 1;

  function onScroll() {
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const el = trackRef.current;
      if (!el || el.clientWidth === 0) return;
      setActive(Math.round(el.scrollLeft / el.clientWidth));
    });
  }

  function goTo(index: number) {
    const el = trackRef.current;
    if (!el) return;
    const next = Math.max(0, Math.min(images.length - 1, index));
    el.scrollTo({ left: next * el.clientWidth, behavior: "smooth" });
    setActive(next);
  }

  return (
    <div>
      <div className="group relative">
        <div
          ref={trackRef}
          onScroll={onScroll}
          className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto overflow-y-hidden overscroll-x-contain"
        >
          {images.map((img, i) => (
            <div
              key={img.id}
              className="relative aspect-[3/4] w-full shrink-0 snap-center bg-[#f3f0f1] lg:aspect-auto lg:h-[calc(100vh-14rem)] lg:bg-cream-dark"
            >
              {img.url ? (
                <Image
                  src={img.url}
                  alt={img.altText ?? name}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover lg:object-contain"
                  priority={i === 0}
                  draggable={false}
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <span className="font-serif text-2xl tracking-widest text-ink-soft">AMORIA</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {many && (
          <>
            <button
              type="button"
              onClick={() => goTo(active - 1)}
              disabled={active === 0}
              aria-label="Previous photo"
              className="absolute left-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink shadow-sm transition-opacity hover:bg-white disabled:opacity-0 lg:flex"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m15 6-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => goTo(active + 1)}
              disabled={active === images.length - 1}
              aria-label="Next photo"
              className="absolute right-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink shadow-sm transition-opacity hover:bg-white disabled:opacity-0 lg:flex"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m9 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <span className="pointer-events-none absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-ink lg:hidden">
              {active + 1} / {images.length}
            </span>
          </>
        )}
        {label && (
          <span className="pointer-events-none absolute right-4 top-4 rounded-full bg-white/95 px-3.5 py-1.5 text-[13px] font-medium text-ink lg:hidden">
            {label}
          </span>
        )}
        {heart && <div className="absolute bottom-4 right-4 lg:hidden">{heart}</div>}
      </div>

      {many && (
        <div className="relative h-[3px] w-full bg-border lg:hidden" aria-hidden>
          <div
            className="absolute inset-y-0 left-0 bg-ink transition-transform duration-300"
            style={{ width: `${100 / images.length}%`, transform: `translateX(${active * 100}%)` }}
          />
        </div>
      )}

      {many && (
        <div className="no-scrollbar mt-4 hidden gap-3 overflow-x-auto lg:flex">
          {images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => goTo(i)}
              aria-label={`Show photo ${i + 1}`}
              // A plain opacity fade reads as the selected thumbnail without
              // a boxed-in ring/frame around it — quieter at this small size.
              className={`relative h-20 w-20 shrink-0 overflow-hidden bg-cream-dark transition-opacity ${
                i === active ? "opacity-100" : "opacity-50 hover:opacity-80"
              }`}
            >
              {img.url && <Image src={img.url} alt={img.altText ?? name} fill sizes="80px" className="object-cover" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
