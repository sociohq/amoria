import { Product, ProductVariant } from "./types";

// How a size is named wherever it is shown (cart line, checkout): a product sold in quality grades reads
// "Top Quality · 1000gm", any other just its size ("50ml"). The server builds the same label for orders.
export const variantLabel = (v: Pick<ProductVariant, "size" | "quality">): string =>
  v.quality ? `${v.quality} · ${v.size}` : v.size;

// A product is "graded" when it is sold in quality grades (Top / Medium Quality), set per product in the admin.
// The server returns its sizes best quality first, then biggest first. A size left without a quality is not offered.
export const isGraded = (product: Product): boolean =>
  Boolean(product.qualityOptions) && product.variants.some((v) => Boolean(v.quality));

export const sellableVariants = (product: Product): ProductVariant[] =>
  isGraded(product) ? product.variants.filter((v) => v.quality) : product.variants;

// The distinct qualities, in the order the sizes come in.
export const qualitiesOf = (variants: ProductVariant[]): string[] => [
  ...new Set(variants.map((v) => v.quality).filter((q): q is string => Boolean(q))),
];

// The lowest price over every size on offer, for "From AED …" on a product with grades.
export const fromPrice = (product: Product): number => {
  const prices = sellableVariants(product).map((v) => v.price);
  return prices.length > 0 ? Math.min(...prices) : product.price;
};
