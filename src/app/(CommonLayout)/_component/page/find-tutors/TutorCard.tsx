import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import default_avatar from "../../../../../../public/default-avatar-profile.jpg";
import Image from "next/image";
import { TutorCardProps } from "@/types";
import Link from "next/link";
import { Star } from "lucide-react";

export default function TutorCard({
  tutor,
  animationIndex = 0,
}: TutorCardProps) {
  const averageRating =
    tutor.totalReviews > 0 ? tutor.totalRating / tutor.totalReviews : 0;

  // Extract expertise title from category
  const expertiseTitle = tutor.category?.name || "Tutor";

  // Extract tags (max 3)
  const tags = tutor.category ? [tutor.category.name] : [];

  // Simple availability hint (placeholder logic)
  const availabilityHint =
    tutor.totalCompletedBookings > 10 ? "Available today" : "Next slot today";

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
              src={tutor.user?.image || default_avatar}
              alt={tutor.user?.name ?? "Tutor"}
              fill
              unoptimized
              className="object-cover transition-transform duration-300 group-hover:scale-110"
            />
          </div>

          <div className="min-w-0 flex-1">
            {/* Name + Rating */}
            <div className="mb-1 flex items-start justify-between gap-2">
              <h3 className="truncate text-sm font-bold text-foreground">
                {tutor.user?.name ?? "Unknown Tutor"}
              </h3>
              <div className="flex shrink-0 items-center gap-1 text-amber-500">
                <Star className="size-3.5 fill-current" />
                <span className="text-xs font-bold">
                  {averageRating.toFixed(1)}
                </span>
              </div>
            </div>

            {/* Expertise Title */}
            <p className="truncate text-xs font-semibold text-primary/80">
              {expertiseTitle}
            </p>
          </div>
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="inline-block rounded-full border border-border/60 bg-secondary/40 px-2.5 py-1 text-xs font-medium text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Availability Hint */}
        <p className="text-xs text-muted-foreground">
          <span className="inline-block h-2 w-2 rounded-full bg-green-500 align-middle mr-1.5" />
          {availabilityHint}
        </p>

        {/* Price + CTA */}
        <div className="flex items-center justify-between gap-2 pt-2">
          <div className="text-sm font-bold text-foreground">
            Tk {tutor.hourlyRate}
            <span className="text-xs font-normal text-muted-foreground">
              {" "}
              / hr
            </span>
          </div>

          <Link href={`/find_tutors/${tutor.id}`}>
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
