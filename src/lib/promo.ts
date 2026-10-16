import { PromoCoupon } from "./types";
import { formatAed } from "./money";

// "AED 50 off" / "20% off"
export function promoOffer(p: PromoCoupon): string {
  return p.type === "PERCENTAGE" ? `${p.value}% off` : `${formatAed(p.value)} off`;
}

// "orders of AED 150+" — or nothing when there's no minimum.
export function promoMinimum(p: PromoCoupon): string | null {
  return p.minOrderValue ? `orders of ${formatAed(p.minOrderValue)}+` : null;
}

// "31 Oct" (Dubai time, the store's day), or null when the coupon doesn't expire.
export function promoEnds(p: PromoCoupon): string | null {
  if (!p.expiresAt) return null;
  return new Date(p.expiresAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "Asia/Dubai" });
}
