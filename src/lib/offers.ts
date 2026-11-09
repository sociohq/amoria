// Buy 1 Get 1 Free, the same sum the server makes at checkout (see buyOneGetOneDiscountFils in the backend): the units
// of every offer product in the cart are paired off and in each pair the cheaper one is free, so n units get
// floor(n / 2) free, the cheapest ones. Any two offer products make a pair, they needn't be the same product.
export interface OfferLine {
  price: number; // AED, one unit
  quantity: number;
  buyOneGetOne?: boolean;
}

export function offerUnits(lines: OfferLine[]): number[] {
  return lines.filter((l) => l.buyOneGetOne).flatMap((l) => Array<number>(l.quantity).fill(l.price));
}

export function offerDiscount(lines: OfferLine[]): number {
  const prices = offerUnits(lines).sort((a, b) => a - b);
  const free = Math.floor(prices.length / 2);
  // Whole fils, so the shown amount matches what the server charges.
  return Math.round(prices.slice(0, free).reduce((sum, p) => sum + p * 100, 0)) / 100;
}

// True when the cart holds an odd number of offer units: one more would be free.
export function offerNeedsOneMore(lines: OfferLine[]): boolean {
  return offerUnits(lines).length % 2 === 1;
}
