"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import RenderStars from "../../../../../../components/shared/renderStars";
import { ReviewType } from "@/types";

type ReviewsProps = {
  reviews: ReviewType[];
  avgRating?: number;
};

export default function Reviews({ reviews, avgRating }: ReviewsProps) {
  return (
    <Card className="rounded-2xl border border-border/70 bg-card/80 shadow-sm">
      <CardHeader className="space-y-2 border-b border-border">
        <CardTitle className="text-foreground">Reviews</CardTitle>
        <CardDescription className="text-muted-foreground">
          Average rating {avgRating ?? 0} from {reviews.length} reviews.
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-6">
        {reviews.length > 0 ? (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {reviews.map((review) => (
              <Card
                key={review.id}
                className="w-full border-border bg-card shadow-sm"
              >
                <CardContent className="space-y-4 p-6">
                  <Badge
                    variant="secondary"
                    className="w-fit bg-transparent p-0 text-lg text-brand"
                  >
                    <RenderStars rating={review.rating} />
                  </Badge>

                  <CardDescription className="text-sm leading-relaxed italic text-muted-foreground">
                    "{review.comment}"
                  </CardDescription>

                  <CardHeader className="flex flex-row items-center gap-3 px-0 pb-0">
                    <Avatar className="size-10 border border-border/70">
                      <AvatarImage
                        src={review.studentImage}
                        alt={review.studentName}
                      />
                      <AvatarFallback>SP</AvatarFallback>
                    </Avatar>

                    <div>
                      <CardTitle className="text-sm font-bold text-foreground">
                        {review.studentName}
                      </CardTitle>
                      <CardDescription className="text-xs text-muted-foreground">
                        Reviewed {review.tutorName} - {review.tutorCategory}
                      </CardDescription>
                    </div>
                  </CardHeader>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex justify-center text-sm text-muted-foreground">
            No reviews yet. Be the first to review your tutor and share your
            experience with others!
          </div>
        )}
      </CardContent>
    </Card>
  );
}
