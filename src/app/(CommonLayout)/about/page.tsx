import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { InfoPage, InfoSection } from "../_component/page/info/InfoPage";

export const metadata: Metadata = {
  title: "About",
  description:
    "Ilmefy is a marketplace for focused, pay-per-session 1-on-1 online tutoring for university students and working professionals.",
  alternates: { canonical: "/about" },
};

const steps = [
  {
    title: "Describe the problem",
    body: "Tell us what you are stuck on — a course topic or a work skill — and optionally attach files so the tutor can prepare.",
  },
  {
    title: "Book a tutor",
    body: "Pick a tutor and an available time slot, and pay securely per session. No subscriptions.",
  },
  {
    title: "Solve it in one session",
    body: "Meet 1-on-1 in a live session, work through the problem with guidance, and keep the tutor's written summary afterwards.",
  },
];

export default function AboutPage() {
  return (
    <InfoPage
      title="About Ilmefy"
      subtitle="Instant 1-on-1 help for university students and working professionals."
    >
      <InfoSection title="What Ilmefy is">
        <p>
          Ilmefy is a marketplace for focused, pay-per-session online tutoring.
          Instead of committing to a long course, you describe a specific problem
          or topic, book an expert tutor, and solve it in a single session. It is
          built for the moment you are stuck right now.
        </p>
      </InfoSection>

      <InfoSection title="Who it's for">
        <p>
          Ilmefy is for learners — university students, working professionals, and
          anyone who wants focused 1-on-1 help, including young coders and
          students. By using Ilmefy, you confirm that you have the legal capacity
          to enter into this agreement.
        </p>
      </InfoSection>

      <InfoSection title="How it works">
        <div className="grid gap-4 sm:grid-cols-3">
          {steps.map((step, index) => (
            <Card key={step.title} className="border-border/70 bg-card/80">
              <CardContent className="space-y-2 p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-brand">
                  Step {index + 1}
                </p>
                <p className="font-semibold text-foreground">{step.title}</p>
                <p className="text-sm text-muted-foreground">{step.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </InfoSection>

      <InfoSection title="For tutors">
        <p>
          Tutors sign up, build a profile with their subjects and skills, set
          their own availability and hourly rate, and receive session requests.
          Profiles go through a review step before they appear publicly.
        </p>
      </InfoSection>
    </InfoPage>
  );
}
