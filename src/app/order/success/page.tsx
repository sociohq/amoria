"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { Order } from "@/lib/types";
import { formatAed } from "@/lib/money";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
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
      })
      .catch(() => setStatus("error"));
  }, [orderId]);

  if (status === "loading") {
    return <p className="text-center text-ink-soft">Confirming your order…</p>;
  }
  if (status === "error" || !order) {
    return <p className="text-center text-ink-soft">We couldn&apos;t find that order.</p>;
  }

  const isPaid = order.status !== "PENDING";

  return (
    <div className="text-center">
      <h1 className="font-serif text-3xl text-ink">{isPaid ? "Thank you for your order" : "Order received"}</h1>
      <p className="mt-2 text-ink-soft">
        {isPaid
          ? "Your payment was successful — a confirmation has been recorded."
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
