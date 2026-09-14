"use client";

import { useEffect, useState } from "react";
import { getDashboard } from "@/lib/admin";
import { DashboardSummary } from "@/lib/types";
import { formatAed } from "@/lib/money";

export default function AdminDashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getDashboard()
      .then(setSummary)
      .catch(() => setError("Could not load dashboard. Is the backend reachable?"));
  }, []);

  if (error) return <p className="text-crimson">{error}</p>;
  if (!summary) return <p className="text-ink-soft">Loading…</p>;

  const cards = [
    { label: "Total Orders", value: summary.totalOrders },
    { label: "Total Revenue", value: formatAed(summary.totalRevenue) },
    { label: "Pending Orders", value: summary.pendingOrders },
    { label: "Active Products", value: summary.activeProducts },
    { label: "Low Stock Variants (≤5)", value: summary.lowStockVariants },
  ];

  return (
    <div>
      <h1 className="mb-6 font-serif text-2xl text-ink">Dashboard</h1>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {cards.map((c) => (
          <div key={c.label} className="border border-border bg-cream-dark p-5">
            <p className="text-2xl text-ink">{c.value}</p>
            <p className="mt-1 text-xs text-ink-soft">{c.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
