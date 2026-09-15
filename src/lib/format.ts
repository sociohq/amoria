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

// For blog cards — the long month name reads better against the site's
// editorial serif tone than a numeric date.
export function formatPostDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-AE", { day: "numeric", month: "long", year: "numeric" });
}

// Shared by the storefront fallback below and the admin form's initial
// pre-fill for a product with no customized sections yet — kept as one
// function so the two never drift out of sync.
export function defaultInfoSections({ isScentCapable, sizes }: { isScentCapable: boolean; sizes: string }): InfoSection[] {
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
      content: "Free shipping on orders above AED 99. Unopened items can be returned within 14 days of delivery.",
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
export function productInfoSections(product: Product): InfoSection[] {
  if (product.infoSections && product.infoSections.length > 0) return product.infoSections;

  return defaultInfoSections({
    isScentCapable: product.productType === "PERFUME" || product.productType === "HAIR_CARE",
    sizes: product.variants.map((v) => v.size).join(", "),
  });
}
