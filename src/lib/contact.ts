import { apiFetch } from "./api";
import { BotProtectionPayload } from "./botProtection";

export interface ContactFormInput extends BotProtectionPayload {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}

export const submitContactForm = (data: ContactFormInput) =>
  apiFetch<{ success: boolean }>("/api/contact", { method: "POST", body: JSON.stringify(data) });
