"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const HOLD_MS = 1200; // how long the mark sits before the curtain lifts
const FADE_MS = 600; // how long the curtain takes to lift

// A brief branded arrival screen shown on every fresh page load (a hard
// navigation or refresh) — mounted in the root layout, so client-side
// route changes within the app never retrigger it, only actual reloads.
export function PageLoader() {
  const [fading, setFading] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFading(true), HOLD_MS);
    const doneTimer = setTimeout(() => setDone(true), HOLD_MS + FADE_MS);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
  }, []);

  if (done) return null;

  return (
    <div
      aria-hidden
      className={`fixed inset-0 z-[999] flex flex-col items-center justify-center bg-ink transition-opacity ease-out ${
        fading ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
      style={{ transitionDuration: `${FADE_MS}ms` }}
    >
      <div className="loader-mark">
        <Image src="/logo.png" alt="" width={170} height={47} className="h-11 w-auto invert" priority />
      </div>
      <div className="mt-6 h-px w-16 overflow-hidden bg-cream/15">
        <div className="loader-rule h-full w-full origin-left bg-gold" />
      </div>
    </div>
  );
}
