// A richer "visit + get in touch" card, styled after a reference footer
// panel — a rounded, solid-color card instead of a plain full-bleed strip,
// with contact details and social links alongside the store address.
const EMAIL = "amoriaperfumeofficial@gmail.com";
const PHONE_DISPLAY = "+971 50 755 0447";
const PHONE_HREF = "+971507550447";

const SOCIALS = [
  {
    label: "Instagram",
    href: "#",
    icon: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </>
    ),
  },
  {
    label: "Facebook",
    href: "#",
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path
          d="M14 8.5h-1.5A2 2 0 0 0 10.5 10.5V12H9v2.5h1.5V19H13v-4.5h1.8l.4-2.5H13v-1.2c0-.4.2-.8.8-.8H14z"
          fill="currentColor"
          stroke="none"
        />
      </>
    ),
  },
  {
    label: "TikTok",
    href: "#",
    icon: (
      <>
        <path d="M16 3v10.5a3.5 3.5 0 1 1-3.5-3.5" />
        <path d="M16 3c0 2.5 2 4.5 4.5 4.5" strokeLinecap="round" />
      </>
    ),
  },
];

export function OurStores() {
  return (
    <section className="px-6 py-16">
      <div className="rounded-3xl bg-cream-dark px-8 py-14 sm:px-14 sm:py-16">
        <div className="grid gap-12 sm:grid-cols-2">
          <div>
            <p className="label-caps text-gold">Visit Us</p>
            <h2 className="mt-2 font-serif text-3xl text-ink">Our Stores</h2>
            <p className="mt-4 max-w-sm text-ink-soft">
              Icon Residency 2, Shop 7 — opposite ADNOC service station
              <br />
              Al Muwaihat 3, Ajman, United Arab Emirates
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="https://maps.google.com/?q=Icon+Residency+2+Al+Muwaihat+3+Ajman"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-ink px-6 py-3 label-caps text-cream hover:opacity-90"
              >
                Get Directions
              </a>
              <a
                href="/contact"
                className="border border-ink px-6 py-3 label-caps text-ink hover:bg-ink hover:text-cream"
              >
                Contact Us
              </a>
            </div>
          </div>

          <div className="sm:border-l sm:border-ink/15 sm:pl-12">
            <p className="label-caps text-gold">Get In Touch</p>
            <div className="mt-4 space-y-2">
              <a href={`mailto:${EMAIL}`} className="block text-ink hover:text-emerald">
                {EMAIL}
              </a>
              <a href={`tel:${PHONE_HREF}`} className="block text-ink hover:text-emerald">
                {PHONE_DISPLAY}
              </a>
            </div>

            <p className="label-caps mt-8 text-gold">Follow Along</p>
            <div className="mt-4 flex gap-4">
              {SOCIALS.map((s) => (
                <a key={s.label} href={s.href} aria-label={s.label} className="text-ink hover:text-emerald">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    {s.icon}
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
