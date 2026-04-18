import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function FinalCtaSection() {
  return (
    <section
      id="final-cta"
      className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8 lg:pb-28"
    >
      <Card className="overflow-hidden rounded-[32px] border-orange-200 bg-[linear-gradient(135deg,#ec5b13_0%,#ff8a3d_55%,#ffd7bf_100%)] px-6 py-14 text-white shadow-[0_24px_80px_rgba(236,91,19,0.28)] sm:px-10 lg:px-14">
        <CardContent className="relative p-0">
          <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              Ready to solve your problem?
            </h2>
            <p className="mt-4 text-lg leading-8 text-white/85">
              Book your first session or explore tutors who can help you move
              forward today.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button
                asChild
                className="h-12 rounded-full bg-white px-6 text-sm font-semibold text-[#ec5b13] shadow-[0_12px_30px_rgba(15,23,42,0.12)] transition-all duration-300 hover:scale-[1.03] hover:bg-orange-50 hover:text-[#d94f0f]"
              >
                <Link href="/find-tutors">Book Your First Session</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
