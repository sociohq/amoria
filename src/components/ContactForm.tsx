"use client";

import { useState } from "react";
import { submitContactForm } from "@/lib/contact";
import { ApiError } from "@/lib/api";

const inputClass =
  "w-full border-b border-border bg-transparent py-2 text-sm text-ink outline-none transition-colors placeholder:text-ink-soft focus:border-royal";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setError(null);
    try {
      await submitContactForm({
        name,
        email,
        phone: phone || undefined,
        subject: subject || undefined,
        message,
      });
      setStatus("done");
    } catch (err) {
      setStatus("error");
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    }
  }

  if (status === "done") {
    return (
      <div className="rounded-lg border border-border bg-cream-dark/40 p-6 text-center">
        <p className="text-ink">Thank you — we&apos;ve received your message and will get back to you shortly.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 text-left">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="label-caps mb-1 block text-ink-soft">Name</label>
          <input required value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="label-caps mb-1 block text-ink-soft">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="label-caps mb-1 block text-ink-soft">Phone (optional)</label>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="label-caps mb-1 block text-ink-soft">Subject (optional)</label>
          <input value={subject} onChange={(e) => setSubject(e.target.value)} className={inputClass} />
        </div>
      </div>
      <div>
        <label className="label-caps mb-1 block text-ink-soft">Message</label>
        <textarea
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={inputClass}
        />
      </div>
      {error && <p className="text-sm text-crimson">{error}</p>}
      <button
        type="submit"
        disabled={status === "submitting"}
        className="label-caps bg-ink px-8 py-3 text-cream transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {status === "submitting" ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}
