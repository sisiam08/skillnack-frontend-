"use client";

import { useEffect, useMemo, useState } from "react";
import { MessageSquareText } from "lucide-react";

import { getAvailability } from "@/action/availability.action";
import { getAllReviewsForTutorProfile } from "@/action/review.action";
import Availabilities from "@/components/shared/Availabilities";
import Reviews from "@/components/shared/Reviews";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AvailabilityType, ReviewType } from "@/types";

type TutorEngagementSectionProps = {
  tutorId: string;
  avgRating: number;
};

export default function TutorEngagementSection({
  tutorId,
  avgRating,
}: TutorEngagementSectionProps) {
  const [availabilities, setAvailabilities] = useState<AvailabilityType[]>([]);
  const [reviews, setReviews] = useState<ReviewType[]>([]);
  const [showAllReviews, setShowAllReviews] = useState(false);

  useEffect(() => {
    if (!tutorId) return;

    (async () => {
      const [availabilityResponse, reviewsResponse] = await Promise.all([
        getAvailability(tutorId),
        getAllReviewsForTutorProfile(tutorId),
      ]);

      if (availabilityResponse?.data?.success) {
        setAvailabilities(availabilityResponse.data.data);
      }

      if (reviewsResponse?.data?.success) {
        setReviews(reviewsResponse.data.data);
      }
    })();
  }, [tutorId]);

  const displayedReviews = useMemo(() => {
    return showAllReviews ? reviews : reviews.slice(0, 3);
  }, [reviews, showAllReviews]);

  return (
    <>
      <Availabilities
        availabilities={availabilities}
        isTutorView={false}
        className="rounded-2xl border border-border/70 bg-card/80 text-foreground"
      />

      <Card className="rounded-2xl border border-border/70 bg-card/80 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <div>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <MessageSquareText className="size-4 text-brand" />
                Reviews
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Average rating {avgRating} from {reviews.length} reviews.
              </CardDescription>
            </div>

            {reviews.length > 3 ? (
              <Button
                variant="ghost"
                className="text-xs text-brand hover:bg-brand/10"
                onClick={() => setShowAllReviews((prev) => !prev)}
              >
                {showAllReviews ? "Show less" : "View all reviews"}
              </Button>
            ) : null}
          </div>
        </CardHeader>

        <CardContent>
          {displayedReviews.length > 0 ? (
            <Reviews reviews={displayedReviews} layout="grid" />
          ) : (
            <p className="text-sm text-muted-foreground">No reviews yet.</p>
          )}
        </CardContent>
      </Card>
    </>
  );
}
