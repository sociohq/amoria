"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ApiError } from "@/lib/api";
import { ShipmentTracking, trackShipment } from "@/lib/tracking";

const STEPS = ["Booked", "Collected", "In transit", "Out for delivery", "Delivered"];

// "AJMAN-UNITED ARAB EMIRATES" -> "Ajman" for the route line.
const place = (s: string | null) =>
  s ? s.split("-")[0].toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()) : null;

// The Track Order page: type (or arrive with, from the shipping email's link)
// the tracking number and see where the parcel is. The courier's own 0-5
// progress marker drives the step bar; the scan history sits underneath.
export function TrackOrder() {
  const router = useRouter();
  const params = useSearchParams();
  const initial = params.get("awb")?.trim() ?? "";
  const [number, setNumber] = useState(initial);
  const [result, setResult] = useState<ShipmentTracking | null>(null);
  const [error, setError] = useState<string | null>(null);
  // A link from the email (?awb=…) is being looked up from the first render,
  // so the page opens already in its "checking" state.
  const [loading, setLoading] = useState(Boolean(initial));
  const requestId = useRef(0);

  // Only the newest lookup may update the page, so a slow answer for an older
  // number never overwrites a newer one.
  function runLookup(awb: string) {
    const id = ++requestId.current;
    return trackShipment(awb)
      .then((tracking) => {
        if (id !== requestId.current) return;
        setResult(tracking);
        setError(null);
      })
      .catch((err) => {
        if (id !== requestId.current) return;
        setResult(null);
        setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
      })
      .finally(() => {
        if (id === requestId.current) setLoading(false);
      });
  }

  useEffect(() => {
    if (initial) void runLookup(initial);
    // only on first load for the link's number
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const awb = number.trim();
    if (!awb) return;
    router.replace(`/track?awb=${encodeURIComponent(awb)}`, { scroll: false });
    setLoading(true);
    setError(null);
    void runLookup(awb);
  }

  const latest = result?.events[0];
  const from = place(result?.origin ?? null);
  const to = place(result?.destination ?? null);
  // Booked-only parcels (nothing scanned yet) read as step 1.
  const step = result ? Math.min(Math.max(result.progress, 1), STEPS.length) : 0;

  return (
    <div className="px-6 py-16 sm:px-12 lg:py-24">
      <div className="mx-auto max-w-2xl">
        <div className="text-center">
          <p className="label-caps text-gold">Order Tracking</p>
          <h1 className="mt-2 font-serif text-4xl text-ink sm:text-5xl">Track Your Order</h1>
          <p className="mx-auto mt-4 max-w-md text-ink-soft">
            Enter the tracking number from your shipping email to see where your parcel is.
          </p>
        </div>

        <form onSubmit={submit} className="mt-10 flex flex-col gap-3 sm:flex-row">
          <input
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            placeholder="Tracking number, e.g. 2150032340"
            inputMode="text"
            autoComplete="off"
            aria-label="Tracking number"
            className="min-w-0 flex-1 border border-border bg-white px-4 py-3 text-ink outline-none placeholder:text-ink-soft/60 focus:border-royal"
          />
          <button
            type="submit"
            disabled={loading || !number.trim()}
            className="bg-ink px-8 py-3 label-caps text-cream transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Checking…" : "Track"}
          </button>
        </form>

        {error && (
          <p role="alert" className="mt-6 border border-crimson/30 bg-crimson/5 px-4 py-3 text-sm text-crimson">
            {error}
          </p>
        )}

        {result && !error && (
          <section className="mt-10 border border-border bg-white p-6 sm:p-8" aria-live="polite">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="label-caps text-ink-soft">Tracking number</p>
                <p className="mt-1 font-serif text-2xl tracking-wide text-ink">{result.awb}</p>
              </div>
              {(from || to) && (
                <p className="text-sm text-ink-soft">
                  {from ?? "—"} <span aria-hidden>→</span> {to ?? "—"}
                </p>
              )}
            </div>

            <p className={`mt-6 font-serif text-xl ${result.delivered ? "text-royal" : "text-ink"}`}>
              {result.delivered ? "Delivered" : (latest?.remarks ?? "Booked — waiting for the courier to collect it")}
            </p>

            <ol className="mt-6 grid grid-cols-5 gap-1" aria-label="Delivery progress">
              {STEPS.map((label, i) => {
                const reached = i + 1 <= step;
                return (
                  <li key={label} className="text-center">
                    <span
                      className={`block h-1.5 rounded-full ${reached ? (result.delivered ? "bg-royal" : "bg-gold") : "bg-border"}`}
                    />
                    <span className={`mt-2 block text-[10px] leading-tight sm:text-xs ${reached ? "text-ink" : "text-ink-soft/60"}`}>
                      {label}
                    </span>
                  </li>
                );
              })}
            </ol>

            {result.events.length > 0 ? (
              <ul className="mt-8 divide-y divide-border border-t border-border">
                {result.events.map((e, i) => (
                  <li key={`${e.date}-${e.time}-${i}`} className="flex gap-4 py-4">
                    <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${i === 0 ? "bg-gold" : "bg-border"}`} />
                    <div className="min-w-0">
                      <p className="text-sm text-ink">{e.remarks || e.status}</p>
                      <p className="mt-0.5 text-xs text-ink-soft">
                        {e.date}
                        {e.time && ` · ${e.time}`}
                        {e.location && ` · ${e.location}`}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-8 border-t border-border pt-6 text-sm text-ink-soft">
                Your parcel has been booked. Updates appear here as soon as the courier scans it — usually within a
                day.
              </p>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
