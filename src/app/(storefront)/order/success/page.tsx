"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
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
    return (
      <div className="text-center">
        <p className="text-ink-soft">We couldn&apos;t find that order.</p>
        <p className="mt-2 text-sm text-ink-soft">
          If you placed it from your Amoria account, sign in and open this link again.
        </p>
        <Link href="/shop" className="mt-8 inline-block border border-ink px-8 py-3 label-caps text-ink hover:bg-ink hover:text-cream">
          Continue Shopping
        </Link>
      </div>
    );
  }

  const isPaid = order.status !== "PENDING";
  const showAccountNotice = isPaid && order.needsGuestVerification;
  const closed = order.status === "CANCELLED" || order.status === "REFUNDED";
  // How far along the order is: 0 awaiting payment, 1 ordered, 2 shipped, 3 delivered.
  const stage = order.status === "DELIVERED" ? 3 : order.status === "SHIPPED" ? 2 : isPaid ? 1 : 0;
  const heading = closed
    ? order.status === "REFUNDED"
      ? "Order refunded"
      : "Order cancelled"
    : stage === 3
      ? "Your order has been delivered"
      : stage === 2
        ? "Your order is on its way"
        : isPaid
          ? "Thank you for your order"
          : "Order received";
  const intro = closed
    ? "This order is no longer active. Questions? Reply to your confirmation email."
    : stage === 3
      ? "We hope you love it."
      : stage === 2
        ? "It has been handed to the courier. Follow it below."
        : isPaid
          ? "Your payment was successful. We're getting your order ready and will email you the moment it ships."
          : "We're still confirming your payment. This page will update once it clears.";

  return (
    <div className="text-center">
      <h1 className="font-serif text-3xl text-ink">{heading}</h1>
      <p className="mt-2 text-ink-soft">{intro}</p>
      <p className="mt-1 text-xs text-ink-soft">Order #{order.id.slice(-8).toUpperCase()}</p>

      {!closed && stage > 0 && (
        <div className="mx-auto mt-8 max-w-md">
          <ol className="grid grid-cols-3" aria-label="Order progress">
            {["Ordered", "Shipped", "Delivered"].map((label, i) => {
              const done = i < stage;
              return (
                <li key={label} className="flex flex-col items-center">
                  <div className="flex w-full items-center">
                    <span className={`h-0.5 flex-1 ${i === 0 ? "bg-transparent" : i < stage ? "bg-ink" : "bg-border"}`} />
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 text-xs ${
                        done ? "border-ink bg-ink text-cream" : "border-border bg-white text-transparent"
                      }`}
                    >
                      ✓
                    </span>
                    <span className={`h-0.5 flex-1 ${i === 2 ? "bg-transparent" : i + 1 < stage ? "bg-ink" : "bg-border"}`} />
                  </div>
                  <span className={`mt-2 text-xs ${done ? "font-medium text-ink" : "text-ink-soft"}`}>{label}</span>
                </li>
              );
            })}
          </ol>
          {order.trackingNumber && (
            <div className="mt-6 text-sm text-ink-soft">
              Tracking number <span className="font-medium text-ink">{order.trackingNumber}</span>
              <div>
                <Link
                  href={`/track?awb=${encodeURIComponent(order.trackingNumber)}`}
                  className="mt-3 inline-block bg-ink px-8 py-3 label-caps text-cream transition-opacity hover:opacity-90"
                >
                  Track your parcel
                </Link>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="mx-auto mt-8 max-w-md space-y-3 border-y border-border py-6 text-left">
        {order.items.map((item) => (
          <div key={item.id} className="flex items-center justify-between gap-3 text-sm text-ink">
            {item.imageUrl && (
              <span className="relative h-14 w-12 shrink-0 overflow-hidden bg-cream-dark">
                <Image src={item.imageUrl} alt="" fill sizes="48px" className="object-cover" />
              </span>
            )}
            <span className="min-w-0 flex-1">
              {item.productName} ({item.variantSize}) × {item.quantity}
            </span>
            <span className="shrink-0">{formatAed(item.unitPrice * item.quantity)}</span>
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
