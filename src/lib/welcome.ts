import { apiFetch } from "./api";
import { BotProtectionPayload } from "./botProtection";

export interface WelcomeOffer {
  code: string;
  percent: number;
  // True when this phone number had already claimed an offer — the same code comes back.
  returning: boolean;
  // True when that code has already been spent on an order.
  redeemed: boolean;
}

export const claimWelcomeOffer = (name: string, phone: string, protection: BotProtectionPayload) =>
  apiFetch<WelcomeOffer>("/api/welcome", {
    method: "POST",
    body: JSON.stringify({ name, phone, ...protection }),
  });

// The code is remembered in this browser so checkout can pre-fill it.
export const WELCOME_CODE_KEY = "amoria-welcome-code";
