"use client";

import { useEffect, useState } from "react";
import { listCoupons, createCoupon, deleteCoupon, CouponInput } from "@/lib/admin";
import { Coupon } from "@/lib/types";
import { formatAed } from "@/lib/money";
import { ApiError } from "@/lib/api";

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

  const inputClass = "border border-border bg-cream px-3 py-2 text-sm outline-none focus:border-emerald";

  return (
    <div>
      <h1 className="mb-6 font-serif text-2xl text-ink">Coupons</h1>

      <form onSubmit={handleCreate} className="mb-8 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
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
        <button disabled={submitting} className="bg-ink px-4 py-2 label-caps text-cream hover:opacity-90 disabled:opacity-50">
          Create
        </button>
      </form>
      {error && <p className="mb-4 text-sm text-crimson">{error}</p>}

      <table className="w-full max-w-3xl border-collapse text-sm">
        <thead>
          <tr className="border-b border-border text-left text-ink-soft">
            <th className="py-2">Code</th>
            <th className="py-2">Discount</th>
            <th className="py-2">Used</th>
            <th className="py-2">Active</th>
            <th className="py-2" />
          </tr>
        </thead>
        <tbody>
          {coupons.map((c) => (
            <tr key={c.id} className="border-b border-border">
              <td className="py-2 text-ink">{c.code}</td>
              <td className="py-2 text-ink-soft">{c.type === "PERCENTAGE" ? `${c.value}%` : formatAed(c.value)}</td>
              <td className="py-2 text-ink-soft">
                {c.usedCount}
                {c.maxUsage ? ` / ${c.maxUsage}` : ""}
              </td>
              <td className="py-2 text-ink-soft">{c.active ? "Yes" : "No"}</td>
              <td className="py-2 text-right">
                <button onClick={() => handleDelete(c.id)} className="text-crimson hover:underline">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
