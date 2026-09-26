import type { Metadata } from "next";
import { InfoPage, InfoSection } from "../_component/page/info/InfoPage";

export const metadata: Metadata = {
  title: "Contact & Support",
  description:
    "Contact Ilmefy support for any question, issue, cancellation, or refund request. We aim to respond within 2 business days.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <InfoPage
      title="Contact & Support"
      subtitle="We're here to help."
    >
      <InfoSection title="Email us">
        <p>
          For any question, issue, cancellation, or refund request, email{" "}
          <a className="text-brand hover:underline" href="mailto:info@ilmefy.com">
            info@ilmefy.com
          </a>
          . Please include your account email and booking details so we can help
          faster.
        </p>
      </InfoSection>

      <InfoSection title="Response time">
        <p>We aim to respond within 2 business days.</p>
      </InfoSection>

      <InfoSection title="Before you write">
        <p>
          Many common questions are answered in our{" "}
          <a className="text-brand hover:underline" href="/faq">
            FAQ
          </a>
          . For refunds and cancellations, see our{" "}
          <a className="text-brand hover:underline" href="/refund-policy">
            Refund &amp; Cancellation Policy
          </a>
          .
        </p>
      </InfoSection>
    </InfoPage>
  );
}
