const FAQS = [
  {
    q: "Is Amoria 100% authentic?",
    a: "Yes. Every bottle is original and verified, sourced directly from Amoria Perfume.",
  },
  {
    q: "How fast is shipping in the UAE?",
    a: "Orders above AED 99 ship free. Most orders arrive within 2–4 days of dispatch.",
  },
  {
    q: "Can I return a product?",
    a: "Unopened items can be returned within 14 days of delivery. See our Return & Refund Policy for details.",
  },
  {
    q: "How long does an Extrait de Parfum last?",
    a: "Our Extrait de Parfum concentration typically lasts 12+ hours on skin.",
  },
];

export default function FAQPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-24">
      <p className="label-caps text-gold">FAQ</p>
      <h1 className="mt-2 font-serif text-4xl text-ink">Frequently Asked Questions</h1>
      <div className="mt-10 divide-y divide-border border-y border-border">
        {FAQS.map((f) => (
          <div key={f.q} className="py-5">
            <p className="font-serif text-lg text-ink">{f.q}</p>
            <p className="mt-2 text-sm text-ink-soft">{f.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
