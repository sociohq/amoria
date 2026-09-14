import { apiFetch } from "./api";

export type Gender = "him" | "her" | "unisex";
export const FRAGRANCE_FAMILIES = ["Fresh Fruity", "Oriental Floral", "Tropical Fruity"] as const;
export type FragranceFamily = (typeof FRAGRANCE_FAMILIES)[number];
export type Concentration = "20" | "25" | "30";

export interface PricingTier {
  concentration: string; // "20" | "25" | "30"
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
