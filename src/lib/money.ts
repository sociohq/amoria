export function formatAed(amount: number): string {
  return `AED ${amount.toLocaleString("en-AE", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

// The crossed-out price for a size: its own full price during a category sale,
// otherwise the product's manually set compare-at price.
export function compareFor(
  product: { compareAtPrice: number | null },
  variant: { compareAtPrice?: number } | undefined
): number | null {
  return variant?.compareAtPrice ?? product.compareAtPrice;
}

export function percentOff(price: number, compareAtPrice: number | null): number | null {
  if (!compareAtPrice || compareAtPrice <= price) return null;
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
}
