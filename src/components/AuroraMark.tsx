"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

// Scrolling this far down the page counts as "spent some time on the page"
// — past the hero on most pages — before the circle introduces itself.
const EXPAND_SCROLL_PX = 500;
// How long the pill stays open before tucking itself back into a circle,
// and how long it then waits before reintroducing itself.
const HOLD_MS = 4000;
const IDLE_MS = 10000;
// Same invitation, reworded each time it resurfaces rather than repeating
// itself verbatim.
const PHRASES = ["Find Your Scent", "Discover Your Scent", "Explore Your Scent"];

// Timing based on a quick look at how Material's extended-FAB and similar
// expanding-pill patterns handle this: short (250–400ms) durations, an
// expo-out curve for the reveal so it starts fast and settles gently, and
// asymmetric behaviour between the two directions — the label only fades in
// once the pill has already made room for it, but fades out immediately on
// collapse (before the container has fully shrunk) so text never spills
// past the shrinking edge.
const EASE_OUT = "cubic-bezier(0.16, 1, 0.3, 1)";
const EASE_IN = "cubic-bezier(0.4, 0, 1, 1)";
const EXPAND_TRANSITION = `width 380ms ${EASE_OUT}, margin-right 380ms ${EASE_OUT}, opacity 220ms ${EASE_OUT} 160ms`;
const COLLAPSE_TRANSITION = `width 260ms ${EASE_IN}, margin-right 260ms ${EASE_IN}, opacity 120ms ${EASE_IN}`;

// Floating bottom-right mark with a recurring "aurora" gradient shimmer —
// the icon itself is used as a CSS mask (its solid black shapes become the
// visible region) so the gradient can move across it, rather than being a
// flat single-colour icon. The moving gradient stays confined to the icon's
// own shape (no glow/blur bleeding outside it).
//
// Starts as a plain circle. Once the visitor has scrolled far enough down
// the page, it opens into a pill with a short invitation next to the icon,
// then tucks itself back into a circle after a few seconds and reopens
// periodically with a differently-worded version of the same invitation —
// a gentle, occasional nudge rather than a persistent label or a one-off
// reveal. Functionality is intentionally a no-op for now; the user will
// specify what it should do on click in a later request.
export function AuroraMark() {
  const [started, setStarted] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [phraseIndex, setPhraseIndex] = useState(0);

  // The current phrase's natural width is measured off-screen and re-read
  // synchronously (before paint) every time it changes, rather than
  // snapshotting all of them once on mount — a one-shot measurement raced
  // the web font finishing its swap and could freeze at 0. Re-measuring
  // once document.fonts.ready resolves covers that same race on the very
  // first cycle too.
  const measureRef = useRef<HTMLSpanElement>(null);
  const [currentWidth, setCurrentWidth] = useState(0);

  useLayoutEffect(() => {
    setCurrentWidth(measureRef.current?.getBoundingClientRect().width ?? 0);
  }, [phraseIndex]);

  useEffect(() => {
    document.fonts?.ready?.then(() => {
      setCurrentWidth(measureRef.current?.getBoundingClientRect().width ?? 0);
    });
  }, []);

  // First reveal is scroll-triggered.
  useEffect(() => {
    if (started) return;
    function onScroll() {
      if (window.scrollY > EXPAND_SCROLL_PX) {
        setStarted(true);
        setExpanded(true);
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [started]);

  // From then on, it alternates on its own: hold open, tuck away, wait,
  // reopen with the next phrase — indefinitely, while mounted.
  useEffect(() => {
    if (!started) return;
    const delay = expanded ? HOLD_MS : IDLE_MS;
    const timer = setTimeout(() => {
      if (expanded) {
        setExpanded(false);
      } else {
        setPhraseIndex((i) => (i + 1) % PHRASES.length);
        setExpanded(true);
      }
    }, delay);
    return () => clearTimeout(timer);
  }, [started, expanded]);

  const width = expanded ? currentWidth : 0;

  return (
    <button
      type="button"
      aria-label={PHRASES[phraseIndex]}
      className="group fixed bottom-6 right-6 z-40 inline-flex h-14 items-center rounded-full bg-white py-1.5 pr-1.5 shadow-sm shadow-ink/10 transition-[padding-left] duration-300 ease-out hover:scale-105"
      style={{
        paddingLeft: expanded ? "1.125rem" : "0.375rem",
        transitionTimingFunction: expanded ? EASE_OUT : EASE_IN,
        transitionDuration: expanded ? "380ms" : "260ms",
      }}
    >
      <span
        aria-hidden
        className="aurora-text overflow-hidden whitespace-nowrap text-[13px] font-medium"
        style={{
          width,
          marginRight: expanded ? 10 : 0,
          opacity: expanded ? 1 : 0,
          transition: expanded ? EXPAND_TRANSITION : COLLAPSE_TRANSITION,
        }}
      >
        {PHRASES[phraseIndex]}
      </span>
      {/* Off-screen twin of the current phrase, purely to measure its
          natural width (see the effect above) — never shown. */}
      <span
        aria-hidden
        ref={measureRef}
        className="pointer-events-none fixed -left-[9999px] -top-[9999px] whitespace-nowrap text-[13px] font-medium"
      >
        {PHRASES[phraseIndex]}
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
