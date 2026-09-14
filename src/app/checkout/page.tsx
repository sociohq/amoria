"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";
import { useAuthDrawer } from "@/lib/auth-drawer-context";
import { apiFetch, ApiError } from "@/lib/api";
import { formatAed } from "@/lib/money";
import { getPublicSettings } from "@/lib/settings";

const EMIRATES = ["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Fujairah", "Ras Al Khaimah", "Umm Al Quwain"];

const STEPS = [
  { n: 1, label: "Contact" },
  { n: 2, label: "Address" },
  { n: 3, label: "Review & Pay" },
] as const;

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
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState<number | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Shown as a real, computed shipping line in the summary sidebar
  // throughout checkout, rather than deferring "calculated at checkout"
  // — both thresholds are already public (ShippingProgress uses the
  // same endpoint for the cart drawer's free-shipping nudge).
  const [shippingFee, setShippingFee] = useState<number | null>(null);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState<number | null>(null);

  useEffect(() => {
    getPublicSettings()
      .then((s) => {
        setShippingFee(s.standardShippingFee);
        setFreeShippingThreshold(s.freeShippingThreshold);
      })
      .catch(() => {}); // sidebar just shows "Calculated at checkout" instead
  }, []);

  // No login required to buy — a guest checks out with just their details
  // typed into the form below, and gets an account created for them once
  // payment succeeds (verified via an emailed code on the next page).
  const checkoutName = user ? user.name : fullName;
  const checkoutEmail = user ? user.email : email;

  const discountedSubtotal = subtotal - (discount ?? 0);
  const estimatedShipping =
    shippingFee == null
      ? null
      : freeShippingThreshold != null && discountedSubtotal >= freeShippingThreshold
        ? 0
        : shippingFee;
  const estimatedTotal = estimatedShipping == null ? discountedSubtotal : discountedSubtotal + estimatedShipping;

  async function applyCoupon() {
    if (!couponCode.trim()) return;
    setApplyingCoupon(true);
    setCouponError(null);
    try {
      const result = await apiFetch<{ discount: number }>("/api/coupons/validate", {
        method: "POST",
        body: JSON.stringify({ code: couponCode, cartTotal: subtotal, email: user ? undefined : checkoutEmail }),
      });
      setDiscount(result.discount);
    } catch (err) {
      setDiscount(null);
      setCouponError(err instanceof ApiError ? err.message : "Could not validate coupon");
    } finally {
      setApplyingCoupon(false);
    }
  }

  async function handlePay(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const result = await apiFetch<{ url: string }>("/api/checkout/session", {
        method: "POST",
        body: JSON.stringify({
          couponCode: discount !== null ? couponCode : undefined,
          email: user ? undefined : checkoutEmail,
          name: user ? undefined : checkoutName,
          items: user ? undefined : items.map((i) => ({ variantId: i.variantId, quantity: i.quantity })),
          shippingAddress: { line1, line2: line2 || undefined, city, emirate, phone },
        }),
      });
      window.location.href = result.url; // hand off to Stripe Checkout
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

              <div>
                <label className="label-caps mb-1 block text-ink-soft">Coupon Code</label>
                <div className="flex gap-2">
                  <input
                    placeholder="Coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 border border-border bg-cream px-3 py-2 text-sm outline-none focus:border-royal"
                  />
                  <button
                    type="button"
                    onClick={applyCoupon}
                    disabled={applyingCoupon}
                    className="border border-ink px-4 py-2 label-caps text-ink hover:bg-ink hover:text-cream"
                  >
                    Apply
                  </button>
                </div>
                {couponError && <p className="mt-2 text-sm text-crimson">{couponError}</p>}
                {discount !== null && <p className="mt-2 text-sm text-royal">Coupon applied: -{formatAed(discount)}</p>}
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
                  disabled={submitting}
                  className="flex-1 bg-royal py-3 label-caps text-cream hover:opacity-90 disabled:opacity-50"
                >
                  {submitting ? "Redirecting to payment…" : "Continue to Payment"}
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
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between text-ink">
              <span>Subtotal</span>
              <span>{formatAed(subtotal)}</span>
            </div>
            {discount !== null && (
              <div className="flex justify-between text-royal">
                <span>Discount</span>
                <span>-{formatAed(discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-ink-soft">
              <span>Shipping</span>
              <span>
                {estimatedShipping == null
                  ? "Calculated at checkout"
                  : estimatedShipping === 0
                    ? "Free"
                    : formatAed(estimatedShipping)}
              </span>
            </div>
          </div>
          <div className="mt-4 flex justify-between border-t border-border pt-4 font-medium text-ink">
            <span>Total</span>
            <span>{formatAed(estimatedTotal)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
