"use client";

import { ReactNode, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
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
  const { user, loading, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === "/admin/login";

  // The login page is itself a child of this layout (same /admin/*
  // segment) but must render bare — gating it behind the very auth check
  // it exists to satisfy would make it unreachable.
  useEffect(() => {
    if (!isLoginPage && !loading && !user) {
      router.replace("/admin/login");
    }
  }, [isLoginPage, loading, user, router]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream-dark">
        <p className="text-sm text-ink-soft">Loading…</p>
      </div>
    );
  }
  if (user.role !== "ADMIN") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-cream-dark px-6 text-center">
        <p className="text-sm text-ink-soft">
          The account you&apos;re signed in with (<strong className="text-ink">{user.email}</strong>) doesn&apos;t
          have admin access.
        </p>
        <button
          onClick={() => logout().then(() => router.push("/admin/login"))}
          className="text-sm text-ink underline underline-offset-2 hover:text-royal"
        >
          Sign in with a different account
        </button>
      </div>
    );
  }

  return (
    // h-screen + overflow-hidden (not min-h-screen) caps this at exactly
    // the viewport — otherwise a tall page grows the whole document and
    // the browser scrolls it natively, dragging the sidebar along with
    // it instead of leaving it fixed while just <main> scrolls. min-h-0
    // on the flex column is the usual flexbox gotcha: without it a flex
    // child can't actually be constrained smaller than its content, so
    // <main>'s own overflow-y-auto would never kick in.
    <div className="flex h-screen overflow-hidden bg-cream-dark">
      <AdminSidebar />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <AdminTopbar />
        <main className="flex-1 overflow-y-auto p-8">{children}</main>
      </div>
    </div>
  );
}
