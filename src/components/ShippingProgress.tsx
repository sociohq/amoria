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
  const progress = Math.min(100, Math.round((subtotal / threshold) * 100));

  return (
    <div className="border-b border-border bg-cream-dark/40 px-6 py-3">
      <p className="text-xs text-ink">
        {remaining > 0 ? (
          <>
            Add <strong>{formatAed(remaining)}</strong> more for free shipping
          </>
        ) : (
          <span className="text-emerald">You&apos;ve unlocked free shipping 🎉</span>
        )}
      </p>
      <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-border">
        <div className="h-full rounded-full bg-emerald transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}
