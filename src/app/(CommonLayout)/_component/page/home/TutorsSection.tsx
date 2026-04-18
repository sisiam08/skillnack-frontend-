import Link from "next/link";
import { CheckCircle2, GraduationCap, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import tutorIncomeImg from "../../../../../../public/KnowledgeToMoney.png";

const tutorBenefits = [
  "Set your own schedule",
  "Teach what you love",
  "Earn per session",
] as const;

export function TutorsSection() {
  return (
    <section
      id="tutors"
      className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8"
    >
      <div className="grid items-center gap-10 lg:grid-cols-[1fr_0.95fr]">
        <div>
          <Badge className="inline-flex items-center gap-2 border-orange-200 bg-orange-50 px-4 py-2 text-sm font-semibold text-[#d94f0f] shadow-sm">
            <Users className="h-4 w-4" />
            Tutor marketplace
          </Badge>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Turn your knowledge into income
          </h2>
          <p className="mt-4 text-lg leading-8 text-muted-foreground">
            Teach what you know, choose the hours that work for you, and earn
            from one-off sessions without building a full course.
          </p>

          <div className="mt-8 space-y-4">
            {tutorBenefits.map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 text-foreground"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-50 text-[#ec5b13]">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <span className="font-medium">{item}</span>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <Button
              asChild
              className="h-12 rounded-full bg-[#ec5b13] px-6 text-sm font-semibold text-white shadow-[0_16px_35px_rgba(236,91,19,0.28)] transition-all duration-300 hover:bg-[#d94f0f] hover:scale-[1.03]"
            >
              <Link href="/signup">Become a Tutor</Link>
            </Button>
          </div>
        </div>

        <div className="mx-auto w-fit rounded-[28px] border-border bg-card shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
          <Image
            src={tutorIncomeImg}
            alt="Tutor Income"
            className="h-auto w-120 max-w-full rounded-[18px]"
            fetchPriority="high"
          />
        </div>
      </div>
    </section>
  );
}
