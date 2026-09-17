import { apiFetch } from "./api";
import { HeroSlide } from "./types";

export async function listHeroSlides(): Promise<HeroSlide[]> {
  const { slides } = await apiFetch<{ slides: HeroSlide[] }>("/api/hero-slides");
  return slides;
}
