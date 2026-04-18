import { FinalCtaSection } from "./_component/page/home/FinalCtaSection";
import { HeroSection } from "./_component/page/home/HeroSection";
import { HowItWorksSection } from "./_component/page/home/HowItWorksSection";
import { ProblemSection } from "./_component/page/home/ProblemSection";
import { SolutionSection } from "./_component/page/home/SolutionSection";
import { TrustSection } from "./_component/page/home/TrustSection";
import { TutorsSection } from "./_component/page/home/TutorsSection";
import { UseCasesSection } from "./_component/page/home/UseCasesSection";

export default function HomePage() {
  return (
    <main className="relative overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(236,91,19,0.12),transparent_26%),radial-gradient(circle_at_top_right,rgba(251,146,60,0.12),transparent_24%),linear-gradient(180deg,var(--background),color-mix(in_oklab,var(--background)_86%,#f9fafb)_65%,var(--background))]" />

      <div className="relative">
        <HeroSection />
        <ProblemSection />
        <SolutionSection />
        <HowItWorksSection />
        <UseCasesSection />
        <TutorsSection />
        <TrustSection />
        <FinalCtaSection />
      </div>
    </main>
  );
}
