"use client";

import { useEffect, useState } from "react";
import { listAdminOrders, updateOrderStatus } from "@/lib/admin";
import { AdminOrder } from "@/lib/types";
import { formatAed } from "@/lib/money";

const STATUSES = ["PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"] as const;
const ADMIN_SETTABLE = ["SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"] as const;

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [filter, setFilter] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  function refresh() {
    listAdminOrders(filter || undefined).then(({ orders }) => setOrders(orders));
  }
  useEffect(refresh, [filter]);

  async function handleStatusChange(id: string, status: string) {
    setError(null);
    try {
      await updateOrderStatus(id, status);
      refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update status");
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-serif text-2xl text-ink">Orders</h1>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="border border-border bg-cream px-3 py-2 text-sm">
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
      {error && <p className="mb-4 text-sm text-crimson">{error}</p>}

      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-border text-left text-ink-soft">
            <th className="py-2">Customer</th>
            <th className="py-2">Items</th>
            <th className="py-2">Total</th>
            <th className="py-2">Status</th>
            <th className="py-2">Update</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id} className="border-b border-border align-top">
              <td className="py-2 text-ink">
                {o.user?.name ?? "Guest (pending)"}
                <br />
                <span className="text-xs text-ink-soft">{o.user?.email ?? o.guestEmail}</span>
              </td>
              <td className="py-2 text-ink-soft">
                {o.items.map((i) => (
                  <div key={i.id}>
                    {i.productName} ({i.variantSize}) × {i.quantity}
                  </div>
                ))}
              </td>
              <td className="py-2 text-ink">{formatAed(o.total)}</td>
              <td className="py-2 text-ink-soft">{o.status}</td>
              <td className="py-2">
                {ADMIN_SETTABLE.includes(o.status as (typeof ADMIN_SETTABLE)[number]) || o.status === "PAID" ? (
                  <select
                    defaultValue=""
                    onChange={(e) => e.target.value && handleStatusChange(o.id, e.target.value)}
                    className="border border-border bg-cream px-2 py-1 text-xs"
                  >
                    <option value="">Change to…</option>
                    {ADMIN_SETTABLE.filter((s) => s !== o.status).map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span className="text-xs text-ink-soft">N/A</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
