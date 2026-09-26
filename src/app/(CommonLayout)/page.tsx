import { FinalCtaSection } from "./_component/page/home/FinalCtaSection";
import { HeroSection } from "./_component/page/home/HeroSection";
import { HowItWorksSection } from "./_component/page/home/HowItWorksSection";
import { ProblemSection } from "./_component/page/home/ProblemSection";
import { SolutionSection } from "./_component/page/home/SolutionSection";
import { TrustSection } from "./_component/page/home/TrustSection";
import { TutorsSection } from "./_component/page/home/TutorsSection";
import { UseCasesSection } from "./_component/page/home/UseCasesSection";
import Reveal from "@/components/shared/Reveal";

const siteUrl = process.env.NEXT_PUBLIC_FRONTEND_URL ?? "http://localhost:3000";

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Ilmefy",
  url: siteUrl,
  logo: `${siteUrl}/ilmefy_icon+name-light.svg`,
  description:
    "Ilmefy is a marketplace for focused, pay-per-session 1-on-1 online tutoring for students and professionals.",
};

export default function HomePage() {
  return (
    <main className="relative overflow-hidden ">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <div className="pointer-events-none absolute inset-0" />

      <div className="relative">
        {/* Hero is above the fold: intentionally not wrapped so it never flashes. */}
        <HeroSection />
        <Reveal>
          <ProblemSection />
        </Reveal>
        <Reveal>
          <SolutionSection />
        </Reveal>
        <Reveal>
          <HowItWorksSection />
        </Reveal>
        <Reveal>
          <UseCasesSection />
        </Reveal>
        <Reveal>
          <TutorsSection />
        </Reveal>
        <Reveal>
          <TrustSection />
        </Reveal>
        <Reveal>
          <FinalCtaSection />
        </Reveal>
      </div>
    </main>
  );
}
