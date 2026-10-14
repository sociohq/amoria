"use client";

import { useEffect, useState } from "react";
import { getPublicSettings } from "./settings";

// The free-delivery minimum (AED) from admin → Settings, so every place on the
// site that mentions it shows the real number instead of a copy that can drift.
// One request is shared by everything that asks; null until it arrives (or if
// the settings can't be reached), so callers fall back to wording without a number.
let pending: Promise<number | null> | null = null;

function load(): Promise<number | null> {
  if (!pending) {
    pending = getPublicSettings()
      .then((s) => (typeof s.freeShippingThreshold === "number" && s.freeShippingThreshold > 0 ? s.freeShippingThreshold : null))
      .catch(() => {
        pending = null; // try again next time
        return null;
      });
  }
  return pending;
}

export function useFreeShippingThreshold(): number | null {
  const [threshold, setThreshold] = useState<number | null>(null);
  useEffect(() => {
    let alive = true;
    load().then((t) => {
      if (alive) setThreshold(t);
    });
    return () => {
      alive = false;
    };
  }, []);
  return threshold;
}
