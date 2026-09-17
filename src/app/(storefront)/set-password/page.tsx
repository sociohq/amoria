"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { apiFetch, ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

// Landed on from the "set your password" link emailed after a guest
// checkout clears payment — email + code arrive as query params from that
// link (see backend otp.service.ts issueSetPasswordLink), the customer
// only has to choose a password.
function SetPasswordForm() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const code = searchParams.get("code");
  const { refresh: refreshAuth } = useAuth();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [resent, setResent] = useState(false);
  const [resending, setResending] = useState(false);

  if (!email || !code) {
    return (
      <div className="mx-auto max-w-sm text-center">
        <h1 className="font-serif text-2xl text-ink">This link isn&apos;t valid</h1>
        <p className="mt-2 text-sm text-ink-soft">
          Please use the link from the email we sent you, or request a new one from the order confirmation page.
        </p>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    setSubmitting(true);
    try {
      await apiFetch("/api/auth/set-password", { method: "POST", body: JSON.stringify({ email, code, password }) });
      await refreshAuth();
      setDone(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleResend() {
    setResending(true);
    setError(null);
    try {
      await apiFetch("/api/auth/resend-set-password-link", { method: "POST", body: JSON.stringify({ email }) });
      setResent(true);
    } catch {
      setError("Could not resend the link. Please try again shortly.");
    } finally {
      setResending(false);
    }
  }

  if (done) {
    return (
      <div className="mx-auto max-w-sm text-center">
        <h1 className="font-serif text-2xl text-ink">You&apos;re all set</h1>
        <p className="mt-2 text-sm text-ink-soft">
          Your password is set and you&apos;re signed in to your Amoria account.
        </p>
        <Link href="/shop" className="mt-6 inline-block border border-ink px-8 py-3 label-caps text-ink hover:bg-ink hover:text-cream">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="text-center font-serif text-2xl text-ink">Set Your Password</h1>
      <p className="mt-2 text-center text-sm text-ink-soft">
        Activating the Amoria account created for <strong className="text-ink">{email}</strong>.
      </p>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-ink-soft">Password</label>
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-border bg-cream px-4 py-3 text-sm outline-none focus:border-royal"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-ink-soft">Confirm Password</label>
          <input
            type="password"
            required
            minLength={8}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border border-border bg-cream px-4 py-3 text-sm outline-none focus:border-royal"
          />
        </div>
        {error && <p className="text-sm text-crimson">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-royal py-3 label-caps text-cream transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {submitting ? "Setting Password…" : "Set Password & Sign In"}
        </button>
      </form>
      <button
        type="button"
        onClick={handleResend}
        disabled={resending}
        className="mx-auto mt-3 block text-xs text-ink-soft underline underline-offset-2 hover:text-royal disabled:opacity-50"
      >
        {resent ? "Link resent. Check your inbox" : resending ? "Resending…" : "Link expired? Send a new one"}
      </button>
    </div>
  );
}

export default function SetPasswordPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-20">
      <Suspense fallback={<p className="text-center text-ink-soft">Loading…</p>}>
        <SetPasswordForm />
      </Suspense>
    </div>
  );
}
