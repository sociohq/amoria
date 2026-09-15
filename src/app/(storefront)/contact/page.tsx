export default function ContactPage() {
  return (
    <div className="mx-auto max-w-lg px-6 py-24 text-center">
      <p className="label-caps text-gold">Contact Us</p>
      <h1 className="mt-2 font-serif text-4xl text-ink">Get in Touch</h1>
      <div className="mt-10 space-y-6">
        <div>
          <p className="label-caps text-ink-soft">Email</p>
          <a href="mailto:amoriaperfumeofficial@gmail.com" className="mt-1 block text-ink hover:text-royal">
            amoriaperfumeofficial@gmail.com
          </a>
        </div>
        <div>
          <p className="label-caps text-ink-soft">Phone / WhatsApp</p>
          <a href="tel:+971507550447" className="mt-1 block text-ink hover:text-royal">
            +971 50 755 0447
          </a>
        </div>
        <div>
          <p className="label-caps text-ink-soft">Store</p>
          <p className="mt-1 text-ink-soft">
            Icon Residency 2, Shop 7 (opposite ADNOC service station)
            <br />
            Al Muwaihat 3, Ajman, United Arab Emirates
          </p>
        </div>
      </div>
    </div>
  );
}
