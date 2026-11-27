"use client";

import { useRef, useState } from "react";
import { submitContactForm } from "@/lib/contact";
import { friendlySubmitError } from "@/lib/formError";
import { HoneypotField } from "./HoneypotField";
import { Turnstile, type TurnstileHandle } from "./Turnstile";
import { useBotProtection } from "./useBotProtection";

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
  const bot = useBotProtection();
  const turnstileRef = useRef<TurnstileHandle>(null);
  const honeypotRef = useRef<HTMLInputElement>(null);

  function resetChallenge() {
    bot.clearToken();
    turnstileRef.current?.reset();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "submitting" || !bot.canSubmit) return;
    setStatus("submitting");
    setError(null);
    try {
      await submitContactForm({
        name,
        email,
        phone: phone || undefined,
        subject: subject || undefined,
        message,
        ...bot.payload(honeypotRef.current?.value ?? ""),
      });
      setStatus("done");
    } catch (err) {
      setStatus("error");
      setError(friendlySubmitError(err));
    } finally {
      resetChallenge();
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
    <form onSubmit={handleSubmit} className="relative space-y-5 text-left">
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
      <Turnstile ref={turnstileRef} onToken={bot.setToken} />
      {error && <p className="text-sm text-crimson">{error}</p>}
      <button
        type="submit"
        disabled={status === "submitting" || !bot.canSubmit}
        className="label-caps bg-ink px-8 py-3 text-cream transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {status === "submitting" ? "Sending…" : "Send Message"}
      </button>
      <HoneypotField ref={honeypotRef} />
    </form>
  );
}
