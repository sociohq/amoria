"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { subscribeToNewsletter } from "@/lib/newsletter";
import { getPublicSettings, PublicSettings } from "@/lib/settings";
import { SocialLinks } from "./SocialIcons";
import { PaymentIcons } from "./PaymentIcons";
import { ApiError } from "@/lib/api";

const SHOP_LINKS = [
  { label: "All Fragrances", href: "/shop" },
  { label: "Inspired Perfumes", href: "/shop?category=inspired-fragrance" },
  { label: "Premium Fragrance", href: "/shop?category=premium-collection" },
  { label: "Home Fragrance", href: "/shop?category=home-fragrance" },
  { label: "Perfume Oils", href: "/shop?category=perfume-oils" },
  { label: "Arabic Fragrance", href: "/shop?category=arabic-fragrance" },
  { label: "Gift Set", href: "/shop?category=gift-sets" },
];

const HOUSE_LINKS = [
  { label: "About Us", href: "/our-story" },
  { label: "Our Boutique", href: "/stores" },
  { label: "Journal", href: "/blog" },
  { label: "Sustainability", href: "/sustainability" },
  { label: "Contact", href: "/contact" },
  { label: "Track Order", href: "/track" },
  { label: "FAQ", href: "/faq" },
];

const LEGAL_LINKS = [
  { label: "Terms & Conditions", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Return, Refund & Exchange Policy", href: "/returns" },
  { label: "Delivery & Shipping Policy", href: "/shipping" },
];

function FooterColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <p className="label-caps mb-4 text-ink-soft/70">{title}</p>
      <ul className="space-y-2">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="text-sm text-ink hover:text-royal">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [settings, setSettings] = useState<PublicSettings | null>(null);

  useEffect(() => {
    getPublicSettings()
      .then(setSettings)
      .catch(() => {
        // No social links, no icons — never block the footer over this.
      });
  }, []);

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    try {
      await subscribeToNewsletter(email);
      setSubscribed(true);
    } catch (err) {
      // Rare (the endpoint only really rejects a malformed email) — the
      // input just stays put so they can fix it and retry.
      alert(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
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
            <p className="text-sm text-gold-light">You&apos;re on the list. Thank you.</p>
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
          <SocialLinks
            className="mt-6 gap-x-4 gap-y-3"
            linkClassName="text-cream hover:text-gold-light"
            settings={settings}
            size={20}
          />
        </div>
      </div>

      <div className="flex flex-col items-center justify-between gap-4 border-t border-cream/15 px-6 py-6 text-xs text-cream/60 sm:flex-row sm:pr-28">
        <div className="flex flex-wrap items-center gap-4">
          <span>© {new Date().getFullYear()} Amoria Perfumes</span>
          <Link href="/privacy" className="hover:text-cream">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-cream">
            Terms & Conditions
          </Link>
        </div>
        <PaymentIcons />
      </div>
    </footer>
  );
}
