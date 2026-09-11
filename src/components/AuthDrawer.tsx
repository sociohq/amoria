"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useAuthDrawer } from "@/lib/auth-drawer-context";
import { ApiError } from "@/lib/api";

// Sign in / create account, as a slide-out drawer from the right — same
// visual language as CartDrawer — instead of a dedicated page. Opened from
// the header's user icon, and from anywhere else that needs a logged-in
// user (checkout, wishlist).
export function AuthDrawer() {
  const { login, register } = useAuth();
  const { open, mode, setMode, closeDrawer } = useAuthDrawer();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function reset() {
    setName("");
    setEmail("");
    setPassword("");
    setError(null);
  }

  function handleClose() {
    closeDrawer();
    reset();
  }

  function switchMode(next: "login" | "register") {
    setMode(next);
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await register(email, password, name);
      }
      handleClose();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass = "w-full border border-border bg-white px-4 py-3 text-sm outline-none focus:border-emerald";

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={handleClose}
        className={`fixed inset-0 z-50 bg-black/40 transition-opacity duration-300 ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Panel */}
      <div
        className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-cream shadow-xl transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-label={mode === "login" ? "Sign in" : "Create account"}
      >
        <div className="flex items-center justify-between border-b border-border px-8 py-7">
          <p className="font-serif text-2xl text-ink">{mode === "login" ? "Sign In" : "Create Account"}</p>
          <button onClick={handleClose} aria-label="Close" className="text-ink-soft hover:text-ink">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
              <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <input
                required
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass}
              />
            )}
            <input
              type="email"
              required
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
            />
            <input
              type="password"
              required
              minLength={mode === "register" ? 8 : undefined}
              placeholder={mode === "register" ? "Password (min. 8 characters)" : "Password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
            />
            {error && <p className="text-sm text-crimson">{error}</p>}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-ink py-3 label-caps text-cream hover:opacity-90 disabled:opacity-50"
            >
              {submitting
                ? mode === "login"
                  ? "Signing in…"
                  : "Creating account…"
                : mode === "login"
                  ? "Sign In"
                  : "Create Account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-ink-soft">
            {mode === "login" ? (
              <>
                New here?{" "}
                <button onClick={() => switchMode("register")} className="text-emerald hover:underline">
                  Create an account
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button onClick={() => switchMode("login")} className="text-emerald hover:underline">
                  Sign in
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </>
  );
}
