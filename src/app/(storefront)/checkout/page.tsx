"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";
import { useAuthDrawer } from "@/lib/auth-drawer-context";
import { apiFetch, ApiError } from "@/lib/api";
import { formatAed } from "@/lib/money";
import { getPublicSettings } from "@/lib/settings";
import { WELCOME_CODE_KEY } from "@/lib/welcome";

const EMIRATES = ["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Fujairah", "Ras Al Khaimah", "Umm Al Quwain"];

const STEPS = [
  { n: 1, label: "Contact" },
  { n: 2, label: "Address" },
  { n: 3, label: "Review & Pay" },
] as const;

// The server's breakdown of what this order costs (POST /api/checkout/quote).
interface Quote {
  subtotal: number;
  discount: number;
  shippingFee: number;
  codFee: number;
  total: number;
  coupon: { code: string; type: "PERCENTAGE" | "FIXED"; value: number } | null;
  couponError: string | null;
}

const inputClass =
  "w-full border border-border bg-cream px-4 py-3 text-sm outline-none focus:border-royal disabled:opacity-60";

export default function CheckoutPage() {
  const { items, subtotal, loading: cartLoading } = useCart();
  const { user, loading: authLoading } = useAuth();
  const { openDrawer } = useAuthDrawer();

  const [step, setStep] = useState<1 | 2 | 3>(1);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [city, setCity] = useState("");
  const [emirate, setEmirate] = useState("Dubai");
  // What the customer has typed, and the code they actually applied. Whether the
  // applied code works — and what it takes off — is decided by the server on every
  // quote below, never worked out here.
  const [couponCode, setCouponCode] = useState("");
  const [appliedCode, setAppliedCode] = useState<string | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [quote, setQuote] = useState<Quote | null>(null);
  const [quoting, setQuoting] = useState(false);
  const quoteSeq = useRef(0);

  // A visitor who claimed the welcome offer has their code waiting here — it
  // is only pre-filled, they still press Apply.
  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem(WELCOME_CODE_KEY);
    } catch {
      // Storage blocked — they can still type or paste the code.
    }
    if (!saved) return;
    const code = saved;
    // Deferred a tick: browser storage is only readable after hydration.
    queueMicrotask(() => setCouponCode((current) => current || code));
  }, []);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Cash on delivery is offered when the admin has it switched on; it adds a fee.
  const [codEnabled, setCodEnabled] = useState(false);
  const [codFee, setCodFee] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<"CARD" | "COD">("CARD");

  useEffect(() => {
    getPublicSettings()
      .then((s) => {
        setCodEnabled(Boolean(s.codEnabled));
        setCodFee(s.codFee ?? 0);
      })
      .catch(() => {}); // cash on delivery just isn't offered
  }, []);

  // No login required to buy — a guest checks out with just their details
  // typed into the form below, and gets an account created for them once
  // payment succeeds (verified via an emailed code on the next page).
  const checkoutName = user ? user.name : fullName;
  const checkoutEmail = user ? user.email : email;

  const isCod = codEnabled && paymentMethod === "COD";

  // The summary shows the server's numbers — the same calculation the order and
  // the payment are built from — and asks again whenever anything that changes
  // the price changes: the cart, the applied code, the payment method.
  const cartKey = items.map((i) => `${i.variantId}:${i.quantity}`).join(",");
  const guestEmail = user ? undefined : email || undefined;
  useEffect(() => {
    if (cartLoading || items.length === 0) return;
    const seq = ++quoteSeq.current;
    // A tick of debounce so typing an email or clicking + doesn't fire a request per keystroke.
    const timer = setTimeout(() => {
      setQuoting(true);
      apiFetch<Quote>("/api/checkout/quote", {
        method: "POST",
        body: JSON.stringify({
          paymentMethod: isCod ? "COD" : "CARD",
          couponCode: appliedCode ?? undefined,
          email: guestEmail,
          items: user ? undefined : items.map((i) => ({ variantId: i.variantId, quantity: i.quantity })),
        }),
      })
        .then((q) => {
          if (seq !== quoteSeq.current) return; // an older answer arriving late
          setQuote(q);
          if (appliedCode && q.couponError) {
            // The code stopped applying (or never did): say so, and drop it so the
            // next numbers shown really are what will be charged.
            setCouponError(q.couponError);
            setAppliedCode(null);
            try {
              if (localStorage.getItem(WELCOME_CODE_KEY) === appliedCode && /already used|usage limit|expired/i.test(q.couponError)) {
                localStorage.removeItem(WELCOME_CODE_KEY);
              }
            } catch {
              // Nothing to clean up if storage isn't available.
            }
          }
        })
        .catch(() => {
          if (seq === quoteSeq.current) setQuote(null);
        })
        .finally(() => {
          if (seq === quoteSeq.current) setQuoting(false);
        });
    }, 250);
    return () => clearTimeout(timer);
    // cartKey stands in for items: it changes exactly when a line or quantity does.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartKey, cartLoading, appliedCode, isCod, guestEmail, user?.id]);

  function applyCoupon() {
    const code = couponCode.trim().toUpperCase();
    if (!code) return;
    setCouponError(null);
    setAppliedCode(code);
  }

  function removeCoupon() {
    setAppliedCode(null);
    setCouponError(null);
    setCouponCode("");
  }

  async function handlePay(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const result = await apiFetch<{ url: string }>("/api/checkout/session", {
        method: "POST",
        body: JSON.stringify({
          paymentMethod: isCod ? "COD" : "CARD",
          couponCode: appliedCode ?? undefined,
          email: user ? undefined : checkoutEmail,
          name: user ? undefined : checkoutName,
          items: user ? undefined : items.map((i) => ({ variantId: i.variantId, quantity: i.quantity })),
          shippingAddress: { line1, line2: line2 || undefined, city, emirate, phone },
        }),
      });
      window.location.href = result.url; // Stripe Checkout, or straight to the order page for cash on delivery
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong");
      setSubmitting(false);
    }
  }

  if (cartLoading || authLoading) {
    return <div className="mx-auto max-w-3xl px-6 py-20 text-center text-ink-soft">Loading…</div>;
  }

  if (items.length === 0) {
    return <div className="mx-auto max-w-3xl px-6 py-20 text-center text-ink-soft">Your cart is empty.</div>;
  }

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 sm:px-12">
      <div className="mb-8 flex items-center justify-between">
        <Link href="/shop" className="text-xs text-ink-soft underline underline-offset-2 hover:text-royal">
          ← Back to Shop
        </Link>
        {!user && (
          <button
            type="button"
            onClick={() => openDrawer("login")}
            className="text-xs text-ink-soft underline underline-offset-2 hover:text-royal"
          >
            Sign in instead
          </button>
        )}
      </div>

      {/* Step indicator */}
      <div className="mb-10 flex items-center justify-center">
        {STEPS.map((s, i) => (
          <div key={s.n} className="flex items-center">
            <button
              type="button"
              // Only lets you jump back to an already-completed step, not
              // skip ahead of one you haven't filled in yet.
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
              <span className={`label-caps ${step === s.n ? "text-ink" : "text-ink-soft"}`}>{s.label}</span>
            </button>
            {i < STEPS.length - 1 && <span className="mx-3 text-border sm:mx-6">›</span>}
          </div>
        ))}
      </div>

      <div className="grid gap-12 lg:grid-cols-[1fr_360px]">
        <div>
          {step === 1 && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setStep(2);
              }}
              className="space-y-4"
            >
              <h1 className="font-serif text-2xl text-ink">Contact Details</h1>
              {!user && (
                <p className="text-sm text-ink-soft">
                  No account needed. We&apos;ll create one for you automatically and email your order confirmation.
                </p>
              )}
              <div>
                <label className="label-caps mb-1 block text-ink-soft">Full Name</label>
                <input
                  required
                  placeholder="Jane Doe"
                  value={checkoutName}
                  disabled={Boolean(user)}
                  onChange={(e) => setFullName(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="label-caps mb-1 block text-ink-soft">Email</label>
                <input
                  required
                  type="email"
                  placeholder="you@example.com"
                  value={checkoutEmail}
                  disabled={Boolean(user)}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="label-caps mb-1 block text-ink-soft">Phone</label>
                <input
                  required
                  type="tel"
                  placeholder="+971 50 123 4567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={inputClass}
                />
              </div>
              <button type="submit" className="w-full bg-ink py-3 label-caps text-cream hover:opacity-90">
                Continue to Address →
              </button>
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

          {step === 2 && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setStep(3);
              }}
              className="space-y-4"
            >
              <h1 className="font-serif text-2xl text-ink">Shipping Address</h1>
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
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/3 border border-ink py-3 label-caps text-ink hover:bg-ink hover:text-cream"
                >
                  ← Back
                </button>
                <button type="submit" className="flex-1 bg-ink py-3 label-caps text-cream hover:opacity-90">
                  Continue to Review →
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handlePay} className="space-y-6">
              <h1 className="font-serif text-2xl text-ink">Review &amp; Pay</h1>

              <div className="border border-border p-4">
                <div className="flex items-center justify-between">
                  <p className="label-caps text-ink-soft">Contact</p>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-xs text-ink-soft underline underline-offset-2 hover:text-royal"
                  >
                    Edit
                  </button>
                </div>
                <p className="mt-1 text-sm text-ink">
                  {checkoutName} · {checkoutEmail} · {phone}
                </p>
              </div>

              <div className="border border-border p-4">
                <div className="flex items-center justify-between">
                  <p className="label-caps text-ink-soft">Shipping Address</p>
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="text-xs text-ink-soft underline underline-offset-2 hover:text-royal"
                  >
                    Edit
                  </button>
                </div>
                <p className="mt-1 text-sm text-ink">
                  {line1}
                  {line2 && `, ${line2}`}, {city}, {emirate}
                </p>
              </div>

              {codEnabled && (
                <fieldset>
                  <legend className="label-caps mb-2 text-ink-soft">Payment Method</legend>
                  <div className="space-y-2">
                    {(
                      [
                        { value: "CARD", title: "Pay by card", note: "Credit or debit card, Apple Pay, Google Pay" },
                        {
                          value: "COD",
                          title: "Cash on delivery",
                          note: `Pay the courier in cash when your order arrives. +${formatAed(codFee)} handling fee`,
                        },
                      ] as const
                    ).map((opt) => (
                      <label
                        key={opt.value}
                        className={`flex cursor-pointer items-start gap-3 border p-4 transition-colors ${
                          paymentMethod === opt.value ? "border-ink bg-cream-dark/40" : "border-border hover:border-ink-soft"
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={opt.value}
                          checked={paymentMethod === opt.value}
                          onChange={() => setPaymentMethod(opt.value)}
                          className="mt-1"
                          style={{ accentColor: "var(--color-ink)" }}
                        />
                        <span>
                          <span className="block text-sm font-medium text-ink">{opt.title}</span>
                          <span className="block text-xs text-ink-soft">{opt.note}</span>
                        </span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              )}

              <div>
                <label className="label-caps mb-1 block text-ink-soft">Coupon Code</label>
                <div className="flex gap-2">
                  <input
                    placeholder="Coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        applyCoupon();
                      }
                    }}
                    disabled={appliedCode !== null}
                    className="flex-1 border border-border bg-cream px-3 py-2 text-sm outline-none focus:border-royal disabled:opacity-60"
                  />
                  {appliedCode ? (
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="border border-ink px-4 py-2 label-caps text-ink hover:bg-ink hover:text-cream"
                    >
                      Remove
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={applyCoupon}
                      disabled={quoting}
                      className="border border-ink px-4 py-2 label-caps text-ink hover:bg-ink hover:text-cream disabled:opacity-50"
                    >
                      Apply
                    </button>
                  )}
                </div>
                {couponError && <p className="mt-2 text-sm text-crimson">{couponError}</p>}
                {appliedCode && quote?.coupon && quote.discount > 0 && (
                  <p className="mt-2 text-sm text-royal">
                    Code {quote.coupon.code} applied:{" "}
                    {quote.coupon.type === "PERCENTAGE" ? `${quote.coupon.value}% off your items` : "discount on your items"} (−
                    {formatAed(quote.discount)}). Delivery is not discounted.
                  </p>
                )}
              </div>

              {error && <p className="text-sm text-crimson">{error}</p>}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-1/3 border border-ink py-3 label-caps text-ink hover:bg-ink hover:text-cream"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  disabled={submitting || quoting || !quote}
                  className="flex-1 bg-royal py-3 label-caps text-cream hover:opacity-90 disabled:opacity-50"
                >
                  {submitting
                    ? isCod
                      ? "Placing your order…"
                      : "Redirecting to payment…"
                    : isCod
                      ? "Place Order"
                      : "Continue to Payment"}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Order summary — persistent across all three steps. */}
        <div className="h-fit border border-border bg-cream-dark/40 p-6">
          <p className="label-caps text-ink-soft">
            Order Summary ({itemCount} {itemCount === 1 ? "Item" : "Items"})
          </p>
          <div className="mt-4 space-y-4 border-b border-border pb-4">
            {items.map((item) => (
              <div key={item.id} className="flex gap-3">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden bg-cream">
                  {item.image && (
                    <Image src={item.image} alt={item.productName} fill sizes="56px" className="object-cover" />
                  )}
                  <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-ink text-[10px] text-cream">
                    {item.quantity}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-ink">{item.productName}</p>
                  <p className="text-xs text-ink-soft">{item.variantSize}</p>
                </div>
                <p className="text-sm text-ink">{formatAed(item.lineTotal)}</p>
              </div>
            ))}
          </div>
          <div className={`mt-4 space-y-2 text-sm transition-opacity ${quoting ? "opacity-60" : ""}`}>
            <div className="flex justify-between text-ink">
              <span>Subtotal</span>
              <span>{formatAed(quote ? quote.subtotal : subtotal)}</span>
            </div>
            {quote && quote.discount > 0 && (
              <div className="flex justify-between text-royal">
                <span>Discount{quote.coupon ? ` (${quote.coupon.code})` : ""}</span>
                <span>-{formatAed(quote.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-ink-soft">
              <span>Shipping</span>
              <span>{!quote ? "Calculated at checkout" : quote.shippingFee === 0 ? "Free" : formatAed(quote.shippingFee)}</span>
            </div>
            {quote && quote.codFee > 0 && (
              <div className="flex justify-between text-ink-soft">
                <span>Cash on delivery fee</span>
                <span>{formatAed(quote.codFee)}</span>
              </div>
            )}
          </div>
          <div className="mt-4 flex justify-between border-t border-border pt-4 font-medium text-ink">
            <span>Total</span>
            <span>{quote ? formatAed(quote.total) : "—"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
