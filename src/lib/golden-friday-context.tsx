"use client";

import { createContext, useContext, ReactNode } from "react";
import { GoldenFridayOffer } from "./goldenFriday";

// The live Golden Friday offer (or null), fetched once by the storefront layout so the cart's "spend to unlock" bar
// and the popup read the same thing.
const GoldenFridayContext = createContext<GoldenFridayOffer | null>(null);

export function GoldenFridayProvider({ offer, children }: { offer: GoldenFridayOffer | null; children: ReactNode }) {
  return <GoldenFridayContext.Provider value={offer}>{children}</GoldenFridayContext.Provider>;
}

export function useGoldenFridayOffer(): GoldenFridayOffer | null {
  return useContext(GoldenFridayContext);
}
