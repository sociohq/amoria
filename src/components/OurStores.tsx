export function OurStores() {
  return (
    <section className="relative flex min-h-[420px] items-center overflow-hidden bg-emerald">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      <div className="relative z-10 px-6 py-20">
        <p className="label-caps text-gold-light">Extrait de Parfum</p>
        <h2 className="mt-2 font-serif text-3xl text-cream">Our Stores</h2>
        <p className="mt-4 max-w-md text-cream/85">
          Icon Residency 2, Shop 7 — opposite ADNOC service station
          <br />
          Al Muwaihat 3, Ajman, United Arab Emirates
        </p>
        <div className="mt-8 flex gap-3">
          <a
            href="https://maps.google.com/?q=Icon+Residency+2+Al+Muwaihat+3+Ajman"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-ink px-6 py-3 label-caps text-cream hover:opacity-90"
          >
            Get Directions
          </a>
          <a href="/contact" className="border border-cream px-6 py-3 label-caps text-cream hover:bg-cream hover:text-emerald">
            Contact Us
          </a>
        </div>
      </div>
    </section>
  );
}
