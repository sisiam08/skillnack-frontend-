import { CheckCircle2, Clock3, Wallet, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export function SolutionSection() {
  return (
    <section className="bg-muted/40">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <Badge className="inline-flex items-center gap-2 border-orange-200 bg-white px-4 py-2 text-sm font-semibold text-[#d94f0f] shadow-sm">
              <Zap className="h-4 w-4" />
              Fast help, no commitment
            </Badge>
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Get help — exactly when you need it
            </h2>
            <p className="mt-4 text-lg leading-8 text-muted-foreground">
              No subscriptions. No long-term commitments. Just book a tutor and
              solve your problem instantly.
            </p>

            <div className="mt-8 space-y-3">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-50 text-[#ec5b13]">
                  <Clock3 className="h-4 w-4" />
                </span>
                <p className="font-medium text-foreground">
                  Book sessions anytime
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-50 text-[#ec5b13]">
                  <Wallet className="h-4 w-4" />
                </span>
                <p className="font-medium text-foreground">Pay only per hour</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-50 text-[#ec5b13]">
                  <Zap className="h-4 w-4" />
                </span>
                <p className="font-medium text-foreground">
                  Solve problems instantly
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Card className="rounded-2xl border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
              <CardContent className="flex items-center justify-between p-5">
                <p className="text-sm font-medium text-foreground">
                  Booked: Coding Session - 7:00 PM
                </p>
                <Clock3 className="h-4 w-4 text-[#ec5b13]" />
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
              <CardContent className="flex items-center justify-between p-5">
                <p className="text-sm font-medium text-foreground">
                  Tutor Joined
                </p>
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
              <CardContent className="flex items-center justify-between p-5">
                <p className="text-sm font-medium text-foreground">
                  Problem Solved
                </p>
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
