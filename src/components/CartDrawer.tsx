"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/lib/cart-context";
import { formatAed } from "@/lib/money";
import { ShippingProgress } from "./ShippingProgress";

export function CartDrawer() {
  const { items, subtotal, itemCount, drawerOpen, closeDrawer, updateQuantity, removeItem } = useCart();

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={closeDrawer}
        className={`fixed inset-0 z-50 bg-black/40 transition-opacity duration-300 ${
          drawerOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Panel */}
      <div
        className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-cream shadow-xl transition-transform duration-300 ${
          drawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-label="Cart"
      >
        <div className="flex items-center justify-between border-b border-border px-8 py-7">
          <p className="font-serif text-2xl text-ink">
            Your Cart
            {itemCount > 0 && <sup className="ml-1 text-sm font-sans text-ink-soft">{itemCount}</sup>}
          </p>
          <button onClick={closeDrawer} aria-label="Close cart" className="text-ink-soft hover:text-ink">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
              <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {items.length > 0 && <ShippingProgress subtotal={subtotal} />}

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
            <p className="text-ink-soft">Your cart is empty.</p>
            <Link
              href="/shop"
              onClick={closeDrawer}
              className="border border-ink px-6 py-2.5 label-caps text-ink hover:bg-ink hover:text-cream"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <>
            {/* data-lenis-prevent stops the site's global Lenis smooth-scroll
                from hijacking wheel/touch input here and scrolling the page
                behind the drawer instead of this item list; overscroll-contain
                is the same fix for native scroll chaining once the list hits
                its own top/bottom. themed-scroll swaps the bulky default OS
                scrollbar for a slim, on-brand one (same class the Find Your
                Scent chat panel uses). */}
            <div data-lenis-prevent className="themed-scroll flex-1 overflow-y-auto overscroll-contain px-8">
              {items.map((item) => (
                <div key={item.id} className="flex gap-5 border-b border-border py-7">
                  <div className="relative h-28 w-28 shrink-0 overflow-hidden bg-cream-dark">
                    {item.image && (
                      <Image src={item.image} alt={item.productName} fill sizes="112px" className="object-cover" />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col">
                    <div className="flex justify-between gap-3">
                      <Link
                        href={`/product/${item.productSlug}`}
                        onClick={closeDrawer}
                        className="text-sm font-medium text-ink hover:text-royal"
                      >
                        {item.productName}
                      </Link>
                      <p className="whitespace-nowrap text-sm text-ink">{formatAed(item.lineTotal)}</p>
                    </div>
                    <p className="mt-1 text-xs text-ink-soft">{item.variantSize}</p>

                    <div className="mt-auto flex items-center justify-between pt-4">
                      <div className="flex items-center gap-4 text-sm text-ink">
                        <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))} className="text-ink-soft hover:text-ink">
                          −
                        </button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="text-ink-soft hover:text-ink">
                          +
                        </button>
                      </div>
                      <button onClick={() => removeItem(item.id)} className="text-xs text-ink-soft underline underline-offset-2 hover:text-crimson">
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-border px-8 py-7">
              <div className="mb-4 flex justify-between text-ink">
                <span>Subtotal</span>
                <span>{formatAed(subtotal)}</span>
              </div>
              <Link
                href="/checkout"
                onClick={closeDrawer}
                className="block bg-royal py-4 text-center label-caps text-cream hover:opacity-90"
              >
                Checkout
              </Link>
              <Link
                href="/cart"
                onClick={closeDrawer}
                className="mt-3 block text-center text-sm text-ink-soft underline hover:text-royal"
              >
                View Full Cart
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  );
}
