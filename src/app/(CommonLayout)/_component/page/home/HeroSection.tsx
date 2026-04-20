import Link from "next/link";
import { Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { InteractiveServiceCards } from "./InteractiveServiceCards";

export function HeroSection() {
  return (
    <section className="relative mx-auto max-w-7xl px-4 pb-24 pt-8 sm:px-6 lg:px-8 lg:pb-32 lg:pt-12">
      <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-16">
        <div className="max-w-2xl flex flex-col justify-center lg:block">
          <Badge className="inline-flex items-center justify-center gap-2 border-orange-200 bg-orange-50 px-4 py-2 text-sm font-medium text-[#d94f0f] shadow-sm">
            <Sparkles className="h-4 w-4" />
            On-demand tutoring, built for momentum
          </Badge>

          <h1 className="mt-6 text-5xl font-black tracking-tight text-foreground sm:text-6xl lg:text-[64px] lg:leading-none">
            Get unstuck. Learn instantly.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground sm:text-xl">
            Book expert tutors for 1-on-1 sessions — anytime you need help.
            Solve a specific problem quickly and move forward with confidence.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button
              asChild
              className="h-12 rounded-full bg-[#ec5b13] px-6 text-sm font-semibold text-white shadow-[0_16px_35px_rgba(236,91,19,0.28)] transition-all duration-300 hover:bg-[#d94f0f] hover:scale-[1.03] hover:shadow-[0_18px_42px_rgba(236,91,19,0.35)]"
            >
              <Link href="/find-tutors">Book a Session</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-12 rounded-full border-border bg-background/90 px-6 text-sm font-semibold text-foreground shadow-sm transition-all duration-300 hover:scale-[1.03] hover:border-orange-200 hover:bg-orange-50 hover:text-[#d94f0f]"
            >
              <Link href="/signup">Become a Tutor</Link>
            </Button>
          </div>

          <p className="mt-4 text-sm text-muted-foreground">
            No subscriptions. Pay per session.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              "Book in minutes",
              "Hourly 1:1 sessions",
              "Focus on one problem",
            ].map((item) => (
              <Card
                key={item}
                className="rounded-2xl border-border/80 bg-card/80 shadow-[0_12px_30px_rgba(15,23,42,0.04)] backdrop-blur"
              >
                <CardContent className="px-4 py-3 text-sm font-medium text-muted-foreground">
                  {item}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="w-full lg:pl-2">
          <InteractiveServiceCards />
        </div>
      </div>
    </section>
  );
}
