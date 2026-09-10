"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";
import { apiFetch, ApiError } from "@/lib/api";
import { formatAed } from "@/lib/money";

export default function CheckoutPage() {
  const { items, subtotal, loading: cartLoading } = useCart();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

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

  if (!authLoading && !user) {
    router.replace("/login?next=/checkout");
    return null;
  }

  async function applyCoupon() {
    if (!couponCode.trim()) return;
    setApplyingCoupon(true);
    setCouponError(null);
    try {
      const result = await apiFetch<{ discount: number }>("/api/coupons/validate", {
        method: "POST",
        body: JSON.stringify({ code: couponCode, cartTotal: subtotal }),
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
        <h1 className="font-serif text-2xl text-ink">Shipping Details</h1>
        <input
          required
          placeholder="Address line 1"
          value={line1}
          onChange={(e) => setLine1(e.target.value)}
          className="w-full border border-border bg-cream px-4 py-3 text-sm outline-none focus:border-emerald"
        />
        <input
          placeholder="Address line 2 (optional)"
          value={line2}
          onChange={(e) => setLine2(e.target.value)}
          className="w-full border border-border bg-cream px-4 py-3 text-sm outline-none focus:border-emerald"
        />
        <div className="flex gap-4">
          <input
            required
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-1/2 border border-border bg-cream px-4 py-3 text-sm outline-none focus:border-emerald"
          />
          <select
            value={emirate}
            onChange={(e) => setEmirate(e.target.value)}
            className="w-1/2 border border-border bg-cream px-4 py-3 text-sm outline-none focus:border-emerald"
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
          className="w-full border border-border bg-cream px-4 py-3 text-sm outline-none focus:border-emerald"
        />

        {error && <p className="text-sm text-crimson">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-emerald py-3 label-caps text-cream hover:opacity-90 disabled:opacity-50"
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
            className="flex-1 border border-border bg-cream px-3 py-2 text-sm outline-none focus:border-emerald"
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
        {discount !== null && <p className="mt-2 text-sm text-emerald">Coupon applied: -{formatAed(discount)}</p>}

        <div className="mt-6 space-y-2 text-sm">
          <div className="flex justify-between text-ink">
            <span>Subtotal</span>
            <span>{formatAed(subtotal)}</span>
          </div>
          {discount !== null && (
            <div className="flex justify-between text-emerald">
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
