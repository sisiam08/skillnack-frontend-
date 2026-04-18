import {
  BadgeCheck,
  CalendarDays,
  LaptopMinimal,
  Sparkles,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const howItWorks = [
  {
    icon: <Sparkles className="h-6 w-6" />,
    title: "Find a tutor",
    description: "Browse tutors by subject, skill, or problem type in seconds.",
  },
  {
    icon: <CalendarDays className="h-6 w-6" />,
    title: "Pick your time",
    description:
      "Choose an hourly 1:1 slot that fits your schedule right away.",
  },
  {
    icon: <LaptopMinimal className="h-6 w-6" />,
    title: "Join session",
    description: "Get live help, solve the issue, and move on with confidence.",
  },
] as const;

export function HowItWorksSection() {
  return (
    <section className="bg-muted/40">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <Badge className="inline-flex items-center gap-2 border-orange-200 bg-white px-4 py-2 text-sm font-semibold text-[#d94f0f] shadow-sm">
            <BadgeCheck className="h-4 w-4" />
            Simple flow
          </Badge>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            How it works
          </h2>
          <p className="mt-4 text-lg leading-8 text-muted-foreground">
            A clean, three-step flow that gets users from problem to solution
            with minimal friction.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {howItWorks.map((step, index) => (
            <Card
              key={step.title}
              className="group rounded-[24px] border border-border bg-card p-6 shadow-[0_16px_42px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(236,91,19,0.12)]"
            >
              <CardContent className="p-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-[#ec5b13] transition-transform duration-300 group-hover:scale-110">
                  {step.icon}
                </div>
                <div className="mt-5 flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.2em] text-orange-300">
                  <span>0{index + 1}</span>
                  <span className="h-px flex-1 bg-orange-100" />
                </div>
                <h3 className="mt-4 text-xl font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {step.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
