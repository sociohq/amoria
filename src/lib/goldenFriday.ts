import { apiFetch } from "./api";

// The Golden Friday promotion is the coupon below. The site shows the popup and the homepage banner only while
// the coupon is live (active, not expired, not used up), so switching the coupon off in the admin Coupons page
// (or letting its expiry date pass) ends the promotion everywhere with no other change.
export const GOLDEN_FRIDAY_CODE = "GOLDEN25";

export interface GoldenFridayOffer {
  code: string;
  type: "PERCENTAGE" | "FIXED";
  value: number;
  minOrderValue: number | null;
}

export async function getGoldenFriday(): Promise<GoldenFridayOffer | null> {
  try {
    const { coupon } = await apiFetch<{ coupon: GoldenFridayOffer }>(`/api/coupons/public/${GOLDEN_FRIDAY_CODE}`);
    return coupon;
  } catch {
    return null; // not live (or the API is unreachable): show nothing rather than a broken promotion
  }
}

// "25% off" / "AED 30 off", and the condition: "on orders of AED 120 or more".
export function offerHeadline(offer: GoldenFridayOffer): string {
  return offer.type === "PERCENTAGE" ? `${offer.value}% off` : `AED ${offer.value} off`;
}
export function offerCondition(offer: GoldenFridayOffer): string {
  return offer.minOrderValue ? `on orders of AED ${offer.minOrderValue} or more` : "on your order";
}
