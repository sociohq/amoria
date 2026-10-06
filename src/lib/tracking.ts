import { apiFetch } from "./api";

export interface TrackingEvent {
  date: string;
  time: string;
  status: string;
  remarks: string;
  location: string;
}

export interface ShipmentTracking {
  awb: string;
  origin: string | null;
  destination: string | null;
  // The courier's own 0-5 marker: 0 = booked, nothing scanned yet; 5 = delivered.
  progress: number;
  delivered: boolean;
  events: TrackingEvent[];
}

export async function trackShipment(awb: string): Promise<ShipmentTracking> {
  const { tracking } = await apiFetch<{ tracking: ShipmentTracking }>(`/api/tracking/${encodeURIComponent(awb.trim())}`);
  return tracking;
}
