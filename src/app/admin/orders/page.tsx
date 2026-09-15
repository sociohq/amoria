"use client";

import { useEffect, useState } from "react";
import { listAdminOrders, updateOrderStatus } from "@/lib/admin";
import { AdminOrder } from "@/lib/types";
import { formatAed } from "@/lib/money";
import { PageHeader, Card, Table, TableHead, Badge, inputClass } from "@/components/admin/ui";

const STATUSES = ["PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"] as const;
const ADMIN_SETTABLE = ["SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"] as const;

const STATUS_TONE: Record<string, "neutral" | "success" | "warning" | "danger"> = {
  PENDING: "warning",
  PAID: "success",
  SHIPPED: "success",
  DELIVERED: "success",
  CANCELLED: "danger",
  REFUNDED: "danger",
};

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
      <PageHeader
        title="Orders"
        action={
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className={`${inputClass} w-auto`}>
            <option value="">All statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        }
      />
      {error && <p className="mb-4 text-sm text-crimson">{error}</p>}

      <Card>
        <Table>
          <TableHead>
            <tr>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Update</th>
            </tr>
          </TableHead>
          <tbody className="divide-y divide-border">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-10 text-center text-ink-soft">
                  No orders yet.
                </td>
              </tr>
            ) : (
              orders.map((o) => (
                <tr key={o.id} className="align-top">
                  <td className="text-ink">
                    {o.user?.name ?? "Guest (pending)"}
                    <br />
                    <span className="text-xs text-ink-soft">{o.user?.email ?? o.guestEmail}</span>
                  </td>
                  <td className="text-ink-soft">
                    {o.items.map((i) => (
                      <div key={i.id}>
                        {i.productName} ({i.variantSize}) × {i.quantity}
                      </div>
                    ))}
                  </td>
                  <td className="font-medium text-ink">{formatAed(o.total)}</td>
                  <td>
                    <Badge tone={STATUS_TONE[o.status] ?? "neutral"}>{o.status}</Badge>
                  </td>
                  <td>
                    {ADMIN_SETTABLE.includes(o.status as (typeof ADMIN_SETTABLE)[number]) || o.status === "PAID" ? (
                      <select
                        defaultValue=""
                        onChange={(e) => e.target.value && handleStatusChange(o.id, e.target.value)}
                        className={`${inputClass} w-auto py-1.5 text-xs`}
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
              ))
            )}
          </tbody>
        </Table>
      </Card>
    </div>
  );
}
