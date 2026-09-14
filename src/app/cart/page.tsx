"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";
import { useAuthDrawer } from "@/lib/auth-drawer-context";
import { formatAed } from "@/lib/money";

export default function CartPage() {
  const { items, subtotal, loading, updateQuantity, removeItem } = useCart();
  const { user } = useAuth();
  const { openDrawer: openAuthDrawer } = useAuthDrawer();
  const [busyId, setBusyId] = useState<string | null>(null);

  async function withBusy(id: string, fn: () => Promise<void>) {
    setBusyId(id);
    try {
      await fn();
    } finally {
      setBusyId(null);
    }
  }

  if (loading) {
    return <div className="mx-auto max-w-3xl px-6 py-20 text-center text-ink-soft">Loading your cart…</div>;
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h1 className="font-serif text-2xl text-ink">Your cart is empty</h1>
        <Link href="/shop" className="mt-6 inline-block border border-ink px-8 py-3 label-caps text-ink hover:bg-ink hover:text-cream">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl px-6 py-12">
      <h1 className="mb-8 font-serif text-3xl text-ink">Your Cart</h1>

      <div className="divide-y divide-border border-y border-border">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-4 py-5">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden bg-cream-dark">
              {item.image && <Image src={item.image} alt={item.productName} fill sizes="80px" className="object-cover" />}
            </div>
            <div className="flex-1">
              <Link href={`/product/${item.productSlug}`} className="text-sm text-ink hover:text-royal">
                {item.productName}
              </Link>
              <p className="text-xs text-ink-soft">{item.variantSize}</p>
              <p className="mt-1 text-sm text-ink">{formatAed(item.price)}</p>
            </div>
            <div className="flex items-center border border-border">
              <button
                disabled={busyId === item.id}
                onClick={() => withBusy(item.id, () => updateQuantity(item.id, Math.max(1, item.quantity - 1)))}
                className="px-3 py-2 text-ink-soft"
              >
                −
              </button>
              <span className="w-8 text-center text-sm">{item.quantity}</span>
              <button
                disabled={busyId === item.id}
                onClick={() => withBusy(item.id, () => updateQuantity(item.id, item.quantity + 1))}
                className="px-3 py-2 text-ink-soft"
              >
                +
              </button>
            </div>
            <p className="w-24 text-right text-sm text-ink">{formatAed(item.lineTotal)}</p>
            <button
              disabled={busyId === item.id}
              onClick={() => withBusy(item.id, () => removeItem(item.id))}
              className="text-ink-soft hover:text-crimson"
              aria-label="Remove"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-end">
        <div className="w-full max-w-xs space-y-3">
          <div className="flex justify-between text-ink">
            <span>Subtotal</span>
            <span>{formatAed(subtotal)}</span>
          </div>
          <p className="text-xs text-ink-soft">Shipping and any coupon are applied at checkout.</p>
          {user ? (
            <Link href="/checkout" className="block bg-royal py-3 text-center label-caps text-cream hover:opacity-90">
              Proceed to Checkout
            </Link>
          ) : (
            <button
              onClick={() => openAuthDrawer("login")}
              className="block w-full bg-royal py-3 text-center label-caps text-cream hover:opacity-90"
            >
              Sign in to Checkout
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
