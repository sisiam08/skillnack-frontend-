"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ReviewType } from "@/types";
import RenderStars from "./renderStars";

type ReviewsProps = {
  reviews: ReviewType[];
  layout?: "carousel" | "grid";
};

export default function Reviews({
  reviews,
  layout = "carousel",
}: ReviewsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (layout !== "carousel") return;
    if (reviews.length <= 3) return;
    const element = scrollRef.current;
    if (!element) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      element.scrollLeft += e.deltaY;
    };

    element.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      element.removeEventListener("wheel", handleWheel);
    };
  }, [layout, reviews.length]);

  return (
    <section>
      <div className="mx-auto w-full px-1">
        {reviews.length > 0 ? (
          <div
            ref={scrollRef}
            className={cn(
              layout === "carousel"
                ? "overflow-x-auto pb-4 scrollbar-hide"
                : "",
            )}
          >
            <div
              className={cn(
                layout === "carousel"
                  ? "flex min-w-max gap-6"
                  : "grid gap-3 md:grid-cols-2 xl:grid-cols-3",
              )}
            >
              {reviews.map((review, index) => (
                <Card
                  key={review.id}
                  className={cn(
                    "animate-in fade-in slide-in-from-bottom-2 rounded-2xl border py-0 transition-all duration-500",
                    layout === "carousel"
                      ? "w-65 shrink-0 border-gray-100 bg-white shadow-md hover:shadow-xl sm:w-80 lg:w-88 dark:border-gray-800 dark:bg-brand-surface/80 snap-start"
                      : "w-full border-border bg-card shadow-sm",
                  )}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="space-y-4 p-6">
                    <Badge
                      variant="secondary"
                      className="w-fit bg-transparent p-0 text-lg text-brand"
                    >
                      <RenderStars rating={review.rating} />
                    </Badge>

                    <CardDescription
                      className={cn(
                        "text-sm leading-relaxed italic",
                        layout === "carousel"
                          ? "text-[#4b4b4b] dark:text-gray-300"
                          : "text-muted-foreground",
                      )}
                    >
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
                        <CardTitle
                          className={cn(
                            "text-sm font-bold",
                            layout === "carousel"
                              ? "text-brand-ink dark:text-white"
                              : "text-foreground",
                          )}
                        >
                          {review.studentName}
                        </CardTitle>
                        <CardDescription
                          className={cn(
                            "text-xs",
                            layout === "carousel"
                              ? "text-gray-500 dark:text-gray-400"
                              : "text-muted-foreground",
                          )}
                        >
                          Reviewed {review.tutorName} - {review.tutorCategory}
                        </CardDescription>
                      </div>
                    </CardHeader>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex justify-center text-sm text-muted-foreground">
            No reviews yet. Be the first to review your tutor and share your
            experience with others!
          </div>
        )}
      </div>
    </section>
  );
}
