"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { convertInto12h } from "@/helpers/TimeHelpers";
import { StudentBookings } from "@/types";
import { format } from "date-fns";
import { GraduationCap, MessageSquare, Star, UserRound } from "lucide-react";

type ReviewSessionSheetProps = {
  reviewSheetOpen: boolean;
  setReviewSheetOpen: (open: boolean) => void;
  reviewSession: StudentBookings | null;
  rating: number;
  hoveredRating: number;
  reviewText: string;
  setRating: (rating: number) => void;
  setHoveredRating: (rating: number) => void;
  setReviewText: (text: string) => void;
  submitReview: () => void;
};

export default function ReviewSessionSheet({
  reviewSheetOpen,
  setReviewSheetOpen,
  reviewSession,
  rating,
  hoveredRating,
  reviewText,
  setRating,
  setHoveredRating,
  setReviewText,
  submitReview,
}: ReviewSessionSheetProps) {
  const hasReview = () => Boolean(reviewSession?.reviews);

  return (
    <Sheet open={reviewSheetOpen} onOpenChange={setReviewSheetOpen}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-2xl p-0 gap-0"
        showCloseButton={false}
      >
        <SheetHeader className="border-b bg-linear-to-r from-orange-50 via-white to-amber-50 px-6 py-5 text-left">
          <SheetTitle className="flex items-center gap-2 text-xl text-brand-ink dark:text-brand-ink">
            <MessageSquare
              className="size-5 text-brand"
              suppressHydrationWarning
            />
            Review Session
          </SheetTitle>
          <SheetDescription className="text-[#6b4f3d] dark:text-[#6b4f3d]">
            Share feedback about your completed lesson and tutor experience.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto">
          {reviewSession ? (
            <div className="space-y-6 px-6 py-5">
              <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                <Card className="border-border/70 shadow-none">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Booking Info</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="flex size-11 items-center justify-center rounded-xl bg-brand/10 text-brand">
                        <UserRound className="size-5" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Tutor</p>
                        <p className="font-semibold">
                          {reviewSession.tutor.user.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {reviewSession.tutor.user.email}
                        </p>
                      </div>
                    </div>

                    <Separator />

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-xl border bg-muted/20 p-3">
                        <p className="text-xs uppercase tracking-wide text-muted-foreground">
                          Category
                        </p>
                        <p className="mt-1 flex items-center gap-2 text-sm font-medium">
                          <GraduationCap className="size-4 text-brand" />
                          {reviewSession.tutor.category.name}
                        </p>
                      </div>
                      <div className="rounded-xl border bg-muted/20 p-3">
                        <p className="text-xs uppercase tracking-wide text-muted-foreground">
                          Session Fee
                        </p>
                        <p className="mt-1 text-sm font-medium">
                          ৳ {reviewSession.price}
                        </p>
                      </div>
                      <div className="rounded-xl border bg-muted/20 p-3">
                        <p className="text-xs uppercase tracking-wide text-muted-foreground">
                          Date
                        </p>
                        <p className="mt-1 text-sm font-medium">
                          {format(
                            new Date(reviewSession.sessionDate),
                            "MMM dd, yyyy",
                          )}
                        </p>
                      </div>
                      <div className="rounded-xl border bg-muted/20 p-3">
                        <p className="text-xs uppercase tracking-wide text-muted-foreground">
                          Time
                        </p>
                        <p className="mt-1 text-sm font-medium">
                          {convertInto12h(reviewSession.startTime)} -{" "}
                          {convertInto12h(reviewSession.endTime)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border/70 shadow-none">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Your Rating</CardTitle>
                    <CardDescription>
                      Select a score based on the overall class experience.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between rounded-xl border bg-muted/20 px-4 py-3">
                      {[1, 2, 3, 4, 5].map((value) => {
                        const active = (hoveredRating || rating) >= value;

                        return (
                          <button
                            disabled={hasReview()}
                            key={value}
                            type="button"
                            className="transition-transform hover:scale-110"
                            onMouseEnter={() => setHoveredRating(value)}
                            onMouseLeave={() => setHoveredRating(0)}
                            onClick={() => setRating(value)}
                            aria-label={`Set rating to ${value}`}
                          >
                            <Star
                              className={
                                active
                                  ? "size-7 fill-brand text-brand"
                                  : "size-7 text-muted-foreground/40"
                              }
                            />
                          </button>
                        );
                      })}
                    </div>

                    <p className="text-sm text-muted-foreground">
                      {rating === 0
                        ? "Choose between 1 and 5 stars."
                        : `${rating} out of 5 stars selected.`}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium">Written Review</p>
                  <p className="text-sm text-muted-foreground">
                    Mention teaching style, punctuality, clarity, and how
                    helpful the tutor was.
                  </p>
                </div>
                <Textarea
                  disabled={hasReview()}
                  rows={6}
                  value={reviewText}
                  onChange={(event) => setReviewText(event.target.value)}
                  placeholder="Write your review here..."
                />
              </div>
            </div>
          ) : (
            <div className="px-6 py-5 text-sm text-muted-foreground">
              Select a completed session to write a review.
            </div>
          )}
        </div>

        <SheetFooter className="border-t bg-background px-6 py-6 sm:flex-row sm:justify-end">
          <Button
            variant="outline"
            className="font-normal"
            onClick={() => setReviewSheetOpen(false)}
          >
            Cancel
          </Button>
          <Button
            className="bg-brand text-white hover:bg-brand-strong font-normal"
            onClick={submitReview}
            disabled={
              hasReview() ||
              !reviewSession ||
              rating === 0 ||
              !reviewText.trim()
            }
          >
            <MessageSquare className="mr-2 size-4" />
            Submit Review
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
