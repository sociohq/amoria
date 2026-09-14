"use client";

import { ReactLenis } from "lenis/react";
import { ReactNode } from "react";

// Wraps the whole app in a single Lenis instance (root mode — no extra
// wrapper DOM, it just smooths the real window scroll) so every page has
// the same eased, weighted scroll feel instead of the browser's default
// abrupt one. Position: fixed/sticky elements (the header, the product
// gallery, Our Story's text panels) keep working normally since this
// animates the real scroll position rather than faking one with a CSS
// transform. Respects prefers-reduced-motion out of the box — Lenis's own
// respectReducedMotion option defaults to true.
export function SmoothScroll({ children }: { children: ReactNode }) {
  return <ReactLenis root>{children}</ReactLenis>;
}
