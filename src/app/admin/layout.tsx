"use client";

import { ReactNode } from "react";
import { useAuth } from "@/lib/auth-context";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopbar } from "@/components/admin/AdminTopbar";

// A real dashboard shell — sidebar + topbar + content pane — instead of
// reusing the storefront's own Header/Footer with a thin nav bar bolted
// underneath. This is a sibling top-level segment to the (storefront)
// route group (see src/app/(storefront)/layout.tsx), so none of the
// storefront's chrome (announcement bar, mega-menu, cart drawer,
// newsletter popup, the floating Aurora mark) ever mounts here — this
// layout owns 100% of what renders around an admin page.
export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream-dark">
        <p className="text-sm text-ink-soft">Loading…</p>
      </div>
    );
  }
  if (!user || user.role !== "ADMIN") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream-dark px-6 text-center">
        <p className="text-sm text-ink-soft">You need an admin account to view this page.</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-cream-dark">
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminTopbar />
        <main className="flex-1 overflow-y-auto p-8">{children}</main>
      </div>
    </div>
  );
}
