"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { GoldenFridayOffer, offerCondition, offerEnds, offerHeadline } from "@/lib/goldenFriday";
import { CopyCodeButton } from "./CopyCodeButton";

const DISMISSED_KEY = "amoria-golden-friday-dismissed";
export const OFFER_POPUP_CLOSED_EVENT = "amoria:offer-popup-closed";

declare global {
  interface Window {
    // True from the moment the offer popup is going to show until it is closed. The welcome popup waits on it so
    // the two never stack: the offer comes first, the welcome offer follows once it is closed.
    __amoriaOfferPopupBusy?: boolean;
  }
}

// The Golden Friday popup: opens as soon as a visitor lands (once per visit) while the GOLDEN25 coupon is live.
// The offer comes from the coupon itself (see lib/goldenFriday.ts), so with the coupon off or expired this
// renders nothing.
export function GoldenFridayPopup({ offer }: { offer: GoldenFridayOffer | null }) {
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!offer) return;
    let seen = false;
    try {
      seen = sessionStorage.getItem(DISMISSED_KEY) === "1";
    } catch {
      // Storage blocked: just show it.
    }
    if (seen) return;
    window.__amoriaOfferPopupBusy = true;
    setReady(true);
    const timer = setTimeout(() => setOpen(true), 600);
    return () => clearTimeout(timer);
  }, [offer]);

  function close() {
    setOpen(false);
    try {
      sessionStorage.setItem(DISMISSED_KEY, "1");
    } catch {
      // It may show again on the next page load.
    }
    window.__amoriaOfferPopupBusy = false;
    window.dispatchEvent(new Event(OFFER_POPUP_CLOSED_EVENT));
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!offer || !ready) return null;

  return (
    <>
      <div
        onClick={close}
        className={`fixed inset-0 z-50 bg-black/60 transition-opacity duration-300 ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Golden Friday offer"
        className={`fixed left-1/2 top-1/2 z-50 w-[92vw] max-w-3xl -translate-x-1/2 transition-all duration-300 ${
          open ? "pointer-events-auto -translate-y-1/2 opacity-100" : "pointer-events-none -translate-y-[45%] opacity-0"
        }`}
      >
        <div className="grid max-h-[92dvh] grid-cols-1 overflow-y-auto shadow-2xl sm:grid-cols-2">
          {/* The gold half: the size of the offer, big. */}
          <div
            className="relative flex min-h-[11rem] flex-col items-center justify-center overflow-hidden px-6 py-8 text-center text-ink sm:min-h-[26rem]"
            style={{ background: "linear-gradient(145deg, #e6cf9f 0%, #c9a566 48%, #a98445 100%)" }}
          >
            <div aria-hidden className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full border border-ink/15" />
            <div aria-hidden className="pointer-events-none absolute -bottom-20 -right-12 h-64 w-64 rounded-full border border-ink/15" />
            <p className="label-caps relative text-ink/70">Golden Friday</p>
            <p className="relative mt-2 font-serif text-7xl leading-none sm:text-8xl">
              {offer.type === "PERCENTAGE" ? `${offer.value}%` : `AED ${offer.value}`}
            </p>
            <p className="relative mt-1 font-serif text-3xl tracking-[0.3em]">OFF</p>
          </div>

          <div className="relative flex flex-col justify-center overflow-hidden bg-ink px-8 py-10 sm:px-10 sm:py-12">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 right-0 w-3/4"
              style={{ background: "radial-gradient(ellipse 80% 100% at 100% 50%, rgba(212,180,131,0.4), transparent 70%)" }}
            />
            <div className="relative">
              <button
                onClick={close}
                aria-label="Close"
                className="absolute right-0 top-0 text-cream/70 transition-colors hover:text-cream"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                  <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
                </svg>
              </button>

              <p className="label-caps text-gold-light">Limited-time offer</p>
              <h2 className="mt-3 font-serif text-4xl leading-tight text-cream sm:text-5xl">Golden Friday</h2>
              <p className="mt-3 text-sm text-cream/80">
                {offerHeadline(offer)} {offerCondition(offer)}. Use this code at checkout:
              </p>

              <div className="mt-5">
                <CopyCodeButton code={offer.code} />
              </div>

              <Link
                href="/shop"
                onClick={close}
                className="mt-4 block w-full bg-gold px-8 py-3 text-center label-caps text-ink transition-opacity hover:opacity-90"
              >
                Shop now
              </Link>
              {offerEnds(offer) && <p className="mt-3 text-center text-xs text-cream/55">{offerEnds(offer)}</p>}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
