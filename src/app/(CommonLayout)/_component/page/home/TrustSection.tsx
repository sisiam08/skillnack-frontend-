import { BadgeCheck, ShieldCheck, Star } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

const trustPoints = [
  {
    icon: <BadgeCheck className="h-5 w-5" />,
    title: "Verified tutors",
    description:
      "A curated network of experts across practical learning areas.",
  },
  {
    icon: <Star className="h-5 w-5" />,
    title: "Ratings & reviews",
    description: "Choose tutors backed by real learner feedback and outcomes.",
  },
  {
    icon: <ShieldCheck className="h-5 w-5" />,
    title: "Secure payments",
    description: "Safe checkout and protected transactions for every session.",
  },
] as const;

export function TrustSection() {
  return (
    <section className="bg-muted/40">
      <div className="mx-auto max-w-6xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Trusted by learners who want fast, focused help
        </h2>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {trustPoints.map((item) => (
            <Card
              key={item.title}
              className="rounded-[24px] border border-border bg-card p-6 shadow-[0_16px_42px_rgba(15,23,42,0.05)]"
            >
              <CardContent className="p-0">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-[#ec5b13]">
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
      </div>
    </section>
  );
}
