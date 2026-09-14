"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useAuthDrawer } from "@/lib/auth-drawer-context";
import { ApiError } from "@/lib/api";
import { formatAed } from "@/lib/money";
import {
  FRAGRANCE_FAMILIES,
  FragranceFamily,
  Gender,
  PricingTier,
  createCustomPerfumeCheckout,
  getCustomPerfumePricing,
} from "@/lib/customPerfume";

const EMIRATES = ["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Fujairah", "Ras Al Khaimah", "Umm Al Quwain"];

const STEPS = [
  { n: 1, label: "Your Name" },
  { n: 2, label: "Gender" },
  { n: 3, label: "Fragrance Family" },
  { n: 4, label: "Concentration" },
  { n: 5, label: "Review & Pay" },
] as const;

const GENDER_OPTIONS: { value: Gender; label: string }[] = [
  { value: "him", label: "For Him" },
  { value: "her", label: "For Her" },
  { value: "unisex", label: "Unisex" },
];

const inputClass =
  "w-full border border-border bg-cream px-4 py-3 text-sm outline-none focus:border-royal disabled:opacity-60";

// A selectable tile — the same interaction (click to choose, one active
// at a time, explicit Continue) used for gender/family/concentration
// rather than radios, matching the card-based reference the site owner
// shared.
function OptionTile({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 border px-4 py-6 text-center transition-colors ${
        active ? "border-royal bg-royal/5 text-ink" : "border-border text-ink-soft hover:border-ink/30"
      }`}
    >
      {children}
    </button>
  );
}

export default function CustomPerfumePage() {
  const { user, loading: authLoading } = useAuth();
  const { openDrawer } = useAuthDrawer();

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  const [customerName, setCustomerName] = useState("");
  const [gender, setGender] = useState<Gender | null>(null);
  const [fragranceFamily, setFragranceFamily] = useState<FragranceFamily | null>(null);
  const [concentration, setConcentration] = useState<string | null>(null);

  const [tiers, setTiers] = useState<PricingTier[] | null>(null);
  const [tiersError, setTiersError] = useState(false);

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [city, setCity] = useState("");
  const [emirate, setEmirate] = useState("Dubai");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const checkoutName = user ? user.name : customerName;
  const checkoutEmail = user ? user.email : email;

  useEffect(() => {
    getCustomPerfumePricing()
      .then((t) => setTiers(t))
      .catch(() => setTiersError(true));
  }, []);

  const selectedTier = tiers?.find((t) => t.concentration === concentration) ?? null;

  async function handleConfirm(e: React.FormEvent) {
    e.preventDefault();
    if (!gender || !fragranceFamily || !concentration) return;
    setError(null);
    setSubmitting(true);
    try {
      const result = await createCustomPerfumeCheckout({
        customerName: checkoutName,
        gender,
        fragranceFamily,
        concentration: concentration as "20" | "25" | "30",
        email: user ? undefined : checkoutEmail,
        shippingAddress: { line1, line2: line2 || undefined, city, emirate, phone },
      });
      window.location.href = result.url; // hand off to Stripe Checkout
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong");
      setSubmitting(false);
    }
  }

  if (authLoading) {
    return <div className="mx-auto max-w-3xl px-6 py-20 text-center text-ink-soft">Loading…</div>;
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-16 sm:px-12">
      <div className="text-center">
        <p className="label-caps text-gold">Your Story. Your Scent.</p>
        <h1 className="mt-2 font-serif text-4xl text-ink sm:text-5xl">Create Your Own Perfume</h1>
        <p className="mx-auto mt-3 max-w-lg text-sm text-ink-soft">
          Personal, meaningful, and uniquely yours. Tell us a little about you and we&apos;ll craft a fragrance to
          match.
        </p>
      </div>

      {/* Step indicator */}
      <div className="mt-10 flex flex-wrap items-center justify-center gap-y-3">
        {STEPS.map((s, i) => (
          <div key={s.n} className="flex items-center">
            <button
              type="button"
              onClick={() => s.n < step && setStep(s.n)}
              disabled={s.n >= step}
              className="flex items-center gap-2 disabled:cursor-default"
            >
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs ${
                  step === s.n ? "bg-ink text-cream" : step > s.n ? "bg-royal text-cream" : "bg-cream-dark text-ink-soft"
                }`}
              >
                {s.n}
              </span>
              <span className={`label-caps hidden sm:inline ${step === s.n ? "text-ink" : "text-ink-soft"}`}>
                {s.label}
              </span>
            </button>
            {i < STEPS.length - 1 && <span className="mx-2 text-border sm:mx-4">›</span>}
          </div>
        ))}
      </div>

      <div className="mx-auto mt-10 max-w-xl">
        {step === 1 && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setStep(2);
            }}
            className="space-y-4"
          >
            <h2 className="font-serif text-2xl text-ink">Let&apos;s start with your name</h2>
            <div>
              <label className="label-caps mb-1 block text-ink-soft">Your Name</label>
              <input
                required
                placeholder="Jane Doe"
                value={checkoutName}
                disabled={Boolean(user)}
                onChange={(e) => setCustomerName(e.target.value)}
                className={inputClass}
              />
            </div>
            <button type="submit" className="w-full bg-ink py-3 label-caps text-cream hover:opacity-90">
              Continue →
            </button>
          </form>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h2 className="font-serif text-2xl text-ink">Who is this fragrance for?</h2>
            <div className="flex gap-4">
              {GENDER_OPTIONS.map((o) => (
                <OptionTile key={o.value} active={gender === o.value} onClick={() => setGender(o.value)}>
                  <span className="label-caps">{o.label}</span>
                </OptionTile>
              ))}
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-1/3 border border-ink py-3 label-caps text-ink hover:bg-ink hover:text-cream"
              >
                ← Back
              </button>
              <button
                type="button"
                disabled={!gender}
                onClick={() => setStep(3)}
                className="flex-1 bg-ink py-3 label-caps text-cream hover:opacity-90 disabled:opacity-40"
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <h2 className="font-serif text-2xl text-ink">Which fragrance family appeals to you?</h2>
            <div className="flex flex-col gap-3 sm:flex-row">
              {FRAGRANCE_FAMILIES.map((f) => (
                <OptionTile key={f} active={fragranceFamily === f} onClick={() => setFragranceFamily(f)}>
                  <span className="label-caps">{f}</span>
                </OptionTile>
              ))}
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-1/3 border border-ink py-3 label-caps text-ink hover:bg-ink hover:text-cream"
              >
                ← Back
              </button>
              <button
                type="button"
                disabled={!fragranceFamily}
                onClick={() => setStep(4)}
                className="flex-1 bg-ink py-3 label-caps text-cream hover:opacity-90 disabled:opacity-40"
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <h2 className="font-serif text-2xl text-ink">Choose your concentration</h2>
            <p className="text-sm text-ink-soft">A higher concentration means richer, longer-lasting fragrance oil.</p>
            {tiersError ? (
              <p className="text-sm text-crimson">
                Custom perfume pricing isn&apos;t available right now. Please try again shortly.
              </p>
            ) : !tiers ? (
              <p className="text-sm text-ink-soft">Loading pricing…</p>
            ) : (
              <div className="flex flex-col gap-3 sm:flex-row">
                {tiers.map((t) => (
                  <OptionTile
                    key={t.concentration}
                    active={concentration === t.concentration}
                    onClick={() => setConcentration(t.concentration)}
                  >
                    <span className="label-caps block">{t.concentration}%</span>
                    <span className="mt-1 block text-sm text-ink">{formatAed(t.price)}</span>
                  </OptionTile>
                ))}
              </div>
            )}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="w-1/3 border border-ink py-3 label-caps text-ink hover:bg-ink hover:text-cream"
              >
                ← Back
              </button>
              <button
                type="button"
                disabled={!concentration}
                onClick={() => setStep(5)}
                className="flex-1 bg-ink py-3 label-caps text-cream hover:opacity-90 disabled:opacity-40"
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {step === 5 && gender && fragranceFamily && concentration && (
          <form onSubmit={handleConfirm} className="space-y-6">
            <h2 className="font-serif text-2xl text-ink">Review &amp; Confirm</h2>

            <div className="border border-border p-4">
              <div className="flex items-center justify-between">
                <p className="label-caps text-ink-soft">Your Perfume</p>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="text-xs text-ink-soft underline underline-offset-2 hover:text-royal"
                >
                  Edit
                </button>
              </div>
              <p className="mt-1 text-sm text-ink">
                {checkoutName} · {GENDER_OPTIONS.find((o) => o.value === gender)?.label} · {fragranceFamily} ·{" "}
                {concentration}%
              </p>
              {selectedTier && <p className="mt-2 font-serif text-2xl text-ink">{formatAed(selectedTier.price)}</p>}
            </div>

            {!user && (
              <div>
                <label className="label-caps mb-1 block text-ink-soft">Email</label>
                <input
                  required
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                />
              </div>
            )}
            <div>
              <label className="label-caps mb-1 block text-ink-soft">Contact Number</label>
              <input
                required
                type="tel"
                placeholder="+971 50 123 4567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="label-caps mb-1 block text-ink-soft">Address Line 1</label>
              <input required value={line1} onChange={(e) => setLine1(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="label-caps mb-1 block text-ink-soft">Address Line 2 (Optional)</label>
              <input value={line2} onChange={(e) => setLine2(e.target.value)} className={inputClass} />
            </div>
            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="label-caps mb-1 block text-ink-soft">City</label>
                <input required value={city} onChange={(e) => setCity(e.target.value)} className={inputClass} />
              </div>
              <div className="w-1/2">
                <label className="label-caps mb-1 block text-ink-soft">Emirate</label>
                <select value={emirate} onChange={(e) => setEmirate(e.target.value)} className={inputClass}>
                  {EMIRATES.map((e) => (
                    <option key={e} value={e}>
                      {e}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {error && <p className="text-sm text-crimson">{error}</p>}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(4)}
                className="w-1/3 border border-ink py-3 label-caps text-ink hover:bg-ink hover:text-cream"
              >
                ← Back
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-royal py-3 label-caps text-cream hover:opacity-90 disabled:opacity-50"
              >
                {submitting ? "Redirecting to payment…" : `Confirm & Pay${selectedTier ? ` ${formatAed(selectedTier.price)}` : ""}`}
              </button>
            </div>

            {!user && (
              <p className="text-center text-sm text-ink-soft">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => openDrawer("login")}
                  className="underline underline-offset-2 hover:text-royal"
                >
                  Sign in
                </button>
              </p>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
