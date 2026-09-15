"use client";

import { useEffect, useState } from "react";
import { listCoupons, createCoupon, deleteCoupon, CouponInput } from "@/lib/admin";
import { Coupon } from "@/lib/types";
import { formatAed } from "@/lib/money";
import { ApiError } from "@/lib/api";
import { PageHeader, Card, Button, Table, TableHead, inputClass } from "@/components/admin/ui";

const EMPTY: CouponInput = { code: "", type: "PERCENTAGE", value: 10 };

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [draft, setDraft] = useState<CouponInput>(EMPTY);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function refresh() {
    listCoupons().then(({ coupons }) => setCoupons(coupons));
  }
  useEffect(refresh, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await createCoupon(draft);
      setDraft(EMPTY);
      refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this coupon?")) return;
    await deleteCoupon(id);
    refresh();
  }

  return (
    <div>
      <PageHeader title="Coupons" />

      <form onSubmit={handleCreate} className="mb-6 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
        <input
          required
          placeholder="CODE"
          value={draft.code}
          onChange={(e) => setDraft({ ...draft, code: e.target.value.toUpperCase() })}
          className={inputClass}
        />
        <select value={draft.type} onChange={(e) => setDraft({ ...draft, type: e.target.value as "PERCENTAGE" | "FIXED" })} className={inputClass}>
          <option value="PERCENTAGE">% Off</option>
          <option value="FIXED">AED Off</option>
        </select>
        <input
          required
          type="number"
          placeholder="Value"
          value={draft.value}
          onChange={(e) => setDraft({ ...draft, value: Number(e.target.value) })}
          className={inputClass}
        />
        <input
          type="number"
          placeholder="Min order (AED, optional)"
          value={draft.minOrderValue ?? ""}
          onChange={(e) => setDraft({ ...draft, minOrderValue: e.target.value ? Number(e.target.value) : undefined })}
          className={inputClass}
        />
        <input
          type="number"
          placeholder="Max total uses (optional)"
          value={draft.maxUsage ?? ""}
          onChange={(e) => setDraft({ ...draft, maxUsage: e.target.value ? Number(e.target.value) : undefined })}
          className={inputClass}
        />
        <input
          type="number"
          placeholder="Max uses/customer (optional)"
          value={draft.usagePerUser ?? ""}
          onChange={(e) => setDraft({ ...draft, usagePerUser: e.target.value ? Number(e.target.value) : undefined })}
          className={inputClass}
        />
        <input type="date" value={draft.expiresAt ?? ""} onChange={(e) => setDraft({ ...draft, expiresAt: e.target.value || undefined })} className={inputClass} />
        <Button type="submit" disabled={submitting}>
          Create
        </Button>
      </form>
      {error && <p className="mb-4 text-sm text-crimson">{error}</p>}

      <Card>
        <Table>
          <TableHead>
            <tr>
              <th>Code</th>
              <th>Discount</th>
              <th>Used</th>
              <th>Active</th>
              <th />
            </tr>
          </TableHead>
          <tbody className="divide-y divide-border">
            {coupons.map((c) => (
              <tr key={c.id}>
                <td className="text-ink">{c.code}</td>
                <td className="text-ink-soft">{c.type === "PERCENTAGE" ? `${c.value}%` : formatAed(c.value)}</td>
                <td className="text-ink-soft">
                  {c.usedCount}
                  {c.maxUsage ? ` / ${c.maxUsage}` : ""}
                </td>
                <td className="text-ink-soft">{c.active ? "Yes" : "No"}</td>
                <td className="text-right">
                  <Button variant="danger" size="sm" onClick={() => handleDelete(c.id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
    </div>
  );
}
