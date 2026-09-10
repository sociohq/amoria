import { ConcentrationType } from "./types";

const CONCENTRATION_LABELS: Record<ConcentrationType, string> = {
  EAU_DE_TOILETTE: "Eau de Toilette",
  EAU_DE_PARFUM: "Eau de Parfum",
  EXTRAIT_DE_PARFUM: "Extrait de Parfum",
  PARFUM: "Parfum",
};

export function formatConcentration(type: ConcentrationType): string {
  return CONCENTRATION_LABELS[type];
}

// Lightweight stand-in for the reference design's live delivery countdown —
// a real cutoff-time/lead-days config comes from /api/admin/settings; this
// keeps the promise honest (a date range) without building a ticking clock
// for what's a "nice to have" launch element.
export function deliveryEstimate(minDays = 2, maxDays = 4): string {
  const fmt = (d: Date) => d.toLocaleDateString("en-AE", { day: "2-digit", month: "2-digit", year: "numeric" });
  const start = new Date();
  start.setDate(start.getDate() + minDays);
  const end = new Date();
  end.setDate(end.getDate() + maxDays);
  return `${fmt(start)} to ${fmt(end)}`;
}
