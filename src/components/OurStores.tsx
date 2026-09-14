"use client";

import { useRef, useState } from "react";
import { useLenis } from "lenis/react";
import { subscribeToNewsletter } from "@/lib/newsletter";
import { ApiError } from "@/lib/api";

const EMAIL = "amoriaperfumeofficial@gmail.com";
const PHONE_DISPLAY = "+971 50 755 0447";
const PHONE_HREF = "+971507550447";

// Was a static image (before that, briefly, a photo of a Louis Vuitton
// counter display — not an Amoria store, swapped out). Now a looping
// background video with a scroll-linked parallax drift.
const BACKGROUND_VIDEO = "/videos/our-stores-bg.mp4";
// How strongly the video drifts relative to the page's own scroll — kept
// subtle; the video's own transform (below) scales it up by enough to
// cover that drift range without exposing an edge.
const PARALLAX_STRENGTH = 0.15;

export function OurStores() {
  const sectionRef = useRef<HTMLElement>(null);
  const [parallaxOffset, setParallaxOffset] = useState(0);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  // Hooks into the site's existing Lenis smooth-scroll (see
  // SmoothScroll.tsx) rather than a raw window scroll listener, so the
  // video's drift stays in sync with the same eased scroll position
  // everything else on the page is already animating against.
  useLenis(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = sectionRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const distanceFromCenter = rect.top + rect.height / 2 - window.innerHeight / 2;
    setParallaxOffset(distanceFromCenter * PARALLAX_STRENGTH);
  });

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setError(null);
    try {
      await subscribeToNewsletter(email);
      setStatus("done");
    } catch (err) {
      setStatus("error");
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    }
  }

  return (
    <section ref={sectionRef} className="relative flex min-h-[600px] items-center overflow-hidden bg-ink">
      {/* Scaled up beyond the section's own bounds so the parallax
          translate never exposes an edge, muted+loop+playsInline so it
          autoplays inline on mobile Safari without a user gesture. */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        style={{ transform: `scale(1.1) translateY(${parallaxOffset}px)` }}
      >
        <source src={BACKGROUND_VIDEO} type="video/mp4" />
      </video>

      <div className="relative z-10 m-6 ml-auto w-full max-w-md bg-cream-dark p-10 shadow-xl sm:m-10 sm:p-12">
        <h2 className="font-serif text-3xl text-ink">New Here?</h2>
        <p className="mt-3 text-sm text-ink-soft">
          Sign up for our newsletter and get 10% off your first order plus exclusive updates.
        </p>

        {status === "done" ? (
          <p className="mt-5 text-sm text-royal">Thank you for signing up. Welcome to Amoria.</p>
        ) : (
          <form onSubmit={handleSubscribe} className="mt-5 flex items-center border border-ink/30 px-4 py-3">
            <input
              type="email"
              required
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink-soft"
            />
            <button
              type="submit"
              disabled={status === "submitting"}
              aria-label="Subscribe"
              className="text-ink disabled:opacity-50"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M4 12h16M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </form>
        )}
        {error && <p className="mt-2 text-xs text-crimson">{error}</p>}

        <div className="my-8 border-t border-ink/15" />

        <p className="label-caps text-gold">Visit Us</p>
        <p className="mt-2 text-sm text-ink-soft">
          Icon Residency 2, Shop 7 (opposite ADNOC service station)
          <br />
          Al Muwaihat 3, Ajman, United Arab Emirates
        </p>

        <p className="label-caps mt-6 text-gold">Get In Touch</p>
        <a href={`mailto:${EMAIL}`} className="mt-2 block text-sm text-ink hover:text-royal">
          {EMAIL}
        </a>
        <a href={`tel:${PHONE_HREF}`} className="mt-1 block text-sm text-ink hover:text-royal">
          {PHONE_DISPLAY}
        </a>
      </div>
    </section>
  );
}
