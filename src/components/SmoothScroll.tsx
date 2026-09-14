"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { ReactNode, useEffect } from "react";
import { usePathname } from "next/navigation";

// Next.js normally scrolls the window to the top on navigation, but that's
// a plain `window.scrollTo` — Lenis owns the real scroll position via its
// own RAF loop, so that call gets overridden a frame later and a new page
// opens wherever the previous page's scroll happened to be. Snapping Lenis
// itself to 0 (immediately, no easing) on every route change fixes it.
function ScrollToTopOnNavigate() {
  const pathname = usePathname();
  const lenis = useLenis();

  useEffect(() => {
    lenis?.scrollTo(0, { immediate: true });
  }, [pathname, lenis]);

  return null;
}

// Wraps the whole app in a single Lenis instance (root mode — no extra
// wrapper DOM, it just smooths the real window scroll) so every page has
// the same eased, weighted scroll feel instead of the browser's default
// abrupt one. Position: fixed/sticky elements (the header, the product
// gallery, Our Story's text panels) keep working normally since this
// animates the real scroll position rather than faking one with a CSS
// transform. Respects prefers-reduced-motion out of the box — Lenis's own
// respectReducedMotion option defaults to true.
export function SmoothScroll({ children }: { children: ReactNode }) {
  return (
    <ReactLenis root>
      <ScrollToTopOnNavigate />
      {children}
    </ReactLenis>
  );
}
