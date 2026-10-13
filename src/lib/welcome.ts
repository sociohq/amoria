import { apiFetch } from "./api";

export interface WelcomeOffer {
  code: string;
  percent: number;
  // True when this phone number had already claimed an offer — the same code comes back.
  returning: boolean;
  // True when that code has already been spent on an order.
  redeemed: boolean;
}

export const claimWelcomeOffer = (name: string, phone: string) =>
  apiFetch<WelcomeOffer>("/api/welcome", { method: "POST", body: JSON.stringify({ name, phone }) });

// The code is remembered in this browser so checkout can pre-fill it.
export const WELCOME_CODE_KEY = "amoria-welcome-code";
