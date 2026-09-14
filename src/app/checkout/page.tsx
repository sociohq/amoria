"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";
import { useAuthDrawer } from "@/lib/auth-drawer-context";
import { apiFetch, ApiError } from "@/lib/api";
import { formatAed } from "@/lib/money";

export default function CheckoutPage() {
  const { items, subtotal, loading: cartLoading } = useCart();
  const { user, loading: authLoading } = useAuth();
  const { openDrawer } = useAuthDrawer();

  const [email, setEmail] = useState("");
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [city, setCity] = useState("");
  const [emirate, setEmirate] = useState("Dubai");
  const [phone, setPhone] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState<number | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // No login required to buy — a guest checks out with just an email,
  // typed into the form below, and gets an account created for them once
  // payment succeeds (verified via an emailed code on the next page).
  const checkoutEmail = user ? user.email : email;

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const result = await apiFetch<{ url: string }>("/api/checkout/session", {
        method: "POST",
        body: JSON.stringify({
          couponCode: discount !== null ? couponCode : undefined,
          email: user ? undefined : checkoutEmail,
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

  return (
    <div className="grid max-w-4xl gap-12 px-6 py-12 md:grid-cols-2">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-baseline justify-between">
          <h1 className="font-serif text-2xl text-ink">Contact &amp; Shipping</h1>
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
        <input
          required
          type="email"
          placeholder="Email"
          value={checkoutEmail}
          disabled={Boolean(user)}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-border bg-cream px-4 py-3 text-sm outline-none focus:border-royal disabled:opacity-60"
        />
        {!user && (
          <p className="text-xs text-ink-soft">
            We&apos;ll email a code here to confirm your order and set up your account.
          </p>
        )}
        <input
          required
          placeholder="Address line 1"
          value={line1}
          onChange={(e) => setLine1(e.target.value)}
          className="w-full border border-border bg-cream px-4 py-3 text-sm outline-none focus:border-royal"
        />
        <input
          placeholder="Address line 2 (optional)"
          value={line2}
          onChange={(e) => setLine2(e.target.value)}
          className="w-full border border-border bg-cream px-4 py-3 text-sm outline-none focus:border-royal"
        />
        <div className="flex gap-4">
          <input
            required
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-1/2 border border-border bg-cream px-4 py-3 text-sm outline-none focus:border-royal"
          />
          <select
            value={emirate}
            onChange={(e) => setEmirate(e.target.value)}
            className="w-1/2 border border-border bg-cream px-4 py-3 text-sm outline-none focus:border-royal"
          >
            {["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Fujairah", "Ras Al Khaimah", "Umm Al Quwain"].map((e) => (
              <option key={e} value={e}>
                {e}
              </option>
            ))}
          </select>
        </div>
        <input
          required
          type="tel"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full border border-border bg-cream px-4 py-3 text-sm outline-none focus:border-royal"
        />

        {error && <p className="text-sm text-crimson">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-royal py-3 label-caps text-cream hover:opacity-90 disabled:opacity-50"
        >
          {submitting ? "Redirecting to payment…" : "Continue to Payment"}
        </button>
      </form>

      <div>
        <h2 className="font-serif text-2xl text-ink">Order Summary</h2>
        <div className="mt-4 space-y-3 border-y border-border py-4">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm text-ink">
              <span>
                {item.productName} ({item.variantSize}) × {item.quantity}
              </span>
              <span>{formatAed(item.lineTotal)}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 flex gap-2">
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

        <div className="mt-6 space-y-2 text-sm">
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
          <p className="text-xs text-ink-soft">Shipping is calculated on the payment page.</p>
        </div>
      </div>
    </div>
  );
}
