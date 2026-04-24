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
    <main className="relative overflow-hidden ">
      <div className="pointer-events-none absolute inset-0" />

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
