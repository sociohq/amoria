"use client";

import { useEffect, useRef, useState } from "react";

// Scrolling this far down the page counts as "spent some time on the page"
// — past the hero on most pages — before the circle introduces itself.
const EXPAND_SCROLL_PX = 500;

// Floating bottom-right mark with a recurring "aurora" gradient shimmer —
// the icon itself is used as a CSS mask (its solid black shapes become the
// visible region) so the gradient can move across it, rather than being a
// flat single-colour icon. The moving gradient stays confined to the icon's
// own shape (no glow/blur bleeding outside it).
//
// Starts as a plain circle. Once the visitor has scrolled far enough down
// the page, it grows into a pill with a "Find Your Scent" label next to the
// icon — same rounded-full shape throughout, it just reads as a pill once
// there's more content than the icon alone to round around. Stays expanded
// afterwards rather than collapsing back, so the label doesn't flicker in
// and out while scrolling. Functionality is intentionally a no-op for now;
// the user will specify what it should do on click in a later request.
export function AuroraMark() {
  const [expanded, setExpanded] = useState(false);
  const textRef = useRef<HTMLSpanElement>(null);
  // Measured once on mount so the width transition below animates to the
  // label's real size instead of an eyeballed guess — same scrollWidth
  // technique Accordion.tsx / FaqItem use for height.
  const [textWidth, setTextWidth] = useState(0);

  useEffect(() => {
    setTextWidth(textRef.current?.scrollWidth ?? 0);
  }, []);

  useEffect(() => {
    if (expanded) return;
    function onScroll() {
      if (window.scrollY > EXPAND_SCROLL_PX) {
        setExpanded(true);
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [expanded]);

  return (
    <button
      type="button"
      aria-label="Find Your Scent"
      className="group fixed bottom-6 right-6 z-40 inline-flex h-14 items-center rounded-full bg-white py-1.5 pr-1.5 shadow-md shadow-ink/10 transition-[padding-left] duration-500 ease-out hover:scale-105"
      style={{ paddingLeft: expanded ? "1.125rem" : "0.375rem" }}
    >
      <span
        ref={textRef}
        className="overflow-hidden whitespace-nowrap text-sm font-medium text-ink transition-[width,margin-right] duration-500 ease-out"
        style={{ width: expanded ? textWidth : 0, marginRight: expanded ? 10 : 0 }}
      >
        Find Your Scent
      </span>
      <span
        aria-hidden
        className="aurora-mark relative h-11 w-11 shrink-0"
        style={{
          WebkitMaskImage: "url(/icons/amoria-mark.svg)",
          maskImage: "url(/icons/amoria-mark.svg)",
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          WebkitMaskPosition: "center",
          maskPosition: "center",
          WebkitMaskSize: "contain",
          maskSize: "contain",
        }}
      />
    </button>
  );
}
