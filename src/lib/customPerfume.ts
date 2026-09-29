import { apiFetch } from "./api";

export type Gender = "him" | "her" | "unisex";

// The wizard's family step now offers the same full taxonomy as the
// homepage's "Shop By Scent Family" scroller and the real catalog, rather
// than its own separate, shorter list — a bespoke blend can draw from any
// family we sell, not a curated subset.
export { FRAGRANCE_FAMILIES } from "./fragranceFamilies";
export type { FragranceFamily } from "./fragranceFamilies";

export type Concentration = "20" | "25" | "30" | "35" | "40";

// Every concentration is available in both bottle sizes, each with its
// own independent price — size is no longer implied by concentration.
export type Size = "50ml" | "100ml";

export interface PricingTier {
  concentration: string; // "20" | "25" | "30" | "35" | "40"
  sizes: { size: string; price: number }[]; // "50ml" and "100ml", each with its own AED price
}

// Live prices from the admin-editable "Custom Perfume" product's variants
// (see backend prisma/seed-custom-perfume.ts) rather than hardcoded here,
// so an admin's price edit takes effect with no frontend deploy.
export async function getCustomPerfumePricing(): Promise<PricingTier[]> {
  const { tiers } = await apiFetch<{ tiers: PricingTier[] }>("/api/custom-perfume/pricing");
  return tiers;
}

export interface CustomPerfumeCheckoutInput {
  customerName: string;
  gender: Gender;
  fragranceFamily: string;
  concentration: Concentration;
  size: Size;
  email?: string;
  shippingAddress: {
    line1: string;
    line2?: string;
    city: string;
    emirate: string;
    phone: string;
  };
}

export async function createCustomPerfumeCheckout(input: CustomPerfumeCheckoutInput): Promise<{ url: string }> {
  return apiFetch<{ url: string }>("/api/custom-perfume/checkout", {
    method: "POST",
    body: JSON.stringify(input),
  });
}
