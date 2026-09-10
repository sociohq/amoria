"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { ApiError } from "@/lib/api";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await register(email, password, name);
      router.push("/");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-sm px-6 py-20">
      <h1 className="mb-8 text-center font-serif text-3xl text-ink">Create Account</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          required
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-border bg-cream px-4 py-3 text-sm outline-none focus:border-emerald"
        />
        <input
          type="email"
          required
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-border bg-cream px-4 py-3 text-sm outline-none focus:border-emerald"
        />
        <input
          type="password"
          required
          minLength={8}
          placeholder="Password (min. 8 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-border bg-cream px-4 py-3 text-sm outline-none focus:border-emerald"
        />
        {error && <p className="text-sm text-crimson">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-ink py-3 label-caps text-cream hover:opacity-90 disabled:opacity-50"
        >
          {submitting ? "Creating account…" : "Create Account"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-ink-soft">
        Already have an account?{" "}
        <Link href="/login" className="text-emerald hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
