import { BriefcaseBusiness, Code2, Brain, Rocket } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const useCases = [
  {
    icon: <Code2 className="h-5 w-5" />,
    title: "Debug your code",
    description:
      "Fix bugs faster with a tutor who can inspect the problem live.",
  },
  {
    icon: <Rocket className="h-5 w-5" />,
    title: "Prepare for exams",
    description:
      "Get focused explanations for the exact topics you're stuck on.",
  },
  {
    icon: <Brain className="h-5 w-5" />,
    title: "Concept Clarification",
    description:
      "Break down complex topics and understand them clearly in just one session.",
  },
  {
    icon: <Rocket className="h-5 w-5" />,
    title: "Learn new skills",
    description: "Go from stuck to shipping with on-demand expert guidance.",
  },
] as const;

export function UseCasesSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="text-center">
        <Badge className="inline-flex items-center gap-2 border-orange-200 bg-orange-50 px-4 py-2 text-sm font-semibold text-[#d94f0f] shadow-sm">
          <BriefcaseBusiness className="h-4 w-4" />
          Practical use cases
        </Badge>
        <h2 className="mt-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Built for the <span className="dark:text-brand">problems</span> people
          actually need <span className="dark:text-brand">solved</span>
        </h2>
      </div>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {useCases.map((item) => (
          <Card
            key={item.title}
            className="rounded-[24px] border border-border bg-card p-6 shadow-[0_16px_42px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(236,91,19,0.12)]"
          >
            <CardContent className="p-0">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-50 text-[#ec5b13]">
                {item.icon}
              </div>
              <h3 className="mt-5 text-lg font-semibold text-foreground">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {item.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
