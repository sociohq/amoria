"use client";

import { useEffect, useState } from "react";
import { getPublicSettings } from "./settings";
import { DeliverySettings } from "./format";

// The cut-off hour and delivery days from admin → Settings, so the delivery dates shown on product pages
// follow what the shop has set instead of a copy that can drift. One request is shared by everything that
// asks; null until it arrives (callers then use the standard defaults).
let pending: Promise<DeliverySettings | null> | null = null;

function load(): Promise<DeliverySettings | null> {
  if (!pending) {
    pending = getPublicSettings()
      .then((s) => ({ orderCutoffHour: s.orderCutoffHour, minLeadDays: s.minLeadDays, maxLeadDays: s.maxLeadDays }))
      .catch(() => {
        pending = null; // try again next time
        return null;
      });
  }
  return pending;
}

export function useDeliverySettings(): DeliverySettings | null {
  const [settings, setSettings] = useState<DeliverySettings | null>(null);
  useEffect(() => {
    let alive = true;
    load().then((s) => {
      if (alive) setSettings(s);
    });
    return () => {
      alive = false;
    };
  }, []);
  return settings;
}
