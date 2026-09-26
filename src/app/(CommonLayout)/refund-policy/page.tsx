import type { Metadata } from "next";
import {
  InfoList,
  InfoPage,
  InfoSection,
} from "../_component/page/info/InfoPage";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy",
  description:
    "How cancellations and refunds work on Ilmefy: cancelling a confirmed session, refund requests, and late/no-show handling.",
  alternates: { canonical: "/refund-policy" },
};

export default function RefundPolicyPage() {
  return (
    <InfoPage
      title="Refund & Cancellation Policy"
      subtitle="How cancellations and refunds work on Ilmefy today."
      updated="September 2025"
    >
      <InfoSection title="Cancellation">
        <InfoList
          items={[
            "You can cancel a confirmed session yourself from your dashboard before the session starts.",
            "Sessions that are not completed are marked as cancelled on the platform.",
            "If a tutor is unable to deliver a session, contact support and we will help resolve it.",
          ]}
        />
      </InfoSection>

      <InfoSection title="Refunds">
        <p>
          Refunds are handled manually, on request. Automated refunds are not
          currently available on the platform. If you believe you are entitled to
          a refund (for example, a session did not take place or was not
          delivered), email{" "}
          <a className="text-brand hover:underline" href="mailto:info@ilmefy.com">
            info@ilmefy.com
          </a>{" "}
          with your booking details and we will review the request.
        </p>
        <p>
          Approved refunds are returned through Stripe to your original payment
          method. Timing depends on your bank or card issuer.
        </p>
      </InfoSection>

      <InfoSection title="Late cancellations and no-shows">
        <InfoList
          items={[
            "Students: if you cancel close to the session start time, or do not attend, the session may not be eligible for a refund. Contact support if there were exceptional circumstances.",
            "Tutors: if a tutor does not attend or cancels late, the student should not be charged, and support will arrange a refund where applicable.",
          ]}
        />
      </InfoSection>

      <InfoSection title="Contact">
        <p>
          For cancellation or refund help, email{" "}
          <a className="text-brand hover:underline" href="mailto:info@ilmefy.com">
            info@ilmefy.com
          </a>
          .
        </p>
      </InfoSection>
    </InfoPage>
  );
}
