"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getPublicSettings, PublicSettings } from "@/lib/settings";
import { subscribeToNewsletter } from "@/lib/newsletter";
import { ApiError } from "@/lib/api";

const DISMISSED_KEY = "amoria-newsletter-dismissed";

// First-visit newsletter popup — content, timing and the on/off switch all
// come from Settings (admin-editable via /admin/settings), nothing here is
// hardcoded. Shown once per browser (tracked in localStorage), after the
// admin-configured delay, unless already dismissed or subscribed.
export function NewsletterPopup() {
  const [settings, setSettings] = useState<PublicSettings | null>(null);
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alreadyDismissed = false;
    try {
      alreadyDismissed = localStorage.getItem(DISMISSED_KEY) === "1";
    } catch {
      // Private browsing / storage blocked — treat as not-yet-seen rather
      // than crash; worst case the popup shows more than once for them.
    }
    if (alreadyDismissed) return;

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    getPublicSettings()
      .then((s) => {
        if (cancelled || !s.newsletterPopupEnabled) return;
        setSettings(s);
        timer = setTimeout(() => setOpen(true), s.newsletterPopupDelaySeconds * 1000);
      })
      .catch(() => {
        // No settings, no popup — never block the page over this.
      });

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, []);

  function dismiss() {
    setOpen(false);
    try {
      localStorage.setItem(DISMISSED_KEY, "1");
    } catch {
      // Nothing to do if storage isn't available — it'll just show again.
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setError(null);
    try {
      await subscribeToNewsletter(email);
      setStatus("done");
      try {
        localStorage.setItem(DISMISSED_KEY, "1");
      } catch {
        // Ignore — subscribing still succeeded either way.
      }
    } catch (err) {
      setStatus("error");
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    }
  }

  if (!settings) return null;

  return (
    <>
      <div
        onClick={dismiss}
        className={`fixed inset-0 z-50 bg-black/60 transition-opacity duration-300 ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Newsletter signup"
        className={`fixed left-1/2 top-1/2 z-50 w-[92vw] max-w-3xl -translate-x-1/2 transition-all duration-300 ${
          open ? "pointer-events-auto -translate-y-1/2 opacity-100" : "pointer-events-none -translate-y-[45%] opacity-0"
        }`}
      >
        <div className="grid overflow-hidden shadow-2xl sm:grid-cols-2">
          <div className="relative hidden aspect-[4/5] sm:block">
            <Image src={settings.newsletterPopupImage} alt="" fill sizes="50vw" className="object-cover" />
          </div>

          <div className="relative flex flex-col justify-center overflow-hidden bg-ink px-8 py-12 sm:px-10">
            {/* A soft beige glow flowing in from the right edge — purely
                decorative, sits behind all the actual content below. */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 right-0 w-3/4"
              style={{ background: "radial-gradient(ellipse 80% 100% at 100% 50%, rgba(212,180,131,0.4), transparent 70%)" }}
            />

            <div className="relative">
              <button
                onClick={dismiss}
                aria-label="Close"
                className="absolute right-0 top-0 text-cream/70 transition-colors hover:text-cream"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                  <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
                </svg>
              </button>

              <p className="label-caps text-gold-light">{settings.newsletterPopupEyebrow}</p>
              <h2 className="mt-3 font-serif text-3xl leading-tight text-cream sm:text-4xl">
                {settings.newsletterPopupHeadline}
              </h2>
              <p className="mt-4 text-sm text-cream/75">{settings.newsletterPopupSubtext}</p>

              {status === "done" ? (
                <p className="mt-6 text-sm text-cream">Thank you for signing up. Welcome to Amoria.</p>
              ) : (
                <form onSubmit={handleSubmit} className="mt-6">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-transparent bg-cream px-4 py-3 text-sm text-ink outline-none placeholder:text-ink-soft focus:border-gold"
                  />
                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="mt-3 w-full bg-gold px-8 py-3 label-caps text-ink transition-opacity hover:opacity-90 disabled:opacity-50"
                  >
                    {status === "submitting" ? "Joining…" : settings.newsletterPopupButtonText}
                  </button>
                  {error && <p className="mt-2 text-xs text-crimson">{error}</p>}
                  <p className="mt-4 text-xs leading-relaxed text-cream/55">
                    Consent is not a condition of purchase. You can unsubscribe at any time. By signing up you agree
                    to Amoria&apos;s{" "}
                    <Link href="/privacy" className="text-gold-light underline">
                      Privacy Policy
                    </Link>
                    .
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
