"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { Order } from "@/lib/types";
import { formatAed } from "@/lib/money";
import { useCart } from "@/lib/cart-context";

// Shown on a guest order once payment clears: the order is already fully
// placed at this point — this is only telling them about the account we
// created for them and the email on its way, not gating the order itself.
function GuestAccountNotice({ email }: { email: string }) {
  const [error, setError] = useState<string | null>(null);
  const [resent, setResent] = useState(false);
  const [resending, setResending] = useState(false);

  async function handleResend() {
    setResending(true);
    setError(null);
    try {
      await apiFetch("/api/auth/resend-set-password-link", { method: "POST", body: JSON.stringify({ email }) });
      setResent(true);
    } catch {
      setError("Could not resend the email. Please try again shortly.");
    } finally {
      setResending(false);
    }
  }

  return (
    <div className="mx-auto mt-8 max-w-sm border border-border bg-cream-dark/40 p-6 text-left">
      <h2 className="font-serif text-lg text-ink">Your account is ready</h2>
      <p className="mt-1 text-sm text-ink-soft">
        We&apos;ve created an Amoria account for <strong className="text-ink">{email}</strong> so you can track this
        order. Check your inbox for a link to set your password and sign in.
      </p>
      {error && <p className="mt-3 text-sm text-crimson">{error}</p>}
      <button
        type="button"
        onClick={handleResend}
        disabled={resending}
        className="mt-3 text-xs text-ink-soft underline underline-offset-2 hover:text-royal disabled:opacity-50"
      >
        {resent ? "Email resent. Check your inbox" : resending ? "Resending…" : "Didn't get it? Resend the email"}
      </button>
    </div>
  );
}

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const { clearGuestCart } = useCart();
  const [order, setOrder] = useState<Order | null>(null);
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
  const showAccountNotice = isPaid && order.needsGuestVerification;

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

      {showAccountNotice && order.guestEmail && <GuestAccountNotice email={order.guestEmail} />}

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
