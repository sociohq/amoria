"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useAuth } from "@/lib/auth-context";
import { useAuthDrawer } from "@/lib/auth-drawer-context";
import { ApiError } from "@/lib/api";
import { formatAed } from "@/lib/money";
import {
  FRAGRANCE_FAMILIES,
  FRAGRANCE_FAMILY_IMAGES,
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

// Minimal line-art symbols (matching the header's thin stroke-icon
// style) rather than emoji, which render inconsistently across
// platforms and read as childish against the rest of the site.
function MarsIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="15" r="6" />
      <line x1="13.5" y1="10.5" x2="19" y2="5" />
      <polyline points="14 5 19 5 19 10" />
    </svg>
  );
}

function VenusIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="9" r="6" />
      <line x1="12" y1="15" x2="12" y2="21" />
      <line x1="9" y1="18" x2="15" y2="18" />
    </svg>
  );
}

// The combined Mars + Venus glyph — a single circle radiating both
// symbols — reads as "either/both" for the neutral "For Everyone"
// option, rather than a literal third gender.
function UnisexIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="15.5" y1="8.5" x2="19" y2="5" />
      <polyline points="14.5 5 19 5 19 9.5" />
      <line x1="12" y1="17" x2="12" y2="21" />
      <line x1="9.5" y1="19" x2="14.5" y2="19" />
    </svg>
  );
}

