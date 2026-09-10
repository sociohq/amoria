"use client";

import { ReactNode } from "react";
import { useAuth } from "@/lib/auth-context";
import { AdminNav } from "@/components/admin/AdminNav";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <p className="px-6 py-20 text-center text-ink-soft">Loading…</p>;
  }
  if (!user || user.role !== "ADMIN") {
    return <p className="px-6 py-20 text-center text-ink-soft">You need an admin account to view this page.</p>;
  }

  return (
    <div>
      <AdminNav />
      <div className="px-6 py-8">{children}</div>
    </div>
  );
}
