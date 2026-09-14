import { LegalPage } from "@/components/LegalPage";

// Verbatim from the site owner's "T&C amoria.pdf". The source document
// itself has an unfilled "Effective Date: [Insert Date]" placeholder —
// left as "Effective Date: To be confirmed" here rather than inventing
// a date; flag to the site owner to supply the real effective date.
export default function TermsPage() {
  return (
    <LegalPage
      title="Terms and Conditions"
      updated="To be confirmed (effective date not yet set)"
      intro={
        'Welcome to www.amoriaperfume.ae ("Website"), operated by Amoria Perfume ("Company", "we", "our", or "us"). By accessing, browsing, registering an account, or purchasing products through this Website, you agree to be bound by these Terms and Conditions.'
      }
      sections={[
        {
          heading: "1. Eligibility",
          blocks: [
            { type: "p", text: "By using this Website, you confirm that:" },
            {
              type: "ul",
              items: [
                "You are at least 18 years of age, or you are using the Website under the supervision of a parent or legal guardian.",
                "You have the legal capacity to enter into binding contracts under applicable UAE laws.",
              ],
            },
          ],
        },
        {
          heading: "2. Products and Availability",
          blocks: [
            {
              type: "ul",
              items: [
                "All products displayed on the Website are subject to availability.",
                "We reserve the right to modify, discontinue, or limit quantities of any product without prior notice.",
                "Product images are for illustration purposes only. Actual packaging and appearance may vary slightly.",
              ],
            },
          ],
        },
        {
          heading: "3. Pricing",
          blocks: [
            {
              type: "ul",
              items: [
                "All prices are displayed in UAE Dirhams (AED).",
                "Prices include VAT where applicable unless otherwise stated.",
                "We reserve the right to correct pricing errors and update prices without notice.",
                "If an incorrect price is displayed, we may cancel the order and issue a full refund.",
              ],
            },
          ],
        },
        {
          heading: "4. Orders and Acceptance",
          blocks: [
            {
              type: "ul",
              items: [
                "Placing an order constitutes an offer to purchase.",
                "Orders are subject to acceptance and stock availability.",
                "We reserve the right to refuse, cancel, or limit any order at our discretion.",
                "An order confirmation email does not constitute final acceptance of the order.",
              ],
            },
          ],
        },
        {
          heading: "5. Payment",
          blocks: [
            { type: "p", text: "We accept payment methods displayed during checkout. By placing an order, you confirm that:" },
            {
              type: "ul",
              items: [
                "The payment information provided is accurate.",
                "You are authorized to use the selected payment method.",
                "Payment has been successfully completed before shipment.",
              ],
            },
          ],
        },
        {
          heading: "6. Shipping and Delivery",
          blocks: [
            {
              type: "ul",
              items: [
                "Delivery timelines provided on the Website are estimates only.",
                "Delays caused by couriers, customs authorities, weather conditions, public holidays, or circumstances beyond our control are not our responsibility.",
                "Ownership and risk of loss pass to the customer upon successful delivery.",
              ],
            },
          ],
        },
        {
          heading: "7. Returns, Refunds and Exchanges",
          blocks: [
            {
              type: "p",
              text: "Returns, refunds, and exchanges are governed by our Return, Refund & Exchange Policy. Customers may be entitled to replacement, refund, or exchange where:",
            },
            {
              type: "ul",
              items: [
                "Products are defective.",
                "Products are damaged during delivery.",
                "Products do not match the description provided on the Website.",
              ],
            },
            { type: "p", text: "Opened or used perfume products or change of mind after delivery may not qualify for return." },
          ],
        },
        {
          heading: "8. Customer Accounts",
          blocks: [
            { type: "p", text: "If you create an account:" },
            {
              type: "ul",
              items: [
                "You are responsible for maintaining the confidentiality of your login credentials.",
                "You are responsible for all activities conducted through your account.",
                "We may suspend or terminate accounts suspected of unauthorized or fraudulent activity.",
              ],
            },
          ],
        },
        {
          heading: "9. Intellectual Property",
          blocks: [
            { type: "p", text: "All Website content including:" },
            { type: "ul", items: ["Logos", "Trademarks", "Product names", "Product descriptions", "Images", "Videos", "Graphics", "Website design"] },
            {
              type: "p",
              text: "are owned by or licensed to Amoria Perfume and are protected by applicable intellectual property laws. No content may be copied, reproduced, distributed, or used without prior written permission.",
            },
          ],
        },
        {
          heading: "10. Prohibited Activities",
          blocks: [
            { type: "p", text: "Users shall not:" },
            {
              type: "ul",
              items: [
                "Use the Website for unlawful purposes.",
                "Interfere with Website security.",
                "Upload malicious software or harmful code.",
                "Attempt unauthorized access to Website systems.",
                "Engage in fraudulent transactions.",
                "Misrepresent identity or personal information.",
              ],
            },
          ],
        },
        {
          heading: "11. Privacy and Data Protection",
          blocks: [
            {
              type: "p",
              text: "Your use of the Website is also governed by our Privacy Policy. Amoria Perfume processes personal data in accordance with applicable UAE laws, including the UAE Personal Data Protection Law (Federal Decree-Law No. 45 of 2021). By using the Website, you consent to the collection and processing of personal information as described in our Privacy Policy.",
            },
          ],
        },
        {
          heading: "12. Marketing Communications",
          blocks: [
            {
              type: "p",
              text: "Customers may choose whether to receive promotional emails, SMS messages, or marketing communications. You may unsubscribe at any time using the methods provided in our communications.",
            },
          ],
        },
        {
          heading: "13. Limitation of Liability",
          blocks: [
            { type: "p", text: "To the maximum extent permitted by UAE law:" },
            {
              type: "ul",
              items: [
                "Amoria Perfume shall not be liable for indirect, incidental, special, or consequential damages.",
                "Our liability relating to any order shall not exceed the amount paid for the product giving rise to the claim.",
              ],
            },
            { type: "p", text: "Nothing in these Terms excludes rights that cannot legally be excluded under applicable UAE law." },
          ],
        },
        {
          heading: "14. Force Majeure",
          blocks: [
            {
              type: "p",
              text: "Amoria Perfume shall not be liable for delays or failure to perform obligations caused by events beyond our reasonable control, including:",
            },
            {
              type: "ul",
              items: [
                "Natural disasters",
                "Government actions",
                "Internet outages",
                "Cybersecurity incidents",
                "Transportation disruptions",
                "Pandemic-related restrictions",
              ],
            },
          ],
        },
        {
          heading: "15. Consumer Rights",
          blocks: [
            {
              type: "p",
              text: "Nothing in these Terms and Conditions shall limit or exclude any rights available to consumers under UAE Consumer Protection legislation. Where any provision of these Terms conflicts with mandatory UAE law, the applicable law shall prevail.",
            },
          ],
        },
        {
          heading: "16. Governing Law and Jurisdiction",
          blocks: [
            {
              type: "p",
              text: "These Terms and Conditions shall be governed by and interpreted in accordance with the laws of the United Arab Emirates. Any dispute arising out of or relating to the Website, products, or these Terms shall be subject to the exclusive jurisdiction of the competent courts of the United Arab Emirates.",
            },
          ],
        },
        {
          heading: "17. Amendments",
          blocks: [
            {
              type: "p",
              text: "Amoria Perfume reserves the right to update or modify these Terms and Conditions at any time. Updated versions will be published on this page and become effective immediately upon publication.",
            },
          ],
        },
      ]}
      closing="By using this Website, you acknowledge that you have read, understood, and agreed to these Terms and Conditions."
    />
  );
}
