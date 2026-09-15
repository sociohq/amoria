"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { apiFetch, ApiError } from "@/lib/api";
import { Order } from "@/lib/types";
import { formatAed } from "@/lib/money";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";

// Shown on a guest order once payment clears: confirms the email they
// checked out with via a 6-digit code, which also signs them into the
// account created for the order — no separate registration step.
function GuestVerifyForm({ email, onVerified }: { email: string; onVerified: () => void }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [resent, setResent] = useState(false);
  const [resending, setResending] = useState(false);

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setVerifying(true);
    try {
      await apiFetch("/api/auth/verify-guest-otp", { method: "POST", body: JSON.stringify({ email, code }) });
      onVerified();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong");
    } finally {
      setVerifying(false);
    }
  }

  async function handleResend() {
    setResending(true);
    setError(null);
    try {
      await apiFetch("/api/auth/resend-guest-otp", { method: "POST", body: JSON.stringify({ email }) });
      setResent(true);
    } catch {
      setError("Could not resend the code. Please try again shortly.");
    } finally {
      setResending(false);
    }
  }

  return (
    <div className="mx-auto mt-8 max-w-sm border border-border bg-cream-dark/40 p-6 text-left">
      <h2 className="font-serif text-lg text-ink">Verify your email</h2>
      <p className="mt-1 text-sm text-ink-soft">
        We&apos;ve sent a 6-digit code to <strong className="text-ink">{email}</strong> to confirm your order and
        activate your account.
      </p>
      <form onSubmit={handleVerify} className="mt-4 space-y-3">
        <input
          required
          inputMode="numeric"
          maxLength={6}
          placeholder="000000"
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
          className="w-full border border-border bg-cream px-4 py-3 text-center text-lg tracking-[0.5em] outline-none focus:border-royal"
        />
        {error && <p className="text-sm text-crimson">{error}</p>}
        <button
          type="submit"
          disabled={verifying || code.length !== 6}
          className="w-full bg-royal py-3 label-caps text-cream transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {verifying ? "Verifying…" : "Verify & Sign In"}
        </button>
      </form>
      <button
        type="button"
        onClick={handleResend}
        disabled={resending}
        className="mt-3 text-xs text-ink-soft underline underline-offset-2 hover:text-royal disabled:opacity-50"
      >
        {resent ? "Code resent. Check your inbox" : resending ? "Resending…" : "Didn't get it? Resend code"}
      </button>
    </div>
  );
}

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const { refresh: refreshAuth } = useAuth();
  const { clearGuestCart } = useCart();
  const [order, setOrder] = useState<Order | null>(null);
  const [verified, setVerified] = useState(false);
  // No orderId is known synchronously from the URL, so that case is baked
  // into the initial state rather than set from inside the effect.
  const [status, setStatus] = useState<"loading" | "ready" | "error">(orderId ? "loading" : "error");

  useEffect(() => {
    if (!orderId) return;
    apiFetch<{ order: Order }>(`/api/orders/${orderId}`)
      .then(({ order }) => {
        setOrder(order);
        setStatus("ready");
        if (order.status !== "PENDING") clearGuestCart();
      })
      .catch(() => setStatus("error"));
    // Runs once per order id — clearGuestCart's identity is stable for the
    // life of the provider, so it isn't worth re-running this for.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  if (status === "loading") {
    return <p className="text-center text-ink-soft">Confirming your order…</p>;
  }
  if (status === "error" || !order) {
    return <p className="text-center text-ink-soft">We couldn&apos;t find that order.</p>;
  }

  const isPaid = order.status !== "PENDING";
  const showVerify = isPaid && order.needsGuestVerification && !verified;

  return (
    <div className="text-center">
      <h1 className="font-serif text-3xl text-ink">{isPaid ? "Thank you for your order" : "Order received"}</h1>
      <p className="mt-2 text-ink-soft">
        {isPaid
          ? "Your payment was successful. A confirmation has been recorded."
          : "We're still confirming your payment. This page will update once it clears."}
      </p>

      <div className="mx-auto mt-8 max-w-md space-y-3 border-y border-border py-6 text-left">
        {order.items.map((item) => (
          <div key={item.id} className="flex justify-between text-sm text-ink">
            <span>
              {item.productName} ({item.variantSize}) × {item.quantity}
            </span>
            <span>{formatAed(item.unitPrice * item.quantity)}</span>
          </div>
        ))}
        <div className="flex justify-between border-t border-border pt-3 font-medium text-ink">
          <span>Total</span>
          <span>{formatAed(order.total)}</span>
        </div>
      </div>

      {showVerify && order.guestEmail && (
        <GuestVerifyForm
          email={order.guestEmail}
          onVerified={() => {
            setVerified(true);
            refreshAuth();
          }}
        />
      )}
      {verified && (
        <p className="mx-auto mt-6 max-w-sm text-sm text-royal">
          Email verified. You&apos;re now signed in to your new Amoria account.
        </p>
      )}

      <Link href="/shop" className="mt-8 inline-block border border-ink px-8 py-3 label-caps text-ink hover:bg-ink hover:text-cream">
        Continue Shopping
      </Link>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-20">
      <Suspense fallback={<p className="text-center text-ink-soft">Loading…</p>}>
        <OrderSuccessContent />
      </Suspense>
    </div>
  );
}
