import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { TutorCardProps } from "@/types";
import Link from "next/link";
import { BadgeCheck, Star } from "lucide-react";
import { VerificationStatus } from "@/constants/status";

const DEFAULT_AVATAR = "/default-avatar-profile.jpg";

export default function TutorCard({
  tutor,
  animationIndex = 0,
}: TutorCardProps) {
  const averageRating =
    tutor.totalReviews > 0 ? tutor.totalRating / tutor.totalReviews : 0;

  const totalOutcomes = tutor.totalOutcomesRecorded ?? 0;
  const solveRate =
    totalOutcomes > 0
      ? Math.round(((tutor.solvedCount ?? 0) / totalOutcomes) * 100)
      : null;

  // Extract expertise title from category
  const expertiseTitle = tutor.category?.name || "Tutor";

  // Prefer tutor-provided tags; fallback to category label
  const tags =
    tutor.tags?.length > 0
      ? tutor.tags
      : tutor.category?.name
        ? [tutor.category.name]
        : [];

  const availableDays = tutor.availability?.map((slot) => slot.dayOfWeek);
  const today = new Date().getDay();

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const getNextAvailableDay = (availableDays: number[], today: number) => {
    for (let i = 1; i <= 7; i++) {
      const nextDay = (today + i) % 7;
      if (availableDays.includes(nextDay)) {
        return days[nextDay];
      }
    }
    return null;
  };

  // Note: `getNextAvailableDay` starts from tomorrow, so this never claims
  // "today" when the authoritative `availableToday` flag is false.
  const nextAvailableHint =
    availableDays && availableDays.length > 0
      ? getNextAvailableDay(availableDays, today)
      : null;

  return (
    <Card
      className="group animate-in slide-in-from-bottom-2 fade-in overflow-hidden border-border/70 bg-card/95 shadow-[0_12px_28px_rgba(15,23,42,0.08)] transition-all duration-300 hover:shadow-[0_16px_40px_rgba(15,23,42,0.12)] hover:-translate-y-1"
      style={{ animationDelay: `${animationIndex * 50}ms` }}
    >
      <CardContent className="flex flex-col gap-4 p-4 sm:p-5">
        {/* Avatar + Header */}
        <div className="flex items-start gap-3">
          <div className="relative size-16 shrink-0 overflow-hidden rounded-xl ring-2 ring-border/50">
            <Image
              src={tutor.user?.image || DEFAULT_AVATAR}
              alt={tutor.user?.name ?? "Tutor"}
              fill
              unoptimized
              className="object-cover transition-transform duration-300 group-hover:scale-110"
            />
          </div>

          <div className="min-w-0 flex-1">
            {/* Name + Rating */}
            <div className="mb-1 flex items-start justify-between gap-2">
              <h3 className="flex items-center gap-1 truncate text-sm font-bold text-foreground">
                {tutor.user?.name ?? "Unknown Tutor"}
                {tutor.verificationStatus === VerificationStatus.APPROVED ? (
                  <BadgeCheck
                    className="size-3.5 shrink-0 text-brand"
                    aria-label="Verified tutor"
                  />
                ) : null}
              </h3>
              <div className="flex shrink-0 items-center gap-1 text-amber-500">
                <Star className="size-3.5 fill-current" />
                <span className="text-xs font-bold">
                  {averageRating.toFixed(1)}
                </span>
              </div>
            </div>

            {/* Expertise Title */}
            <p className="truncate text-xs font-semibold text-gray-400">
              {expertiseTitle}
            </p>
          </div>
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.slice(0, 4).map((tag, idx) => (
              <span
                key={idx}
                className="inline-block rounded-full border border-border/60 bg-secondary/40 px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Availability Hint */}
        {tutor.availableNow ? (
          <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-emerald-500 align-middle mr-1.5" />
            Available now
          </p>
        ) : tutor.availableToday ? (
          <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
            <span className="inline-block h-2 w-2 rounded-full bg-green-500 align-middle mr-1.5" />
            Available today
          </p>
        ) : (
          <p className="text-xs text-muted-foreground">
            <span className="inline-block h-2 w-2 rounded-full bg-gray-400 align-middle mr-1.5" />
            {nextAvailableHint
              ? `Next available: ${nextAvailableHint}`
              : "No availability"}
          </p>
        )}

        {/* Solve rate */}
        {solveRate !== null ? (
          <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            {solveRate}% problems solved
            <span className="font-normal text-muted-foreground">
              {" "}
              ({totalOutcomes} {totalOutcomes === 1 ? "outcome" : "outcomes"})
            </span>
          </p>
        ) : (
          <p className="text-xs text-muted-foreground">
            Not enough data for solve rate
          </p>
        )}

        {/* Price + CTA */}
        <div className="flex items-center justify-between gap-2 pt-2">
          <div className="text-sm font-bold text-foreground">
            Tk {tutor.hourlyRate}
            <span className="text-xs font-normal text-muted-foreground">
              {" "}
              / hr
            </span>
          </div>

          <Link href={`/find-tutors/${tutor.id}`}>
            <Button
              size="sm"
              className="h-8 rounded-lg px-3 text-xs font-semibold bg-[#ec5b13] hover:bg-[#d94f0f]"
            >
              View Profile
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
