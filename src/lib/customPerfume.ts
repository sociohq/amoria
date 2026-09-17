import { apiFetch } from "./api";

export type Gender = "him" | "her" | "unisex";
// A standard, broader family list rather than the real catalog's 3 —
// a bespoke blend isn't limited to what's already in stock.
export const FRAGRANCE_FAMILIES = [
  "Fresh & Citrusy",
  "Green & Aromatic",
  "Fruity & Delicious",
  "Floral & Delicate",
  "Woody & Profound",
  "Sweet & Gourmand",
  "Spicy & Ambery",
  "Leathery & Distinctive",
] as const;
export type FragranceFamily = (typeof FRAGRANCE_FAMILIES)[number];

// Real ingredient photography (site owner-provided) for the fragrance
// family step, replacing the earlier emoji-icon placeholders.
export const FRAGRANCE_FAMILY_IMAGES: Record<FragranceFamily, string> = {
  "Fresh & Citrusy": "/families/fresh-citrusy.png",
  "Green & Aromatic": "/families/green-aromatic.png",
  "Fruity & Delicious": "/families/fruity-delicious.png",
  "Floral & Delicate": "/families/floral-delicate.png",
  "Woody & Profound": "/families/woody-profound.png",
  "Sweet & Gourmand": "/families/sweet-gourmand.png",
  "Spicy & Ambery": "/families/spicy-ambery.png",
  "Leathery & Distinctive": "/families/leathery-distinctive.png",
};
export type Concentration = "20" | "25" | "30";

export interface PricingTier {
  concentration: string; // "20" | "25" | "30"
  size: string; // "50ml" | "100ml" — fixed per concentration
  price: number; // AED
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
  fragranceFamily: FragranceFamily;
  concentration: Concentration;
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
