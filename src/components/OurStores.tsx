"use client";

import { useState } from "react";
import Image from "next/image";
import { subscribeToNewsletter } from "@/lib/newsletter";
import { ApiError } from "@/lib/api";

const EMAIL = "amoriaperfumeofficial@gmail.com";
const PHONE_DISPLAY = "+971 50 755 0447";
const PHONE_HREF = "+971507550447";

// TODO: swap for the real store/lifestyle photo once provided — this is a
// placeholder so the layout can be seen with a real image in the meantime.
const BACKGROUND_IMAGE = "/hero-banner.jpg";

export function OurStores() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setError(null);
    try {
      await subscribeToNewsletter(email);
      setStatus("done");
    } catch (err) {
      setStatus("error");
      setError(err instanceof ApiError ? err.message : "Something went wrong — please try again.");
    }
  }

  return (
    <section className="px-6 py-16">
      <div className="relative flex min-h-[600px] items-center overflow-hidden rounded-3xl">
        <Image src={BACKGROUND_IMAGE} alt="" fill sizes="100vw" className="object-cover" />

        <div className="relative z-10 m-6 ml-auto w-full max-w-md rounded-3xl bg-cream-dark p-10 shadow-xl sm:m-10 sm:p-12">
          <h2 className="font-serif text-3xl text-ink">New Here?</h2>
          <p className="mt-3 text-sm text-ink-soft">
            Sign up for our newsletter and get 10% off your first order plus exclusive updates.
          </p>

          {status === "done" ? (
            <p className="mt-5 text-sm text-emerald">Thank you for signing up — welcome to Amoria.</p>
          ) : (
            <form onSubmit={handleSubscribe} className="mt-5 flex items-center border border-ink/20 bg-cream px-4 py-3">
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
            Icon Residency 2, Shop 7 — opposite ADNOC service station
            <br />
            Al Muwaihat 3, Ajman, United Arab Emirates
          </p>

          <p className="label-caps mt-6 text-gold">Get In Touch</p>
          <a href={`mailto:${EMAIL}`} className="mt-2 block text-sm text-ink hover:text-emerald">
            {EMAIL}
          </a>
          <a href={`tel:${PHONE_HREF}`} className="mt-1 block text-sm text-ink hover:text-emerald">
            {PHONE_DISPLAY}
          </a>
        </div>
      </div>
    </section>
  );
}