const GENDER_OPTIONS: { value: Gender; label: string; Icon: () => React.JSX.Element }[] = [
  { value: "him", label: "For Him", Icon: MarsIcon },
  { value: "her", label: "For Her", Icon: VenusIcon },
  { value: "unisex", label: "For Everyone", Icon: UnisexIcon },
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

// A wider, left-aligned tile (ingredient photo + label) for the
// 8-option fragrance family grid — a row of centered OptionTiles would
// be too cramped for that many options, so this reuses the reference's
// 2-column layout instead.
function FamilyTile({
  active,
  onClick,
  image,
  label,
}: {
  active: boolean;
  onClick: () => void;
  image: string;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-3 border px-4 py-4 text-left transition-colors ${
        active ? "border-royal bg-royal/5 text-ink" : "border-border text-ink-soft hover:border-ink/30"
      }`}
    >
      <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-cream-dark">
        <Image src={image} alt="" fill sizes="48px" className="object-cover" />
      </span>
      <span className="label-caps">{label}</span>
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
    <div className="px-6 py-24 sm:px-12">
      {/* A curved panel split in two: the marketing heading and the
          vertical step tracker top-aligned on the left, the interactive
          customization flow (plus the WhatsApp offer, spanning the full
          width below both) on the right — not a popup, and not stacked
          above the form either. The panel runs edge to edge between the
          page's own side margins (matching the header's px-6/sm:px-12)
          rather than being centered with its own max-width, so it reads
          as part of the page rather than a floating card. The form side
          still gets more of the width (7:10 rather than an even split)
          since Step 5's full contact/address form needs the room to lay
          fields out side by side instead of one long stack that forces
          the whole panel to scroll. */}
      <div className="overflow-hidden rounded-[2rem] border border-border bg-white shadow-xl">
        <div className="md:grid md:grid-cols-[7fr_10fr]">
          {/* Left: heading + step tracker, with the line-art illustration
              as this column's own background (not the whole page) — an
              absolutely-positioned Image behind the relative-positioned
              content below, both scoped to just this column. */}
          <div className="relative overflow-hidden border-b border-border p-6 sm:p-10 md:border-b-0 md:border-r">
            <div className="absolute inset-0">
              <Image
                src="/banners/custom-perfume-illustration.png"
                alt=""
                fill
                sizes="(min-width: 768px) 41.67vw, 100vw"
                priority
                className="object-cover"
              />
            </div>
            {/* A light scrim over the image so the heading/step text stays
                easily readable regardless of what's directly behind it. */}
            <div className="absolute inset-0 bg-white/70" />

            <div className="relative">
              <p className="label-caps text-gold">Your Story. Your Scent.</p>
              <h1 className="mt-2 font-serif text-4xl text-ink">Create Your Own Perfume</h1>
              <p className="mt-3 max-w-sm text-sm text-ink-soft">
                Personal, meaningful, and uniquely yours. Tell us a little about you and we&apos;ll craft a
                fragrance to match.
              </p>

              {/* Vertical step tracker — moved here from atop the form so
                  the form column can stay focused on just the current step. */}
              <ol className="mt-10 max-w-xs">
                {STEPS.map((s, i) => {
                  const done = step > s.n;
                  const current = step === s.n;
                  const isLast = i === STEPS.length - 1;
                  return (
                    <li key={s.n} className="relative flex gap-4 pb-8 last:pb-0">
                      {!isLast && (
                        <span
                          aria-hidden
                          className={`absolute left-4 top-8 h-[calc(100%-2rem)] w-px -translate-x-1/2 ${
                            done ? "bg-royal" : "bg-border"
                          }`}
                        />
                      )}
                      <button
                        type="button"
                        onClick={() => s.n < step && setStep(s.n)}
                        disabled={s.n >= step}
                        aria-current={current ? "step" : undefined}
                        className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs disabled:cursor-default ${
                          current ? "bg-ink text-cream" : done ? "bg-royal text-cream" : "bg-cream-dark text-ink-soft"
                        }`}
                      >
                        {done ? "✓" : s.n}
                      </button>
                      <p className={`label-caps pt-1.5 ${current ? "text-ink" : "text-ink-soft"}`}>{s.label}</p>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>

          {/* Right: the wizard */}
          <div className="p-6 sm:p-10">
            <div>
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
                      <span className="flex justify-center" aria-hidden>
                        <o.Icon />
                      </span>
                      <span className="label-caps mt-2 block">{o.label}</span>
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
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {FRAGRANCE_FAMILIES.map((f) => (
                    <FamilyTile
                      key={f}
                      active={fragranceFamily === f}
                      onClick={() => setFragranceFamily(f)}
                      image={FRAGRANCE_FAMILY_IMAGES[f]}
                      label={f}
                    />
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
                <p className="text-sm text-ink-soft">
                  A higher concentration means richer, longer-lasting fragrance oil.
                </p>
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
              <form onSubmit={handleConfirm} className="space-y-4">
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
                  {selectedTier && (
                    <p className="mt-2 font-serif text-2xl text-ink">{formatAed(selectedTier.price)}</p>
                  )}
                </div>

                {/* Paired up (email+phone, then city+emirate) rather than
                    one long single-column stack, now that the wider form
                    column has the room for it — keeps the whole step
                    visible without scrolling the panel. */}
                <div className={`grid gap-4 ${user ? "" : "sm:grid-cols-2"}`}>
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
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="label-caps mb-1 block text-ink-soft">Address Line 1</label>
                    <input
                      required
                      value={line1}
                      onChange={(e) => setLine1(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="label-caps mb-1 block text-ink-soft">Address Line 2 (Optional)</label>
                    <input value={line2} onChange={(e) => setLine2(e.target.value)} className={inputClass} />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="label-caps mb-1 block text-ink-soft">City</label>
                    <input required value={city} onChange={(e) => setCity(e.target.value)} className={inputClass} />
                  </div>
                  <div>
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
                    {submitting
                      ? "Redirecting to payment…"
                      : `Confirm & Pay${selectedTier ? ` ${formatAed(selectedTier.price)}` : ""}`}
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
          </div>

        {/* Below every step, inside the same panel — the site owner's
            WhatsApp concierge offer: every custom blend is filmed while
            it's made, and that video is sent over WhatsApp on request
            rather than posted anywhere public. */}
        <div className="border-t border-border bg-cream-dark/40 p-8 text-center">
          <p className="label-caps text-gold">Watch Yours Come To Life</p>
          <h2 className="mt-2 font-serif text-2xl text-ink">Join Our WhatsApp For Your Perfume&apos;s Video</h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-ink-soft">
            Every custom blend is hand-crafted, and we film the process. Message us on WhatsApp and we&apos;ll send
            you the video of your own perfume being made.
          </p>
          <a
            href={`https://wa.me/971507550447?text=${encodeURIComponent(
              "Hi! I'd love a video of how my custom Amoria perfume was made."
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 bg-[#25D366] px-8 py-3 label-caps text-white hover:bg-[#1ebe5b]"
          >
            <WhatsAppIcon />
            Chat On WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12.04 0C5.408 0 .04 5.373.04 12c0 2.115.552 4.104 1.518 5.828L0 24l6.335-1.653A11.94 11.94 0 0012.04 24C18.672 24 24 18.627 24 12S18.672 0 12.04 0zm0 21.833a9.79 9.79 0 01-4.994-1.363l-.358-.213-3.75.98.999-3.652-.233-.375A9.767 9.767 0 012.24 12c0-5.428 4.416-9.833 9.8-9.833 5.383 0 9.799 4.405 9.799 9.833 0 5.428-4.416 9.833-9.799 9.833z" />
    </svg>
  );
}
