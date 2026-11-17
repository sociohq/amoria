"use client";

import { useGoldenFridayOffer } from "@/lib/golden-friday-context";
import { formatAed } from "@/lib/money";

// The "spend to unlock" bar for the Golden Friday code. `subtotal` is what the items cost after any offer (AED), the
// same figure the checkout judges the coupon's minimum on. Renders nothing when there is no live offer or no minimum.
export function GoldenFridayProgress({ subtotal, className = "" }: { subtotal: number; className?: string }) {
  const offer = useGoldenFridayOffer();
  const min = offer?.minOrderValue ?? 0;
  if (!offer || min <= 0) return null;

  const off = offer.type === "PERCENTAGE" ? `${offer.value}%` : `AED ${offer.value}`;
  const remaining = min - subtotal;
  const pct = Math.max(0, Math.min(100, (subtotal / min) * 100));

  return (
    <div className={`border-b border-border px-8 py-3 text-sm ${className}`}>
      <div className="flex items-center gap-2">
        <span aria-hidden>✨</span>
        {remaining > 0 ? (
          <p className="text-ink">
            You&apos;re <strong>{formatAed(remaining)}</strong> away from <strong>{off} off</strong>
            <span className="text-ink-soft"> with code {offer.code}</span>
          </p>
        ) : (
          <p className="text-royal">
            You&apos;ve unlocked <strong>{off} off</strong>. Use code <strong>{offer.code}</strong> at checkout
          </p>
        )}
      </div>
      <div className="mt-2 h-1 overflow-hidden rounded-full bg-border" role="progressbar" aria-valuemin={0} aria-valuemax={min} aria-valuenow={Math.min(subtotal, min)}>
        <div className="h-full rounded-full bg-gold transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
