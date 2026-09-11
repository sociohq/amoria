import { apiFetch } from "./api";
import { Settings } from "./types";

export type PublicSettings = Settings;

export async function getPublicSettings(): Promise<PublicSettings> {
  const { settings } = await apiFetch<{ settings: PublicSettings }>("/api/settings");
  return settings;
}
