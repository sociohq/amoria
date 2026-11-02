import { ConcentrationType, InfoSection, Product } from "./types";

const CONCENTRATION_LABELS: Record<ConcentrationType, string> = {
  EAU_DE_TOILETTE: "Eau de Toilette",
  EAU_DE_PARFUM: "Eau de Parfum",
  EXTRAIT_DE_PARFUM: "Extrait de Parfum",
  PARFUM: "Parfum",
};

export function formatConcentration(type: ConcentrationType): string {
  return CONCENTRATION_LABELS[type];
}

// The delivery window shown to customers ("between 05/11/2026 to 07/11/2026"). It follows how the shop
// really ships, set in admin → Settings:
//   • an order placed before the cut-off hour (Dubai time) on a weekday is handed to the courier that day;
//     an order after the cut-off, or on a Saturday or Sunday, goes the next weekday;
//   • the window is then the min and max lead days, counted in working days (Monday to Friday) from that
//     dispatch day.
export interface DeliverySettings {
  orderCutoffHour: number; // 0-23, Dubai time
  minLeadDays: number;
  maxLeadDays: number;
}
const DEFAULT_DELIVERY: DeliverySettings = { orderCutoffHour: 14, minLeadDays: 2, maxLeadDays: 4 };

export function deliveryEstimate(settings: Partial<DeliverySettings> = {}, now: Date = new Date()): string {
  const s = { ...DEFAULT_DELIVERY, ...settings };
  // Today's date and hour in Dubai, held as a UTC date so adding days is plain arithmetic.
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Dubai", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", hourCycle: "h23" }).formatToParts(now);
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value ?? 0);
  const day = new Date(Date.UTC(get("year"), get("month") - 1, get("day")));
  const isWeekend = (d: Date) => d.getUTCDay() === 0 || d.getUTCDay() === 6;
  const nextWeekday = (d: Date) => {
    do d.setUTCDate(d.getUTCDate() + 1);
    while (isWeekend(d));
  };
  const addWorkingDays = (from: Date, n: number) => {
    const d = new Date(from);
    for (let i = 0; i < n; i++) nextWeekday(d);
    return d;
  };

  const dispatch = new Date(day);
  if (get("hour") >= s.orderCutoffHour || isWeekend(dispatch)) nextWeekday(dispatch);

  const fmt = (d: Date) => d.toLocaleDateString("en-AE", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "UTC" });
  return `${fmt(addWorkingDays(dispatch, s.minLeadDays))} to ${fmt(addWorkingDays(dispatch, s.maxLeadDays))}`;
}

// For blog cards — the long month name reads better against the site's
// editorial serif tone than a numeric date.
export function formatPostDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-AE", { day: "numeric", month: "long", year: "numeric" });
}

// Shared by the storefront fallback below and the admin form's initial
// pre-fill for a product with no customized sections yet — kept as one
// function so the two never drift out of sync.
export function defaultInfoSections({
  isScentCapable,
  sizes,
  freeShippingFrom,
}: {
  isScentCapable: boolean;
  sizes: string;
  // Free-delivery minimum (AED) from settings; without it the wording carries no number.
  freeShippingFrom?: number | null;
}): InfoSection[] {
  return [
    {
      heading: "Sizes and Refills",
      content: sizes ? `Available in ${sizes}. Refills coming soon.` : "Refills coming soon.",
    },
    ...(isScentCapable
      ? [
          {
            heading: "How, When & Where to Apply Fragrances",
            content:
              "Apply to pulse points (wrists, neck, and behind the ears) right after showering, when skin is warm and slightly damp for the longest-lasting effect.",
          },
        ]
      : []),
    {
      heading: "Shipping, Returns and Questions",
      content: `${
        freeShippingFrom ? `Free shipping on orders above AED ${freeShippingFrom}.` : "Free shipping on qualifying orders."
      } Unopened items can be returned within 14 days of delivery.`,
    },
  ];
}

// The product page's accordions used to be identical hardcoded copy on
// every product, with no way for an admin to change a single word of
// it. Now they're a real per-product field (Product.infoSections) —
// this is only the storefront fallback for a product that hasn't had
// them customized yet (new products start with these same defaults
// pre-filled in the admin form, so this mostly exists for products that
// existed before the field did).
export function productInfoSections(product: Product, freeShippingFrom?: number | null): InfoSection[] {
  if (product.infoSections && product.infoSections.length > 0) return product.infoSections;

  return defaultInfoSections({
    isScentCapable: product.productType === "PERFUME" || product.productType === "HAIR_CARE",
    sizes: product.variants.map((v) => v.size).join(", "),
    freeShippingFrom,
  });
}
