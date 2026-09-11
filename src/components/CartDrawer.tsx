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
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <p className="font-serif text-xl text-ink">
            Your Cart {itemCount > 0 && <span className="text-base text-ink-soft">({itemCount})</span>}
          </p>
          <button onClick={closeDrawer} aria-label="Close cart" className="text-ink-soft hover:text-ink">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {items.length > 0 && <ShippingProgress subtotal={subtotal} />}

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
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
            <div className="flex-1 overflow-y-auto px-6">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 border-b border-border py-5">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden bg-cream-dark">
                    {item.image && (
                      <Image src={item.image} alt={item.productName} fill sizes="80px" className="object-cover" />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col">
                    <div className="flex justify-between gap-2">
                      <Link href={`/product/${item.productSlug}`} onClick={closeDrawer} className="text-sm text-ink hover:text-emerald">
                        {item.productName}
                      </Link>
                      <p className="whitespace-nowrap text-sm text-ink">{formatAed(item.lineTotal)}</p>
                    </div>
                    <p className="text-xs text-ink-soft">{item.variantSize}</p>
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <div className="flex items-center border border-border">
                        <button
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="px-2.5 py-1 text-ink-soft"
                        >
                          −
                        </button>
                        <span className="w-6 text-center text-xs">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2.5 py-1 text-ink-soft">
                          +
                        </button>
                      </div>
                      <button onClick={() => removeItem(item.id)} className="text-xs text-ink-soft underline hover:text-crimson">
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-border px-6 py-5">
              <div className="mb-4 flex justify-between text-ink">
                <span>Subtotal</span>
                <span>{formatAed(subtotal)}</span>
              </div>
              <Link
                href="/checkout"
                onClick={closeDrawer}
                className="block bg-emerald py-3 text-center label-caps text-cream hover:opacity-90"
              >
                Checkout
              </Link>
              <Link
                href="/cart"
                onClick={closeDrawer}
                className="mt-2 block text-center text-sm text-ink-soft underline hover:text-emerald"
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
