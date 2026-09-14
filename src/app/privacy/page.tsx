import { LegalPage } from "@/components/LegalPage";

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="2026"
      sections={[
        {
          heading: "Information We Collect",
          body: "When you create an account or place an order, we collect your name, email, phone number, and shipping address to process and deliver your order.",
        },
        {
          heading: "Payment Information",
          body: "Payments are processed securely by Stripe. Amoria never sees or stores your full card details.",
        },
        {
          heading: "How We Use Your Information",
          body: "Your information is used to process orders, provide customer support, and (only with your consent) send updates about new products and offers.",
        },
        {
          heading: "Data Sharing",
          body: "We do not sell your personal information. It is shared only with service providers necessary to fulfil your order (payment processing, shipping).",
        },
        {
          heading: "Contact",
          body: "For any privacy-related questions or to request your data be deleted, email amoriaperfumeofficial@gmail.com.",
        },
      ]}
    />
  );
}
