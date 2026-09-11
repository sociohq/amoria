"use client";

import { useEffect, useState } from "react";
import { getPublicSettings } from "@/lib/settings";
import { formatAed } from "@/lib/money";

export function ShippingProgress({ subtotal }: { subtotal: number }) {
  const [threshold, setThreshold] = useState<number | null>(null);

  useEffect(() => {
    getPublicSettings()
      .then((s) => setThreshold(s.freeShippingThreshold))
      .catch(() => setThreshold(null)); // fails quietly — the nudge just doesn't render
  }, []);

  if (threshold == null || threshold <= 0) return null;

  const remaining = threshold - subtotal;

  return (
    <div className="flex items-center gap-2 border-b border-border px-8 py-3 text-sm">
      <span aria-hidden>🚚</span>
      {remaining > 0 ? (
        <p className="text-ink">
          Add <strong>{formatAed(remaining)}</strong> more to unlock <strong>free shipping</strong>
        </p>
      ) : (
        <p className="text-emerald">You&apos;ve unlocked free shipping</p>
      )}
    </div>
  );
}
