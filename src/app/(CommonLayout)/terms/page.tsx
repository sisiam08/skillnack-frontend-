import type { Metadata } from "next";
import {
  InfoList,
  InfoPage,
  InfoSection,
} from "../_component/page/info/InfoPage";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "The terms for using Ilmefy: eligibility, account responsibilities, how booking and payment work, conduct expectations, and academic integrity.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <InfoPage
      title="Terms & Conditions"
      subtitle="The rules for using Ilmefy."
      updated="September 2025"
    >
      <InfoSection title="Legal capacity">
        <p>
          By using Ilmefy, you confirm that you have the legal capacity to enter
          into this agreement.
        </p>
      </InfoSection>

      <InfoSection title="Your account">
        <InfoList
          items={[
            "Provide accurate information and keep it up to date.",
            "Keep your login credentials secure and do not share your account.",
            "You are responsible for activity that happens under your account.",
            "One account per person.",
          ]}
        />
      </InfoSection>

      <InfoSection title="Booking and payment">
        <p>
          You book a session by describing your problem or topic, selecting an
          available time, and paying for the session. Sessions are priced at the
          tutor's hourly rate, scaled to the chosen duration, and charged in
          Bangladeshi Taka (BDT) through our payment provider, Stripe. A booking
          is confirmed once payment is completed.
        </p>
      </InfoSection>

      <InfoSection title="Cancellation">
        <p>
          You can cancel a confirmed session from your dashboard before it starts.
          Sessions that are not completed are marked as cancelled. Refunds are not
          currently issued automatically — see our{" "}
          <a className="text-brand hover:underline" href="/refund-policy">
            Refund &amp; Cancellation Policy
          </a>{" "}
          for how cancellations and refund requests are handled.
        </p>
      </InfoSection>

      <InfoSection title="Academic integrity">
        <p>
          Ilmefy is for learning and understanding. Tutors explain concepts and
          guide you through problems; they do not complete graded assignments,
          exams, or projects on your behalf, and you must not ask them to. You are
          responsible for complying with your institution's academic policies.
        </p>
      </InfoSection>

      <InfoSection title="Conduct expectations">
        <InfoList
          items={[
            "Students: be respectful, attend on time, and provide accurate problem details.",
            "Tutors: be respectful, professional, and prepared; only accept sessions you can genuinely help with.",
            "Do not use the platform for harassment, illegal activity, or sharing harmful content.",
          ]}
        />
      </InfoSection>

      <InfoSection title="Our role and limitation of liability">
        <p>
          Ilmefy is a marketplace that connects students with independent tutors.
          We are not the employer of tutors and are not a party to the tutoring
          itself. We do not guarantee a particular outcome from any session. To the
          extent permitted by law, Ilmefy is not liable for indirect or
          consequential losses arising from sessions or from user conduct.
        </p>
      </InfoSection>

      <InfoSection title="Suspension and termination">
        <p>
          We may suspend or terminate accounts that violate these terms, breach
          platform rules, or pose a risk to other users. Tutors whose profiles do
          not meet our review requirements may be rejected and not shown publicly.
        </p>
      </InfoSection>

      <InfoSection title="Governing law">
        <p>
          These terms are governed by the laws of Bangladesh.
        </p>
      </InfoSection>

      <InfoSection title="Contact">
        <p>
          Questions about these terms? Email{" "}
          <a className="text-brand hover:underline" href="mailto:info@ilmefy.com">
            info@ilmefy.com
          </a>
          . We aim to respond within 2 business days.
        </p>
      </InfoSection>
    </InfoPage>
  );
}
