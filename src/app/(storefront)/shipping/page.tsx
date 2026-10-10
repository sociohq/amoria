import { LegalPage } from "@/components/LegalPage";

export const metadata = {
  title: "Shipping & Delivery",
  description: "Delivery across the UAE, usually within 1-3 working days. Free delivery on orders above AED 250.",
};


// Verbatim from the site owner's "Delivery and shipping policy amoria.pdf".
// No page existed for this policy before — added and linked from the
// footer's Legal & Policies column alongside Terms/Privacy/Returns.
export default function ShippingPage() {
  return (
    <LegalPage
      title="Delivery & Shipping Policy"
      updated="2026"
      intro="Thank you for shopping with Amoria Perfume. We are committed to delivering your order safely, securely, and on time. Please read our Delivery & Shipping Policy carefully before placing an order."
      sections={[
        {
          heading: "1. Delivery Coverage",
          blocks: [
            {
              type: "p",
              text: "Amoria Perfume currently delivers across all Emirates within the United Arab Emirates (UAE).",
            },
            {
              type: "p",
              text: "For international shipping inquiries, please contact our customer support team on email: info@amoriaperfume.ae or WhatsApp +971 50 755 0447 before placing your order. Delivery restrictions may apply depending on the destination country and local regulations regarding fragrance products.",
            },
          ],
        },
        {
          heading: "2. Order Processing",
          blocks: [
            {
              type: "ul",
              items: [
                "Orders are processed within 1-2 business days after payment confirmation.",
                "Orders placed on weekends or UAE public holidays will be processed on the next business day.",
                "During promotional campaigns, sales events, or peak seasons, processing times may be extended.",
              ],
            },
          ],
        },
        {
          heading: "3. Delivery Time",
          blocks: [
            { type: "p", text: "Estimated delivery times are:" },
            {
              type: "ul",
              items: [
                "Dubai, Sharjah & Ajman: 1-2 business days",
                "Abu Dhabi and Northern Emirates: 2-4 business days",
                "Remote Areas: Additional delivery time may be required",
              ],
            },
            {
              type: "p",
              text: "Delivery times are estimates and may vary due to courier operations, weather conditions, public holidays, or unforeseen circumstances.",
            },
          ],
        },
        {
          heading: "4. Shipping Charges",
          blocks: [
            {
              type: "ul",
              items: [
                "Free delivery on orders above AED 200.",
                "Orders below AED 200 may be subject to a standard delivery charge displayed at checkout.",
                "Any promotional free shipping offers will be clearly communicated on the website.",
              ],
            },
          ],
        },
        {
          heading: "5. Order Tracking",
          blocks: [
            {
              type: "p",
              text: "Once your order has been shipped, you will receive a shipping confirmation via email, SMS, or WhatsApp containing your tracking information. Customers can use the tracking number provided to monitor the status of their shipment.",
            },
          ],
        },
        {
          heading: "6. Delivery Address Requirements",
          blocks: [
            { type: "p", text: "Customers are responsible for providing accurate delivery information, including:" },
            {
              type: "ul",
              items: ["Full Name", "Mobile Number", "Building/Villa Number", "Street Name", "Area and City", "Any necessary delivery instructions"],
            },
            {
              type: "p",
              text: "Amoria Perfume will not be responsible for delays or failed deliveries resulting from incorrect or incomplete address information.",
            },
          ],
        },
        {
          heading: "7. Failed Delivery Attempts",
          blocks: [
            { type: "p", text: "If a customer is unavailable to receive the order:" },
            {
              type: "ul",
              items: [
                "Our courier partner may contact the customer to arrange redelivery.",
                "Additional delivery charges may apply for repeated delivery attempts.",
                "Orders returned to us due to incorrect addresses or unsuccessful delivery attempts may be refunded after deducting applicable shipping charges.",
              ],
            },
          ],
        },
        {
          heading: "8. Damaged or Missing Items",
          blocks: [
            { type: "p", text: "If your order arrives damaged, incomplete, or incorrect:" },
            {
              type: "ul",
              items: [
                "Notify us within 48 hours of delivery.",
                "Provide your order number and clear photographs of the package and product.",
                "We will investigate the issue and arrange a suitable resolution, including replacement or refund where applicable.",
              ],
            },
          ],
        },
        {
          heading: "9. International Orders",
          blocks: [
            { type: "p", text: "For international shipments:" },
            {
              type: "ul",
              items: [
                "Delivery times vary by destination country.",
                "Customers may be responsible for customs duties, taxes, import fees, or other charges imposed by local authorities.",
                "Amoria Perfume is not responsible for customs delays or additional import charges.",
              ],
            },
          ],
        },
        {
          heading: "10. Order Cancellation",
          blocks: [
            { type: "p", text: "Orders may be cancelled before they have been processed or dispatched." },
            {
              type: "p",
              text: "Once an order has been shipped, cancellation requests will be subject to our Return, Refund & Exchange Policy.",
            },
          ],
        },
        {
          heading: "11. Contact Us",
          blocks: [
            { type: "p", text: "For delivery or shipping-related inquiries, please contact:" },
            {
              type: "p",
              text: "Amoria Perfume — Email: sales@amoriaperfume.ae — Phone/WhatsApp: +971 50 755 0447 — Website: www.amoriaperfume.ae",
            },
            { type: "p", text: "Our customer support team will be happy to assist you with any questions regarding your order." },
          ],
        },
      ]}
    />
  );
}
