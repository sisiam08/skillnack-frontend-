"use client";

import { useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import type { LucideIcon } from "lucide-react";
import { BookOpen, BrainCircuit, Code2, Rocket } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

type ServiceCard = {
  title: string;
  description: string;
  badge: string;
  icon: LucideIcon;
};

const SERVICE_CARDS: ServiceCard[] = [
  {
    title: "Coding Help",
    description: "Fix bugs, understand logic, debug with experts",
    badge: "Popular",
    icon: Code2,
  },
  {
    title: "Study Help",
    description: "Solve math, physics, and tough concepts fast",
    badge: "High Demand",
    icon: BookOpen,
  },
  {
    title: "Concept Clear",
    description: "Understand difficult topics in one session",
    badge: "Most Needed",
    icon: BrainCircuit,
  },
  {
    title: "Skill Guidance",
    description: "Learn skills faster with expert guidance",
    badge: "Trending",
    icon: Rocket,
  },
];

const BLOCK_PATTERN_CLASSES = [
  "md:w-4/5 md:ml-14",
  "md:w-4/5 md:ml-auto",
  "md:w-4/5 md:mr-auto",
  "md:w-4/5 md:ml-20",
];

const MOTION_CLASSES = [
  "block-float-a",
  "block-float-b",
  "block-float-c",
  "block-float-d",
];

export function InteractiveServiceCards() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [tilt, setTilt] = useState<Record<string, { x: number; y: number }>>(
    {},
  );

  const handlePointerMove = (
    title: string,
    event: ReactPointerEvent<HTMLDivElement>,
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;

    setHoveredCard(title);
    setTilt((current) => ({
      ...current,
      [title]: {
        x: (0.5 - y) * 8,
        y: (x - 0.5) * 8,
      },
    }));
  };

  const handlePointerLeave = (title: string) => {
    setHoveredCard((current) => (current === title ? null : current));
    setTilt((current) => ({
      ...current,
      [title]: { x: 0, y: 0 },
    }));
  };

  return (
    <div className="relative mx-auto w-full md:max-w-230">
      <div className="relative z-10 flex flex-col gap-5 md:gap-6">
        {SERVICE_CARDS.map((card, index) => {
          const activeTilt = tilt[card.title] ?? { x: 0, y: 0 };
          const isHovered = hoveredCard === card.title;
          const Icon = card.icon;
          const blockPatternClass = BLOCK_PATTERN_CLASSES[index] ?? "";
          const motionClass =
            MOTION_CLASSES[index % MOTION_CLASSES.length] ?? "";

          return (
            <div
              key={card.title}
              className={`w-full ${blockPatternClass} ${motionClass}`}
              style={{
                animationDelay: `${index * 0.24}s`,
              }}
            >
              <Card
                className="group w-full overflow-hidden rounded-4xl border border-border/70 bg-card transition-[transform,box-shadow,border-color] duration-300 ease-out will-change-transform hover:-translate-y-1 hover:scale-[1.03] hover:border-primary/40"
                style={{
                  transform: `perspective(1200px) rotateX(${activeTilt.x}deg) rotateY(${activeTilt.y}deg) translateY(${isHovered ? "-4px" : "0px"}) scale(${isHovered ? 1.03 : 1})`,
                  boxShadow: isHovered
                    ? "0 24px 56px hsl(var(--primary) / 0.45)"
                    : "0 8px 18px hsl(var(--primary) / 0.14)",
                }}
                onPointerMove={(event) => handlePointerMove(card.title, event)}
                onPointerLeave={() => handlePointerLeave(card.title)}
              >
                <CardContent className="flex items-start justify-between gap-4 p-4 sm:p-5 lg:p-6">
                  <div className="flex min-w-0 items-start gap-3 lg:gap-4">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-sm transition-transform duration-300 group-hover:scale-105 lg:size-10">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-base font-semibold text-foreground sm:text-lg lg:text-[17px]">
                        {card.title}
                      </h3>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground lg:leading-5">
                        {card.description}
                      </p>
                    </div>
                  </div>

                  <span className="mt-0.5 inline-flex shrink-0 items-center rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-primary">
                    {card.badge}
                  </span>
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .block-float-a {
          animation: blockFloatA 5.8s ease-in-out infinite;
        }

        .block-float-b {
          animation: blockFloatB 6.6s ease-in-out infinite;
        }

        .block-float-c {
          animation: blockFloatC 7.2s ease-in-out infinite;
        }

        .block-float-d {
          animation: blockFloatD 6s ease-in-out infinite;
        }

        @keyframes blockFloatA {
          0%,
          100% {
            transform: translate3d(0, 0, 0);
          }
          50% {
            transform: translate3d(0, -7px, 0);
          }
        }

        @keyframes blockFloatB {
          0%,
          100% {
            transform: translate3d(0, 0, 0);
          }
          50% {
            transform: translate3d(6px, 4px, 0);
          }
        }

        @keyframes blockFloatC {
          0%,
          100% {
            transform: translate3d(0, 0, 0);
          }
          50% {
            transform: translate3d(-5px, -4px, 0);
          }
        }

        @keyframes blockFloatD {
          0%,
          100% {
            transform: translate3d(0, 0, 0);
          }
          50% {
            transform: translate3d(4px, -6px, 0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .block-float-a,
          .block-float-b,
          .block-float-c,
          .block-float-d {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
