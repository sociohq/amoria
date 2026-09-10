import { LegalPage } from "@/components/LegalPage";

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms & Conditions"
      updated="2026"
      sections={[
        {
          heading: "Orders",
          body: "By placing an order on Amoria, you confirm the details provided (shipping address, contact information) are accurate. Orders are confirmed once payment has been successfully processed.",
        },
        {
          heading: "Pricing",
          body: "All prices are listed in AED and include applicable taxes. Amoria reserves the right to update pricing at any time; the price at the time of your order is the price you pay.",
        },
        {
          heading: "Product Authenticity",
          body: "All products sold on Amoria are 100% authentic, sourced directly from Amoria Perfume.",
        },
        {
          heading: "Account Responsibility",
          body: "You are responsible for maintaining the confidentiality of your account credentials and for all activity under your account.",
        },
        {
          heading: "Contact",
          body: "Questions about these terms can be sent to amoriaperfumeofficial@gmail.com.",
        },
      ]}
    />
  );
}
