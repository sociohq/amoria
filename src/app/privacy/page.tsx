import { LegalPage } from "@/components/LegalPage";

// Verbatim from the site owner's "Privacy Policy amoria.pdf".
export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="2026"
      intro={
        'Amoria Perfume ("Amoria", "we", "our", or "us") is committed to protecting your privacy and handling your personal data responsibly and in accordance with applicable laws of the United Arab Emirates, including Federal Decree-Law No. 45 of 2021 Regarding the Protection of Personal Data (PDPL). By accessing our website, creating an account, placing an order, or using our services, you agree to the collection and use of your information as described in this Privacy Policy.'
      }
      sections={[
        {
          heading: "1. Information We Collect",
          blocks: [{ type: "p", text: "We may collect the following categories of personal data:" }],
          subsections: [
            {
              heading: "Information You Provide",
              blocks: [
                {
                  type: "ul",
                  items: [
                    "Full name",
                    "Email address",
                    "Mobile number",
                    "Billing address",
                    "Shipping address",
                    "Account login information",
                    "Customer service communications",
                    "Product reviews and feedback",
                  ],
                },
              ],
            },
            {
              heading: "Transaction Information",
              blocks: [
                { type: "ul", items: ["Order history", "Purchase details", "Payment status"] },
                {
                  type: "p",
                  text: "Note: Payment card details are processed securely by authorized payment providers. Amoria Perfume does not store complete credit or debit card information on its servers.",
                },
              ],
            },
            {
              heading: "Automatically Collected Information",
              blocks: [
                {
                  type: "ul",
                  items: [
                    "IP address",
                    "Browser type",
                    "Device information",
                    "Website usage data",
                    "Cookies and similar technologies",
                    "Location information (where permitted)",
                  ],
                },
              ],
            },
          ],
        },
        {
          heading: "2. How We Use Your Information",
          blocks: [
            { type: "p", text: "We use your personal data for legitimate business purposes, including:" },
            {
              type: "ul",
              items: [
                "Processing and fulfilling orders",
                "Delivering products and services",
                "Providing customer support",
                "Managing your account",
                "Processing payments",
                "Sending order confirmations and delivery updates",
                "Improving website functionality and user experience",
                "Detecting fraud and protecting website security",
                "Complying with legal and regulatory obligations",
                "Sending promotional communications where you have provided consent",
              ],
            },
          ],
        },
        {
          heading: "3. Marketing Communications",
          blocks: [
            {
              type: "p",
              text: "We may send promotional emails, SMS messages, or WhatsApp communications regarding:",
            },
            { type: "ul", items: ["New product launches", "Promotions and discounts", "Exclusive offers", "Company updates"] },
            {
              type: "p",
              text: "You may opt out of marketing communications at any time by clicking the unsubscribe link in our emails or contacting us directly.",
            },
          ],
        },
        {
          heading: "4. Legal Basis for Processing",
          blocks: [
            { type: "p", text: "Where required by applicable law, we process personal data based on:" },
            {
              type: "ul",
              items: [
                "Your consent",
                "Performance of a contract (such as fulfilling your order)",
                "Compliance with legal obligations",
                "Legitimate business interests that do not override your rights and freedoms",
              ],
            },
          ],
        },
        {
          heading: "5. Sharing of Personal Data",
          blocks: [
            { type: "p", text: "We do not sell or rent personal data." },
            { type: "p", text: "We may share personal data with:" },
            {
              type: "ul",
              items: [
                "Payment service providers",
                "Shipping and courier companies",
                "Website hosting providers",
                "Technology and analytics providers",
                "Marketing service providers",
                "Government authorities or regulators where legally required",
              ],
            },
            { type: "p", text: "All third parties are required to maintain appropriate security and confidentiality measures." },
          ],
        },
        {
          heading: "6. Cookies and Tracking Technologies",
          blocks: [
            { type: "p", text: "Our website uses cookies and similar technologies to:" },
            {
              type: "ul",
              items: [
                "Remember user preferences",
                "Improve website performance",
                "Analyze visitor behavior",
                "Enhance customer experience",
              ],
            },
            {
              type: "p",
              text: "You may disable cookies through your browser settings; however, certain website features may not function properly.",
            },
          ],
        },
        {
          heading: "7. Data Security",
          blocks: [
            {
              type: "p",
              text: "We implement reasonable technical, administrative, and organizational measures to protect personal data against:",
            },
            { type: "ul", items: ["Unauthorized access", "Disclosure", "Alteration", "Loss", "Misuse", "Destruction"] },
            {
              type: "p",
              text: "While we strive to protect your information, no method of internet transmission or electronic storage is completely secure.",
            },
          ],
        },
        {
          heading: "8. International Data Transfers",
          blocks: [
            {
              type: "p",
              text: "Where personal data is transferred outside the UAE, Amoria Perfume will implement appropriate safeguards and protection measures as required under applicable UAE data protection laws.",
            },
          ],
        },
        {
          heading: "9. Data Retention",
          blocks: [
            { type: "p", text: "We retain personal data only for as long as necessary to:" },
            {
              type: "ul",
              items: [
                "Fulfill the purposes outlined in this Privacy Policy",
                "Provide customer support",
                "Maintain business records",
                "Comply with legal, tax, accounting, and regulatory obligations",
              ],
            },
            { type: "p", text: "After the retention period expires, personal data will be securely deleted or anonymized." },
          ],
        },
        {
          heading: "10. Your Rights",
          blocks: [
            { type: "p", text: "Subject to applicable UAE laws, you may have the right to:" },
            {
              type: "ul",
              items: [
                "Request access to your personal data",
                "Request correction of inaccurate information",
                "Request deletion of your personal data",
                "Restrict or object to certain processing activities",
                "Withdraw consent where processing is based on consent",
                "Request information regarding how your data is processed",
              ],
            },
            { type: "p", text: "To exercise these rights, please contact us using the details below." },
          ],
        },
        {
          heading: "11. Children's Privacy",
          blocks: [
            {
              type: "p",
              text: "Our website and products are not intended for individuals under the age of 18. We do not knowingly collect personal data from minors.",
            },
          ],
        },
        {
          heading: "12. Third-Party Websites",
          blocks: [
            {
              type: "p",
              text: "Our website may contain links to third-party websites. We are not responsible for the privacy practices, policies, or content of those websites.",
            },
          ],
        },
        {
          heading: "13. Changes to this Privacy Policy",
          blocks: [
            {
              type: "p",
              text: "We may update this Privacy Policy from time to time. Any changes will be posted on this page together with the revised effective date.",
            },
          ],
        },
        {
          heading: "14. Contact Us",
          blocks: [
            { type: "p", text: "For any privacy-related inquiries, requests, or complaints, please contact:" },
            {
              type: "p",
              text: "Amoria Perfume — Email: info@amoriaperfume.ae — Phone: +971 50 755 0447 — Address: Muwaihat 3, Ajman — Website: www.amoriaperfume.ae",
            },
          ],
        },
      ]}
      closing="By using our website, you acknowledge that you have read and understood this Privacy Policy."
    />
  );
}
