"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getDashboard } from "@/lib/admin";
import { DashboardSummary } from "@/lib/types";
import { formatAed } from "@/lib/money";

function Icon({ children }: { children: React.ReactNode }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  );
}
const OrdersIcon = () => <Icon><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></Icon>;
const RevenueIcon = () => <Icon><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></Icon>;
const PendingIcon = () => <Icon><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" /></Icon>;
const ProductsIcon = () => <Icon><path d="M21 8 12 3 3 8l9 5 9-5Z" /><path d="M3 8v8l9 5 9-5V8" /></Icon>;
const StockIcon = () => <Icon><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" /><path d="M12 9v4M12 17h.01" /></Icon>;

// A card per stat rather than the previous plain bordered boxes — an
// icon tile plus a colored accent gives each number somewhere to live
// and makes the low-stock warning actually read as a warning (crimson)
// rather than sitting identically styled next to ordinary metrics.
function StatCard({
  icon,
  label,
  value,
  tone = "ink",
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  tone?: "ink" | "royal" | "crimson";
  href?: string;
}) {
  const toneClasses = {
    ink: "bg-ink/5 text-ink",
    royal: "bg-royal/10 text-royal",
    crimson: "bg-crimson/10 text-crimson",
  }[tone];

  const content = (
    <div className="flex items-start justify-between rounded-xl border border-border bg-white p-5 transition-shadow hover:shadow-sm">
      <div>
        <p className="text-sm text-ink-soft">{label}</p>
        <p className="mt-2 text-2xl font-medium text-ink">{value}</p>
      </div>
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${toneClasses}`}>{icon}</div>
    </div>
  );

  return href ? <Link href={href}>{content}</Link> : content;
}

export default function AdminDashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getDashboard()
      .then(setSummary)
      .catch(() => setError("Could not load dashboard. Is the backend reachable?"));
  }, []);

  if (error) return <p className="text-sm text-crimson">{error}</p>;
  if (!summary) return <p className="text-sm text-ink-soft">Loading…</p>;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <StatCard icon={<OrdersIcon />} label="Total Orders" value={summary.totalOrders} href="/admin/orders" />
        <StatCard icon={<RevenueIcon />} label="Total Revenue" value={formatAed(summary.totalRevenue)} tone="royal" />
        <StatCard
          icon={<PendingIcon />}
          label="Pending Orders"
          value={summary.pendingOrders}
          tone={summary.pendingOrders > 0 ? "royal" : "ink"}
          href="/admin/orders"
        />
        <StatCard icon={<ProductsIcon />} label="Active Products" value={summary.activeProducts} href="/admin/products" />
        <StatCard
          icon={<StockIcon />}
          label="Low Stock Variants (≤5)"
          value={summary.lowStockVariants}
          tone={summary.lowStockVariants > 0 ? "crimson" : "ink"}
          href="/admin/products"
        />
      </div>

      <div className="rounded-xl border border-border bg-white p-6">
        <p className="label-caps text-ink-soft">Quick Links</p>
        <div className="mt-4 flex flex-wrap gap-3">
          {[
            { href: "/admin/products/new", label: "Add a Product" },
            { href: "/admin/coupons", label: "Create a Coupon" },
            { href: "/admin/gender-showcase", label: "Edit For Him / For Her" },
            { href: "/admin/posts/new", label: "Write a Blog Post" },
          ].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="border border-ink px-4 py-2 text-sm text-ink transition-colors hover:bg-ink hover:text-cream"
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
