import { apiFetch } from "./api";
import { Reel } from "./types";

export async function listReels(): Promise<Reel[]> {
  const { reels } = await apiFetch<{ reels: Reel[] }>("/api/reels");
  return reels;
}
