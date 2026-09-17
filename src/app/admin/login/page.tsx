"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { ApiError } from "@/lib/api";

// A dedicated admin sign-in screen — separate from the storefront's
// customer-facing sign-in drawer (AuthDrawer), even though both post to
// the same /api/auth/login. Rendered bare (see admin/layout.tsx's
// pathname check) so it's not itself gated behind the admin auth check
// it exists to satisfy.
export default function AdminLoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email, password);
      router.replace("/admin");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex items-center justify-center gap-2">
          <span className="font-serif text-2xl text-cream">Amoria</span>
          <span className="rounded-full border border-gold/40 px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-widest text-gold">
            Admin
          </span>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-cream/10 bg-cream/[0.03] p-8">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-cream/60">Email</label>
            <input
              type="email"
              required
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-cream/15 bg-cream/[0.06] px-3 py-2 text-sm text-cream outline-none focus:border-gold/50"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-cream/60">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-cream/15 bg-cream/[0.06] px-3 py-2 text-sm text-cream outline-none focus:border-gold/50"
            />
          </div>
          {error && <p className="text-sm text-crimson">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-md bg-gold py-2.5 text-sm font-medium text-ink transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {submitting ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
