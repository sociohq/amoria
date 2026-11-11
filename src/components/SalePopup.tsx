"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useLenis } from "lenis/react";
import { Category } from "@/lib/types";

const DISMISSED_KEY = "amoria-sale-popup-dismissed";
export const GOTO_SALE_KEY = "amoria-goto-sale";
export const SALE_POPUP_CLOSED_EVENT = "amoria:sale-popup-closed";
const SALE_IMAGE = "/offers/sale-1111.webp";

type LenisLike = { scrollTo: (target: HTMLElement, opts: { offset: number; duration: number }) => void } | null | undefined;

// Glides to the homepage sale section, then checks it really landed under the header: images loading above it can
// still change the page height mid-glide, so up to two corrections follow if it ended up off.
export function glideToSale(lenis: LenisLike) {
  const go = (attempt: number) => {
    const target = document.getElementById("sale");
    if (!target) return;
    if (lenis) lenis.scrollTo(target, { offset: -90, duration: attempt === 0 ? 1.4 : 0.6 });
    else target.scrollIntoView({ behavior: "smooth" });
    if (attempt < 2) {
      setTimeout(() => {
        const top = document.getElementById("sale")?.getBoundingClientRect().top ?? 90;
        if (Math.abs(top - 90) > 40) go(attempt + 1);
      }, attempt === 0 ? 1700 : 900);
    }
  };
  go(0);
}

declare global {
  interface Window {
    // True from the moment the sale popup is going to show until it is closed. The welcome popup waits on it so
    // the two never stack: the sale comes first, the welcome offer follows once it is closed.
    __amoriaSalePopupBusy?: boolean;
  }
}

// The sale popup: opens as soon as a visitor lands (once per visit) while any category is on sale (it has a Sale
// picture and a Discount % above 0 in the admin), with the offer artwork on the left and what the offer is on the
// right. "Check the offers" closes it and glides down to the homepage "11.11 Offer" section (or opens the homepage
// there from any other page). With no sale running it renders nothing, so it ends together with the sale.
export function SalePopup({ categories }: { categories: Category[] }) {
  const onSale = categories.filter((c) => c.saleImage && (c.discountPercent ?? 0) > 0);
  const hasSale = onSale.length > 0;
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [waited, setWaited] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const lenis = useLenis();

  useEffect(() => {
    if (!hasSale) return;
    let seen = false;
    try {
      seen = sessionStorage.getItem(DISMISSED_KEY) === "1";
    } catch {
      // Storage blocked: just show it.
    }
    if (seen) return;
    window.__amoriaSalePopupBusy = true;
    setReady(true);
    // Opens as soon as the picture is in (never a blank half), but not later than 3 seconds after landing.
    const timer = setTimeout(() => setWaited(true), 3000);
    return () => clearTimeout(timer);
  }, [hasSale]);

  useEffect(() => {
    if (!ready || open || dismissed) return;
    if (imageLoaded || waited) {
      const timer = setTimeout(() => setOpen(true), 300);
      return () => clearTimeout(timer);
    }
  }, [ready, imageLoaded, waited, open, dismissed]);

  function close(toOffers = false) {
    setOpen(false);
    setDismissed(true);
    try {
      sessionStorage.setItem(DISMISSED_KEY, "1");
    } catch {
      // Nothing to do — it may show again on the next page load.
    }
    window.__amoriaSalePopupBusy = false;
    window.dispatchEvent(new CustomEvent(SALE_POPUP_CLOSED_EVENT, { detail: { toOffers } }));
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function checkOffers() {
    close(true);
    // Welcome popup (if it opens next) must not cover the sale, so the scroll waits for the close animation.
    if (pathname === "/") {
      const target = document.getElementById("sale");
      if (target) setTimeout(() => glideToSale(lenis), 250);
    } else {
      try {
        sessionStorage.setItem(GOTO_SALE_KEY, "1");
      } catch {
        // Without storage the homepage simply opens at the top.
      }
      router.push("/");
    }
  }

  if (!ready) return null;

  const top = Math.max(...onSale.map((c) => c.discountPercent ?? 0));

  return (
    <>
      <div
        onClick={() => close()}
        className={`fixed inset-0 z-50 bg-black/60 transition-opacity duration-300 ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="11.11 sale offer"
        className={`fixed left-1/2 top-1/2 z-50 w-[92vw] max-w-3xl -translate-x-1/2 transition-all duration-300 ${
          open ? "pointer-events-auto -translate-y-1/2 opacity-100" : "pointer-events-none -translate-y-[45%] opacity-0"
        }`}
      >
        <div className="grid max-h-[92dvh] grid-cols-1 overflow-y-auto shadow-2xl sm:grid-cols-2">
          <div className="relative h-80 bg-[#ead9bf] sm:h-auto sm:min-h-[30rem]">
            <Image
              src={SALE_IMAGE}
              alt="11/11 Offer: Amoria Oud & Roses and Amoria Velaris perfumes with a copper ribbon"
              fill
              sizes="(min-width: 640px) 384px, 92vw"
              priority
              onLoad={() => setImageLoaded(true)}
              className="object-cover object-top sm:object-[50%_30%]"
            />
          </div>

          <div className="relative flex flex-col justify-center overflow-hidden bg-ink px-8 py-10 sm:px-10 sm:py-12">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 right-0 w-3/4"
              style={{ background: "radial-gradient(ellipse 80% 100% at 100% 50%, rgba(212,180,131,0.4), transparent 70%)" }}
            />
            <div className="relative">
              <button
                onClick={() => close()}
                aria-label="Close"
                className="absolute right-0 top-0 text-cream/70 transition-colors hover:text-cream"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                  <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
                </svg>
              </button>

              <p className="label-caps text-gold-light">Limited-time sale</p>
              <h2 className="mt-3 font-serif text-4xl leading-tight text-cream sm:text-5xl">11.11 Offer</h2>
              <p className="mt-3 text-sm text-cream/75">
                {onSale.length > 1 ? `Up to ${top}% off` : `${top}% off`} for a limited time. The sale price is already on every
                product, no code needed.
              </p>

              <ul className="mt-5 space-y-2">
                {onSale.map((c) => (
                  <li key={c.id} className="flex items-center gap-3 text-cream">
                    <span className="w-14 font-serif text-2xl leading-none text-gold-light">{c.discountPercent}%</span>
                    <span className="text-sm">off {c.name}</span>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={checkOffers}
                className="mt-7 w-full bg-gold px-8 py-3 label-caps text-ink transition-opacity hover:opacity-90"
              >
                Check the offers
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
