import { LegalPage } from "@/components/LegalPage";

export const metadata = {
  title: "Returns & Exchanges",
  description: "How returns and exchanges work at Amoria Perfume, and how to get in touch if something isn't right.",
};


// Verbatim from the site owner's "return refund and exchange policy amoria.pdf".
export default function ReturnsPage() {
  return (
    <LegalPage
      title="Return, Refund & Exchange Policy"
      updated="2026"
      intro="At Amoria Perfume, customer satisfaction is important to us. This Return, Refund & Exchange Policy has been prepared in accordance with applicable UAE consumer protection regulations and applies to all purchases made through our website."
      sections={[
        {
          heading: "1. Return & Exchange Eligibility",
          blocks: [
            {
              type: "p",
              text: "You may request a return or exchange within 7 days of receiving your order, provided that:",
            },
            {
              type: "ul",
              items: [
                "The product is unused, unopened, and in its original condition.",
                "The original packaging, cellophane wrapping, seals, labels, and accessories remain intact.",
                "You provide proof of purchase, such as an order confirmation, invoice, or receipt.",
                "The product is not classified as a non-returnable item under this policy.",
              ],
            },
          ],
        },
        {
          heading: "2. Non-Returnable Items",
          blocks: [
            {
              type: "p",
              text: "Due to hygiene, health, and product integrity reasons, the following items cannot be returned, refunded, or exchanged:",
            },
            {
              type: "ul",
              items: [
                "Opened perfume bottles.",
                "Products that have been sprayed, tested, or used.",
                "Products with broken seals or removed cellophane wrapping.",
                "Personalized or customized products.",
                'Gift cards, promotional items, and products marked as "Final Sale."',
              ],
            },
          ],
        },
        {
          heading: "3. Damaged, Defective, or Incorrect Items",
          blocks: [
            {
              type: "p",
              text: "If you receive a damaged, defective, or incorrect product, please notify Amoria Perfume within 48 hours of delivery. To process your request, please provide:",
            },
            { type: "ul", items: ["Order number.", "Photos or videos showing the issue.", "A brief description of the problem."] },
            { type: "p", text: "Upon verification, we may offer:" },
            { type: "ul", items: ["A replacement product.", "An exchange.", "A full refund, depending on the circumstances."] },
          ],
        },
        {
          heading: "4. Change of Mind",
          blocks: [
            {
              type: "p",
              text: "Due to the personal nature of fragrance products, returns based solely on fragrance preference, scent expectations, or change of mind are generally not accepted once the product has been opened.",
            },
            {
              type: "p",
              text: "Unopened products may be eligible for return or exchange subject to approval and compliance with the conditions outlined in this policy.",
            },
          ],
        },
        {
          heading: "5. Refund Process",
          blocks: [
            { type: "p", text: "Once a returned item is received and inspected:" },
            {
              type: "ul",
              items: [
                "Approved refunds will be processed to the original payment method used for the purchase.",
                "Refund processing may take 7-14 business days, depending on your payment provider or bank.",
                "Original shipping charges are non-refundable unless the return is due to our error or a defective product.",
              ],
            },
          ],
        },
        {
          heading: "6. Exchange Process",
          blocks: [
            { type: "p", text: "Eligible products may be exchanged for:" },
            {
              type: "ul",
              items: [
                "The same product (replacement).",
                "Another product of equal or greater value (subject to payment of any price difference).",
              ],
            },
            { type: "p", text: "Exchange requests are subject to stock availability." },
          ],
        },
        {
          heading: "7. Return Shipping",
          blocks: [
            {
              type: "ul",
              items: [
                "If the return is due to a damaged, defective, or incorrect item, Amoria Perfume will arrange collection or cover the return shipping cost.",
                "For approved returns not caused by our error, return shipping costs may be the responsibility of the customer.",
              ],
            },
          ],
        },
        {
          heading: "8. Order Cancellation",
          blocks: [
            { type: "p", text: "Orders may be cancelled before they are processed or dispatched." },
            {
              type: "p",
              text: "Once an order has been shipped, cancellation may no longer be possible and the order will be subject to this Return & Exchange Policy.",
            },
          ],
        },
        {
          heading: "9. Consumer Rights",
          blocks: [
            {
              type: "p",
              text: "Nothing in this policy limits any rights available to consumers under applicable UAE consumer protection laws. If a product is defective, not as described, or fails to meet legal requirements, customers may be entitled to remedies available under UAE law.",
            },
          ],
        },
        {
          heading: "10. Contact Us",
          blocks: [
            { type: "p", text: "For return, refund, or exchange requests, please contact:" },
            {
              type: "p",
              text: "Amoria Perfume — Email: info@amoriaperfume.ae — Phone/WhatsApp: +971 50 755 0447 — Website: www.amoriaperfume.ae",
            },
            { type: "p", text: "Please include your order number and relevant details when contacting us so we can assist you promptly." },
          ],
        },
      ]}
    />
  );
}
