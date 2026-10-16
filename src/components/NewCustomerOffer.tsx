"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { getPublicSettings } from "@/lib/settings";
import { PromoCoupon } from "@/lib/types";
import { promoEnds, promoMinimum, promoOffer } from "@/lib/promo";

// "New here? Use code …" — shown under the price to someone who hasn't ordered yet (a visitor who
// isn't signed in, or a signed-in customer with no orders), while the promoted coupon is usable.
export function NewCustomerOffer() {
  const { user, loading } = useAuth();
  const [promo, setPromo] = useState<PromoCoupon | null>(null);
  const [hasOrders, setHasOrders] = useState<boolean | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    getPublicSettings()
      .then((s) => setPromo(s.promo ?? null))
      .catch(() => setPromo(null));
  }, []);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      setHasOrders(false);
      return;
    }
    apiFetch<{ orders: unknown[] }>("/api/orders")
      .then(({ orders }) => setHasOrders(orders.length > 0))
      .catch(() => setHasOrders(true)); // if we can't tell, don't promise a "first order" offer
  }, [user, loading]);

  if (!promo || hasOrders !== false) return null;

  const minimum = promoMinimum(promo);
  const ends = promoEnds(promo);

  async function copy() {
    try {
      await navigator.clipboard.writeText(promo!.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked — the code is still on screen to type */
    }
  }

  return (
    <div className="mt-4 flex items-center justify-between gap-3 rounded-lg border border-dashed border-gold/70 bg-gold/10 px-4 py-3">
      <div className="min-w-0">
        <p className="text-sm font-medium text-ink">New here? Get {promoOffer(promo)} your first order</p>
        <p className="mt-0.5 text-xs text-ink-soft">
          Use code <strong className="font-semibold text-ink">{promo.code}</strong> at checkout
          {minimum ? ` on ${minimum}` : ""}
          {ends ? ` · ends ${ends}` : ""}
        </p>
      </div>
      <button
        type="button"
        onClick={copy}
        className="shrink-0 rounded border border-ink px-3 py-1.5 text-xs font-medium uppercase tracking-wide text-ink transition-colors hover:bg-ink hover:text-cream"
      >
        {copied ? "Copied" : "Copy code"}
      </button>
    </div>
  );
}
