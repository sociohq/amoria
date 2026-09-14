"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface PriceRangeSliderProps {
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  step?: number;
  formatValue?: (n: number) => string;
}

// A draggable dual-handle range slider — replaces plain min/max number
// inputs for the shop page's price filter. Built on pointer events rather
// than two overlapping native <input type="range"> elements (the usual
// hack for this), since that stacking trick fights the browser for which
// handle receives a given click once the two thumbs get close together.
export function PriceRangeSlider({ min, max, value, onChange, step = 10, formatValue }: PriceRangeSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState<"low" | "high" | null>(null);
  // Local draft so the thumb tracks the pointer instantly; the caller
  // (which pushes this into the URL) only hears about the final value,
  // on release — not on every pixel of movement.
  const [draft, setDraft] = useState<[number, number]>(value);
  const draftRef = useRef(draft);
  draftRef.current = draft;

  // Stay in sync with the caller's value whenever we're not the one
  // currently changing it (e.g. "Clear All" resetting the filter).
  useEffect(() => {
    if (!dragging) setDraft(value);
  }, [value, dragging]);

  const span = max - min || 1;
  const clamp = useCallback((n: number) => Math.min(max, Math.max(min, n)), [min, max]);

  const toValue = useCallback(
    (clientX: number) => {
      const track = trackRef.current;
      if (!track) return min;
      const rect = track.getBoundingClientRect();
      const ratio = rect.width === 0 ? 0 : (clientX - rect.left) / rect.width;
      const raw = min + ratio * span;
      return clamp(Math.round(raw / step) * step);
    },
    [min, span, step, clamp]
  );

  function startDrag(which: "low" | "high") {
    return (e: React.PointerEvent) => {
      e.preventDefault();
      setDragging(which);
    };
  }

  useEffect(() => {
    if (!dragging) return;

    function move(e: PointerEvent) {
      const next = toValue(e.clientX);
      setDraft((prev) => {
        const updated: [number, number] =
          dragging === "low" ? [Math.min(next, prev[1]), prev[1]] : [prev[0], Math.max(next, prev[0])];
        draftRef.current = updated;
        return updated;
      });
    }
    function stop() {
      setDragging(null);
      onChange(draftRef.current);
    }

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", stop);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", stop);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dragging, toValue]);

  // Clicking (not dragging) anywhere on the track jumps the nearer handle
  // there — standard slider convenience.
  function handleTrackClick(e: React.MouseEvent) {
    const next = toValue(e.clientX);
    const [low, high] = draft;
    const which: "low" | "high" = Math.abs(next - low) <= Math.abs(next - high) ? "low" : "high";
    const updated: [number, number] = which === "low" ? [Math.min(next, high), high] : [low, Math.max(next, low)];
    setDraft(updated);
    onChange(updated);
  }

  function nudge(which: "low" | "high", delta: number) {
    const [low, high] = draft;
    const updated: [number, number] =
      which === "low" ? [clamp(low + delta), high] : [low, clamp(high + delta)];
    if (updated[0] > updated[1]) return;
    setDraft(updated);
    onChange(updated);
  }

  const fmt = formatValue ?? ((n: number) => String(n));
  const lowPct = ((draft[0] - min) / span) * 100;
  const highPct = ((draft[1] - min) / span) * 100;

  return (
    <div>
      <div className="mb-3 flex justify-between text-sm text-ink">
        <span>{fmt(draft[0])}</span>
        <span>{fmt(draft[1])}</span>
      </div>
      <div ref={trackRef} onClick={handleTrackClick} className="relative h-1.5 cursor-pointer rounded-full bg-border">
        <div
          className="absolute h-1.5 rounded-full bg-royal"
          style={{ left: `${lowPct}%`, width: `${highPct - lowPct}%` }}
        />
        {(
          [
            ["low", lowPct, draft[0]],
            ["high", highPct, draft[1]],
          ] as const
        ).map(([which, pct, val]) => (
          <div
            key={which}
            role="slider"
            tabIndex={0}
            aria-label={which === "low" ? "Minimum price" : "Maximum price"}
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={val}
            onPointerDown={startDrag(which)}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight" || e.key === "ArrowUp") nudge(which, step);
              if (e.key === "ArrowLeft" || e.key === "ArrowDown") nudge(which, -step);
            }}
            className="absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 cursor-grab touch-none rounded-full border-2 border-royal bg-white shadow transition-transform active:scale-110 active:cursor-grabbing"
            style={{ left: `${pct}%` }}
          />
        ))}
      </div>
    </div>
  );
}
