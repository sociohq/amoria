"use client";

import Image from "next/image";
import { useState } from "react";
import { subscribeToNewsletter } from "@/lib/newsletter";
import { ApiError } from "@/lib/api";

const SHOP_LINKS = [
  { label: "All Fragrances", href: "/shop" },
  { label: "For Him", href: "/shop?category=for-him" },
  { label: "For Her", href: "/shop?category=for-her" },
  { label: "Unisex", href: "/shop?category=for-unisex" },
  { label: "Gift Sets", href: "/shop?category=gift-sets" },
];

const HOUSE_LINKS = [
  { label: "Our Story", href: "/our-story" },
  { label: "Sustainability", href: "/sustainability" },
  { label: "Contact", href: "/contact" },
  { label: "FAQ", href: "/faq" },
];

const LEGAL_LINKS = [
  { label: "Terms & Conditions", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Return & Refund Policy", href: "/returns" },
];

function FooterColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <p className="label-caps mb-4 text-ink-soft/70">{title}</p>
      <ul className="space-y-2">
        {links.map((l) => (
          <li key={l.href}>
            <a href={l.href} className="text-sm text-ink hover:text-emerald">
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    try {
      await subscribeToNewsletter(email);
      setSubscribed(true);
    } catch (err) {
      // Rare (the endpoint only really rejects a malformed email) — the
      // input just stays put so they can fix it and retry.
      alert(err instanceof ApiError ? err.message : "Something went wrong — please try again.");
    }
  }

  return (
    <footer className="bg-ink text-cream">
      <div className="grid gap-10 px-6 py-16 sm:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-1">
          <Image src="/logo.png" alt="Amoria" width={130} height={36} className="h-8 w-auto invert" />
          <p className="mt-4 text-sm text-cream/70">Extrait de parfum, composed in small batches and bottled with care.</p>
        </div>

        <div className="[&_.label-caps]:text-cream/50 [&_a]:text-cream [&_a:hover]:text-gold-light">
          <FooterColumn title="Shop" links={SHOP_LINKS} />
        </div>
        <div className="[&_.label-caps]:text-cream/50 [&_a]:text-cream [&_a:hover]:text-gold-light">
          <FooterColumn title="House" links={HOUSE_LINKS} />
        </div>
        <div className="[&_.label-caps]:text-cream/50 [&_a]:text-cream [&_a:hover]:text-gold-light">
          <FooterColumn title="Legal & Policies" links={LEGAL_LINKS} />
        </div>

        <div>
          <p className="label-caps mb-4 text-cream/50">Stay Informed</p>
          {subscribed ? (
            <p className="text-sm text-gold-light">You&apos;re on the list — thank you.</p>
          ) : (
            <form onSubmit={handleSubscribe} className="flex items-center border-b border-cream/30 pb-2">
              <input
                type="email"
                required
                placeholder="Sign up for updates"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent text-sm text-cream placeholder:text-cream/50 outline-none"
              />
              <button type="submit" aria-label="Subscribe" className="text-cream">
                →
              </button>
            </form>
          )}
          <div className="mt-6 flex gap-4">
            <a href="#" aria-label="Instagram" className="text-cream hover:text-gold-light">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
              </svg>
            </a>
            <a href="#" aria-label="X" className="text-cream hover:text-gold-light">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.9 2H22l-7.6 8.7L23 22h-6.9l-5.4-6.8L4.6 22H1.5l8.1-9.3L1 2h7.1l4.9 6.2L18.9 2zm-1.2 18h1.9L7.3 4H5.3l12.4 16z" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-between gap-4 border-t border-cream/15 px-6 py-6 text-xs text-cream/60 sm:flex-row">
        <div className="flex flex-wrap items-center gap-4">
          <span>© {new Date().getFullYear()} Amoria Perfumes</span>
          <a href="/privacy" className="hover:text-cream">
            Privacy
          </a>
          <a href="/terms" className="hover:text-cream">
            Terms & Conditions
          </a>
        </div>
        <div className="flex items-center gap-2 text-[10px] tracking-wide text-cream/50">
          <span className="border border-cream/20 px-2 py-1">VISA</span>
          <span className="border border-cream/20 px-2 py-1">MASTERCARD</span>
          <span className="border border-cream/20 px-2 py-1">TABBY</span>
        </div>
      </div>
    </footer>
  );
}
