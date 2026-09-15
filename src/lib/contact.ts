import { apiFetch } from "./api";

export interface ContactFormInput {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}

export const submitContactForm = (data: ContactFormInput) =>
  apiFetch<{ success: boolean }>("/api/contact", { method: "POST", body: JSON.stringify(data) });
