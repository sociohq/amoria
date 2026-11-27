import { apiFetch } from "./api";
import { BotProtectionPayload } from "./botProtection";

export const subscribeToNewsletter = (email: string, protection: BotProtectionPayload) =>
  apiFetch<{ success: boolean }>("/api/newsletter", {
    method: "POST",
    body: JSON.stringify({ email, ...protection }),
  });
