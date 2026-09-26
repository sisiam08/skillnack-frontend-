import type { Metadata } from "next";
import { InfoPage, InfoSection } from "../_component/page/info/InfoPage";

export const metadata: Metadata = {
  title: "FAQ & Help Center",
  description:
    "Answers to common questions about booking, payment, becoming a tutor, reporting issues, and live session technical requirements on Ilmefy.",
  alternates: { canonical: "/faq" },
};

const faqs = [
  {
    q: "How does booking work?",
    a: "Describe your problem or topic, optionally attach files, choose a tutor and an available time, and pay for the session. The tutor sees your request details so they can prepare before you meet.",
  },
  {
    q: "How does payment work?",
    a: "Sessions are paid per booking in Bangladeshi Taka (BDT) through Stripe. There are no subscriptions. Your booking is confirmed once payment completes.",
  },
  {
    q: "What if the tutor can't solve my problem?",
    a: "After a completed session you can record whether the problem was solved, partially solved, or not solved. If a session was not delivered as expected, contact support and we will help.",
  },
  {
    q: "How do I become a tutor?",
    a: "Sign up as a tutor, complete your profile (subjects, skills, experience, hourly rate), and set your availability. New profiles are reviewed before they appear in public search.",
  },
  {
    q: "How do I report a problem or an issue with a session?",
    a: "Email support with your booking details and a short description. We review reports and may take action on accounts that breach our terms.",
  },
  {
    q: "What do I need for a live session?",
    a: "A modern browser and, for audio/video, a working microphone and camera. The live session opens in your browser. Screen sharing is available on desktop browsers (it is not supported on most mobile browsers).",
  },
  {
    q: "How many files can I attach to a booking request?",
    a: "You can attach up to 5 files (images, PDFs, documents, or text files) up to 50 MB each so your tutor can prepare.",
  },
];

export default function FaqPage() {
  return (
    <InfoPage
      title="FAQ / Help Center"
      subtitle="Answers to common questions about Ilmefy."
    >
      {faqs.map((item) => (
        <InfoSection key={item.q} title={item.q}>
          <p>{item.a}</p>
        </InfoSection>
      ))}

      <InfoSection title="Still need help?">
        <p>
          Email{" "}
          <a className="text-brand hover:underline" href="mailto:info@ilmefy.com">
            info@ilmefy.com
          </a>{" "}
          and we'll get back to you.
        </p>
      </InfoSection>
    </InfoPage>
  );
}
