import { apiFetch } from "./api";

export const subscribeToNewsletter = (email: string) =>
  apiFetch<{ success: boolean }>("/api/newsletter", { method: "POST", body: JSON.stringify({ email }) });
