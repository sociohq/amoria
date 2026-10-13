"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getPublicSettings, PublicSettings } from "@/lib/settings";
import { claimWelcomeOffer, WelcomeOffer, WELCOME_CODE_KEY } from "@/lib/welcome";
import { ApiError } from "@/lib/api";

const DISMISSED_KEY = "amoria-welcome-dismissed";

// First-visit welcome popup — a visitor leaves their name and phone number
// and is shown a one-time 10% code to use at checkout. Content, timing and
// the on/off switch all come from Settings (admin-editable), nothing here is
// hardcoded. Shown once per browser (tracked in localStorage), after the
// admin-configured delay, unless already dismissed or claimed.
export function NewsletterPopup() {
  const [settings, setSettings] = useState<PublicSettings | null>(null);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [offer, setOffer] = useState<WelcomeOffer | null>(null);
  const [copied, setCopied] = useState(false);
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
      const result = await claimWelcomeOffer(name, phone);
      setOffer(result);
      setStatus("done");
      try {
        localStorage.setItem(DISMISSED_KEY, "1");
        if (!result.redeemed) localStorage.setItem(WELCOME_CODE_KEY, result.code);
      } catch {
        // Ignore — the code is on screen either way.
      }
    } catch (err) {
      setStatus("error");
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    }
  }

  async function copyCode() {
    if (!offer) return;
    try {
      await navigator.clipboard.writeText(offer.code);
    } catch {
      // Clipboard blocked (older browser / insecure context): select the text so it can be copied by hand.
      const el = document.getElementById("welcome-code");
      if (el) window.getSelection()?.selectAllChildren(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
        aria-label="Welcome offer"
        className={`fixed left-1/2 top-1/2 z-50 w-[92vw] max-w-3xl -translate-x-1/2 transition-all duration-300 ${
          open ? "pointer-events-auto -translate-y-1/2 opacity-100" : "pointer-events-none -translate-y-[45%] opacity-0"
        }`}
      >
        <div className="grid max-h-[92dvh] grid-cols-1 overflow-y-auto shadow-2xl sm:grid-cols-2">
          <div className="relative hidden min-h-[26rem] sm:block">
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
              {status !== "done" && <p className="mt-4 text-sm text-cream/75">{settings.newsletterPopupSubtext}</p>}

              {status === "done" && offer ? (
                <div className="mt-6">
                  {offer.redeemed ? (
                    <p className="text-sm text-cream">
                      This number has already used its welcome offer. Thank you for shopping with Amoria.
                    </p>
                  ) : (
                    <>
                      <p className="text-sm text-cream">
                        {offer.returning ? "Welcome back. Here is your code again." : `Welcome, ${name.trim()}. Here is your code.`}
                      </p>
                      <div className="mt-4 flex items-stretch border border-gold/60">
                        <span
                          id="welcome-code"
                          className="min-w-0 flex-1 select-all break-all px-4 py-3 text-center font-mono text-lg tracking-widest text-cream"
                        >
                          {offer.code}
                        </span>
                        <button
                          type="button"
                          onClick={copyCode}
                          className="shrink-0 bg-gold px-5 label-caps text-ink transition-opacity hover:opacity-90"
                        >
                          {copied ? "Copied" : "Copy"}
                        </button>
                      </div>
                      <p className="mt-3 text-xs leading-relaxed text-cream/70">
                        {offer.percent}% off your order. Paste it into the Coupon Code box at checkout. It works once,
                        for this phone number.
                      </p>
                    </>
                  )}
                  <Link
                    href="/shop"
                    onClick={() => setOpen(false)}
                    className="mt-5 block w-full border border-cream/60 px-8 py-3 text-center label-caps text-cream transition-colors hover:bg-cream hover:text-ink"
                  >
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-6">
                  <input
                    type="text"
                    required
                    maxLength={80}
                    autoComplete="name"
                    aria-label="Your name"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border border-transparent bg-cream px-4 py-3 text-sm text-ink outline-none placeholder:text-ink-soft focus:border-gold"
                  />
                  <input
                    type="tel"
                    inputMode="tel"
                    required
                    maxLength={30}
                    autoComplete="tel"
                    aria-label="Phone number"
                    placeholder="Phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="mt-3 w-full border border-transparent bg-cream px-4 py-3 text-sm text-ink outline-none placeholder:text-ink-soft focus:border-gold"
                  />
                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="mt-3 w-full bg-gold px-8 py-3 label-caps text-ink transition-opacity hover:opacity-90 disabled:opacity-50"
                  >
                    {status === "submitting" ? "Please wait…" : settings.newsletterPopupButtonText}
                  </button>
                  {error && <p className="mt-2 text-xs text-crimson">{error}</p>}
                  <p className="mt-4 text-xs leading-relaxed text-cream/55">
                    One welcome code per phone number. We&apos;ll only use your details for this offer and the
                    occasional update from Amoria. See our{" "}
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
