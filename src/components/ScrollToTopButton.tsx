"use client";

import { useEffect, useState } from "react";
import { useLenis } from "lenis/react";

const SHOW_AFTER_PX = 500;

// A round "back to top" button that fades in once the page has been
// scrolled well past the fold. Sits in the bottom-right corner just above
// the floating Find Your Scent button, and scrolls through Lenis (the
// site's smooth-scroll) so it eases up like every other scroll here.
export function ScrollToTopButton() {
  const lenis = useLenis();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > SHOW_AFTER_PX);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function toTop() {
    if (lenis) lenis.scrollTo(0, { duration: 1.1 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <button
      type="button"
      onClick={toTop}
      aria-label="Back to top"
      tabIndex={visible ? 0 : -1}
      className={`fixed bottom-[4.5rem] right-4 z-40 flex h-10 w-10 items-center justify-center rounded-full bg-ink text-cream shadow-md shadow-ink/20 transition-all duration-300 hover:scale-105 sm:bottom-24 sm:right-6 sm:h-12 sm:w-12 ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
  );
}
