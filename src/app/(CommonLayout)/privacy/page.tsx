import type { Metadata } from "next";
import {
  InfoList,
  InfoPage,
  InfoSection,
} from "../_component/page/info/InfoPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Ilmefy collects, uses, and shares your information, the third parties involved, and how to request deletion of your data.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <InfoPage
      title="Privacy Policy"
      subtitle="How Ilmefy collects, uses, and shares your information."
      updated="September 2025"
    >
      <InfoSection title="Information we collect">
        <InfoList
          items={[
            "Account information: name, email address, optional phone number and profile image, your role (student/tutor) and account status.",
            "Authentication data: your password is stored in hashed form by our authentication provider; we never store it in plain text.",
            "Booking information: the problem title, description, goal type, chosen session time, and any files you attach.",
            "Files: attachments you upload are stored with our file-storage provider (Cloudinary).",
            "Payment metadata: we store a payment record and the payment provider's reference. We do not store your card details — these are handled by Stripe.",
            "Session data: bookings, reviews, and tutor session summaries you submit.",
            "Technical data: session tokens, and IP address / browser user-agent associated with your login sessions.",
          ]}
        />
      </InfoSection>

      <InfoSection title="How we use your information">
        <InfoList
          items={[
            "To create and secure your account, and to send verification and password-reset emails.",
            "To match students with tutors and let tutors see the details of a requested session.",
            "To process payments through our payment provider.",
            "To show reviews, ratings, and a tutor's completed-session history on tutor profiles.",
            "To operate internal dashboards and aggregate statistics (for example, platform usage and revenue).",
          ]}
        />
      </InfoSection>

      <InfoSection title="Third parties we share data with">
        <InfoList
          items={[
            "Stripe — payment processing and checkout.",
            "Cloudinary — storage of uploaded files and profile images.",
            "ZegoCloud — live audio/video sessions between students and tutors.",
            "Our email delivery provider (SMTP) — account verification and password-reset emails.",
          ]}
        />
        <p>
          We do not sell your personal data. We do not currently use third-party
          advertising or analytics trackers.
        </p>
      </InfoSection>

      <InfoSection title="Live sessions and recording">
        <p>
          Live sessions are delivered through ZegoCloud. Ilmefy does not record
          your live sessions.
        </p>
      </InfoSection>

      <InfoSection title="Cookies and local storage">
        <p>
          We use a secure, HTTP-only session cookie to keep you signed in. Your
          light/dark theme preference is stored locally in your browser. We do
          not use advertising cookies.
        </p>
      </InfoSection>

      <InfoSection title="Data retention and deletion">
        <p>
          We keep your information for as long as your account is active and as
          needed to operate the platform. You can request deletion of your account
          and personal data by contacting us. Some records (for example, payment
          and transaction records) may be retained where required for legal or
          accounting reasons.
        </p>
      </InfoSection>

      <InfoSection title="Contact">
        <p>
          For privacy questions or data requests, email{" "}
          <a className="text-brand hover:underline" href="mailto:info@ilmefy.com">
            info@ilmefy.com
          </a>
          . We aim to respond within 2 business days.
        </p>
      </InfoSection>
    </InfoPage>
  );
}
