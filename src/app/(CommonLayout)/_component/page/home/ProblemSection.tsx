import { Clock3, Wallet, Zap } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const painPoints = [
  {
    icon: <Clock3 className="h-5 w-5" />,
    title: "Wastes time searching",
    description:
      "Too many tabs, videos, and forums before you get one clear answer.",
  },
  {
    icon: <Zap className="h-5 w-5" />,
    title: "No instant answers",
    description:
      "Problems are urgent. Waiting for replies slows your momentum.",
  },
  {
    icon: <Wallet className="h-5 w-5" />,
    title: "Expensive long-term tutors",
    description:
      "Traditional tutoring often means paying for more than you need.",
  },
] as const;

export function ProblemSection() {
  return (
    <section className="relative border-y border-border/70">
      <div className="mx-auto max-w-5xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-2xl flex-col items-center">
          <Badge className="inline-flex items-center gap-2 border-orange-200 bg-orange-50 px-4 py-2 text-sm font-semibold text-[#d94f0f] shadow-sm">
            <Zap className="h-4 w-4" />
            Problem first, not course first
          </Badge>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            <span className="dark:text-brand">Stuck on a problem? </span>
            You’re not alone.
          </h2>
          <p className="mt-4 text-lg leading-8 text-muted-foreground">
            You jump from YouTube to forums, still need help right now, and end
            up paying for tutors you do not need long term. Skillnack gives you
            fast, focused help when the problem is urgent.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {painPoints.map((item) => (
            <Card
              key={item.title}
              className="flex items-start gap-4 rounded-[24px] border border-border bg-card p-5 text-left shadow-[0_16px_40px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_50px_rgba(236,91,19,0.12)]"
            >
              <CardContent className="flex items-start gap-4 p-0 text-left">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-[#ec5b13]">
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
