import { ContactForm } from "@/components/ContactForm";

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-24">
      <div className="text-center">
        <p className="label-caps text-gold">Contact Us</p>
        <h1 className="mt-2 font-serif text-4xl text-ink">Get in Touch</h1>
      </div>

      <div className="mt-14 grid gap-14 lg:grid-cols-[1fr_1.4fr]">
        <div className="space-y-6">
          <div>
            <p className="label-caps text-ink-soft">Sales</p>
            <a href="mailto:sales@amoriaperfume.ae" className="mt-1 block text-ink hover:text-royal">
              sales@amoriaperfume.ae
            </a>
          </div>
          <div>
            <p className="label-caps text-ink-soft">Operations</p>
            <a href="mailto:operations@amoriaperfume.ae" className="mt-1 block text-ink hover:text-royal">
              operations@amoriaperfume.ae
            </a>
          </div>
          <div>
            <p className="label-caps text-ink-soft">General Inquiries</p>
            <a href="mailto:info@amoriaperfume.ae" className="mt-1 block text-ink hover:text-royal">
              info@amoriaperfume.ae
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

        <ContactForm />
      </div>
    </div>
  );
}
