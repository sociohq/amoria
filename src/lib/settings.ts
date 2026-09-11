import { apiFetch } from "./api";

export interface PublicSettings {
  freeShippingThreshold: number; // AED
  standardShippingFee: number; // AED
  orderCutoffHour: number;
  minLeadDays: number;
  maxLeadDays: number;
}

export async function getPublicSettings(): Promise<PublicSettings> {
  const { settings } = await apiFetch<{ settings: PublicSettings }>("/api/settings");
  return settings;
}
