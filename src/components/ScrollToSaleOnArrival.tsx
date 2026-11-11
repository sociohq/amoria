"use client";

import { useEffect, useRef } from "react";
import { useLenis } from "lenis/react";
import { GOTO_SALE_KEY, glideToSale } from "./SalePopup";

// Sits inside the homepage sale section. When a visitor pressed "Check the offers" in the sale popup on some other
// page, the homepage opens and this glides down to the section (after the page's own scroll-to-top has settled).
export function ScrollToSaleOnArrival() {
  const lenis = useLenis();
  const wanted = useRef<boolean | null>(null);

  // Read the flag once (the effect below re-runs when Lenis becomes available and must not lose it).
  useEffect(() => {
    if (wanted.current !== null) return;
    try {
      wanted.current = sessionStorage.getItem(GOTO_SALE_KEY) === "1";
      if (wanted.current) sessionStorage.removeItem(GOTO_SALE_KEY);
    } catch {
      wanted.current = false;
    }
  }, []);

  useEffect(() => {
    if (!wanted.current || !lenis) return;
    const timer = setTimeout(() => {
      wanted.current = false;
      glideToSale(lenis);
    }, 700);
    return () => clearTimeout(timer);
  }, [lenis]);

  return null;
}
