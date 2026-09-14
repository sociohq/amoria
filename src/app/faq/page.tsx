"use client";

import { useState } from "react";

const FAQS = [
  {
    q: "Are Amoria Perfumes authentic?",
    a: "Yes. All Amoria Perfume products are crafted using premium-quality ingredients and undergo strict quality checks to ensure an exceptional fragrance experience. Trust and authenticity are key factors for perfume buyers.",
  },
  {
    q: "What types of fragrances does Amoria Perfume offer?",
    a: "Amoria Perfume offers a range of fragrances for men, women, and unisex wearers, including fresh, fruity, floral, woody, oriental, gourmand, and oud-based scents.",
  },
  {
    q: "How long do Amoria Perfumes last?",
    a: "Longevity varies by fragrance, skin type, and environmental conditions. Our Extrait de Parfum and Eau de Parfum collections are designed to provide long-lasting performance throughout the day.",
  },
  {
    q: "How can I choose the right perfume?",
    a: "You can explore fragrance families, top notes, heart notes, and base notes on each product page to find a scent that matches your preferences. Detailed scent descriptions help you choose confidently online.",
  },
  {
    q: "What is the difference between Eau de Parfum and Extrait de Parfum?",
    a: "Extrait de Parfum contains a higher concentration of fragrance oils than Eau de Parfum, typically providing greater richness, depth, and longevity.",
  },
  {
    q: "Are your perfumes suitable for daily wear?",
    a: "Yes. Our collection includes fragrances suitable for everyday use, office wear, special occasions, and evening events.",
  },
  {
    q: "How should I apply perfume for the best results?",
    a: "Apply perfume to pulse points such as the wrists, neck, behind the ears, and inner elbows. Avoid rubbing the fragrance after application.",
  },
  {
    q: "How should I store my perfume?",
    a: "Store your perfume in a cool, dry place away from direct sunlight and excessive heat to preserve its quality and longevity.",
  },
  {
    q: "Do you ship across the UAE?",
    a: "Yes, we deliver across all Emirates in the UAE.",
  },
  {
    q: "How long does delivery take?",
    a: "Orders are typically delivered within 1-5 business days, depending on your location.",
  },
  {
    q: "How can I track my order?",
    a: "Once your order has been shipped, you will receive a tracking number via email, SMS, or WhatsApp.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept secure online payments through major credit cards, debit cards, Apple Pay, Google Pay, and other payment methods available at checkout.",
  },
  {
    q: "Can I cancel my order?",
    a: "Orders may be cancelled before they are processed and dispatched. Please contact our customer support team at +971 50 755 0447.",
  },
  {
    q: "What is your return and exchange policy?",
    a: "For hygiene and safety reasons, perfumes can only be returned or exchanged if they are unopened, unused, or received in a damaged condition.",
  },
  {
    q: "What should I do if I receive a damaged item?",
    a: "Please contact our customer support team at +971 50 755 0447 within 48 hours of delivery and share photos of the damaged product. We will assist you promptly.",
  },
  {
    q: "Do you offer gift packaging?",
    a: "Yes, gift packaging may be available on selected products with additional charges.",
  },
  {
    q: "Are your perfumes suitable for gifting?",
    a: "Absolutely. Our fragrances are perfect for birthdays, anniversaries, weddings, corporate gifts, and special occasions.",
  },
  {
    q: "How can I contact Amoria Perfume?",
    a: "You can reach us through our Contact Us page, email, WhatsApp at +971 50 755 0447, or by visiting our store.",
  },
  {
    q: "Do you offer exclusive fragrances?",
    a: "Yes. Amoria Perfume features exclusive fragrance creations designed to provide a unique and memorable scent experience.",
  },
  {
    q: "How can I stay updated on new launches and promotions?",
    a: "Subscribe to our newsletter and follow our social media channels to receive updates on new arrivals, exclusive collections, and special offers.",
  },
];

// Twenty items is too many to show fully expanded at once (the previous,
// much shorter list didn't need this) — collapsed by default with a
// simple +/- toggle, same interaction as the product page's accordions
// but in sentence-case serif rather than that component's label-caps
// styling, which reads poorly for full questions this long.
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="py-5">
      <button onClick={() => setOpen((v) => !v)} className="flex w-full items-center justify-between gap-4 text-left">
        <span className="font-serif text-lg text-ink">{q}</span>
        <span className="shrink-0 text-lg font-light text-ink-soft">{open ? "−" : "+"}</span>
      </button>
      {open && <p className="mt-3 text-sm leading-relaxed text-ink-soft">{a}</p>}
    </div>
  );
}

export default function FAQPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-24">
      <p className="label-caps text-gold">FAQ</p>
      <h1 className="mt-2 font-serif text-4xl text-ink">Frequently Asked Questions</h1>
      <div className="mt-10 divide-y divide-border border-y border-border">
        {FAQS.map((f) => (
          <FaqItem key={f.q} q={f.q} a={f.a} />
        ))}
      </div>
    </div>
  );
}
