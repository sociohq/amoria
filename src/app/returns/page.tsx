import { LegalPage } from "@/components/LegalPage";

export default function ReturnsPage() {
  return (
    <LegalPage
      title="Return & Refund Policy"
      updated="2026"
      sections={[
        {
          heading: "Returns",
          body: "Unopened, unused items in their original packaging can be returned within 14 days of delivery for a full refund.",
        },
        {
          heading: "How to Start a Return",
          body: "Email amoriaperfumeofficial@gmail.com with your order number and reason for return. We'll confirm the next steps.",
        },
        {
          heading: "Refunds",
          body: "Once your return is received and inspected, refunds are issued to your original payment method within 5–10 business days.",
        },
        {
          heading: "Damaged or Incorrect Items",
          body: "If your order arrives damaged or incorrect, contact us within 48 hours of delivery with photos, and we'll arrange a replacement or refund at no extra cost.",
        },
      ]}
    />
  );
}
