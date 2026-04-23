"use client";

import { getMyBookings, updateBookingStatus } from "@/action/booking.action";
import { createReview } from "@/action/review.action";
import SessionCard from "@/app/(DashboardLayout)/_component/shared/SessionCard";
import HistorySessionItem from "@/app/(DashboardLayout)/_component/student/session/HistorySessionItem";
import ReviewSessionSheet from "@/app/(DashboardLayout)/_component/student/session/ReviewSessionSheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { toast } from "@/components/ui/sonner";
import { UserRole } from "@/constants/roles";
import { BookingStatus } from "@/constants/status";
import { StudentBookings, StudentSessionBuckets } from "@/types";
import {
  ArrowRight,
  CalendarClock,
  Clock3,
  MessageSquare,
  NotebookTabs,
  Star,
  X,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { isAfter, isToday, startOfDay, startOfToday } from "date-fns";

const getStudentSessionBuckets = (
  allSessions: StudentBookings[],
): StudentSessionBuckets => {
  const today = startOfToday();

  const todaySessions = allSessions.filter((session) =>
    isToday(new Date(session.sessionDate)),
  );

  const upcomingSessions = allSessions.filter((session) =>
    isAfter(startOfDay(new Date(session.sessionDate)), today),
  );

  const historySessions = allSessions.filter(
    (session) => session.status === BookingStatus.COMPLETED,
  );

  const withoutReviewSessions = historySessions.filter(
    (session) => !session.reviews,
  );

  return {
    todaySessions,
    upcomingSessions,
    historySessions,
    withoutReviewSessions,
    completedCount: historySessions.length,
  };
};

type StudentSessionClientProps = {
  initialSessions: StudentBookings[];
};

const POLL_INTERVAL = 20000;

export default function StudentSessionClient({
  initialSessions,
}: StudentSessionClientProps) {
  const initialBuckets = useMemo<StudentSessionBuckets>(
    () => getStudentSessionBuckets(initialSessions),
    [initialSessions],
  );

  const [todaySessions, setTodaySessions] = useState<StudentBookings[]>(
    initialBuckets.todaySessions,
  );
  const [upcomingSessions, setUpcomingSessions] = useState<StudentBookings[]>(
    initialBuckets.upcomingSessions,
  );
  const [completedCount, setCompletedCount] = useState<number>(
    initialBuckets.completedCount,
  );
  const [historySessions, setHistorySessions] = useState<StudentBookings[]>(
    initialBuckets.historySessions,
  );
  const [withoutReviewSessions, setWithoutReviewSessions] = useState<
    StudentBookings[]
  >(initialBuckets.withoutReviewSessions);

  const [reviewSheetOpen, setReviewSheetOpen] = useState(false);
  const [reviewSession, setReviewSession] = useState<StudentBookings | null>(
    null,
  );
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedBackSheetOpen, setFeedbackSheetOpen] = useState(false);

  const applySessionBuckets = useCallback((allSessions: StudentBookings[]) => {
    const buckets = getStudentSessionBuckets(allSessions);
    setTodaySessions(buckets.todaySessions);
    setUpcomingSessions(buckets.upcomingSessions);
    setCompletedCount(buckets.completedCount);
    setHistorySessions(buckets.historySessions);
    setWithoutReviewSessions(buckets.withoutReviewSessions);
  }, []);

  const loadSessions = useCallback(async () => {
    const response = await getMyBookings();

    if (response.error || !response?.data?.data?.data) {
      return;
    }

    applySessionBuckets(response.data.data.data as StudentBookings[]);
  }, [applySessionBuckets]);

  const hasPendingClassLink = useMemo(() => {
    return todaySessions.some(
      (session) =>
        session.status === BookingStatus.CONFIRMED && !session.classLink,
    );
  }, [todaySessions]);

  useEffect(() => {
    applySessionBuckets(initialSessions);
  }, [initialSessions, applySessionBuckets]);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  useEffect(() => {
    if (!hasPendingClassLink) {
      return;
    }

    const interval = setInterval(() => {
      loadSessions();
    }, POLL_INTERVAL);

    return () => clearInterval(interval);
  }, [hasPendingClassLink, loadSessions]);

  const openReviewSheet = (session: StudentBookings) => {
    setReviewSession(session);
    setRating(session.reviews?.rating ?? 0);
    setHoveredRating(0);
    setReviewText(session.reviews?.comment ?? "");
    setReviewSheetOpen(true);
  };

  const handleCancelSession = async (session: StudentBookings) => {
    const toastId = toast.loading("Cancelling session...");

    try {
      const response = await updateBookingStatus(
        session.id,
        BookingStatus.CANCELLED,
      );

      if (response.error || !response?.data?.success) {
        toast.error(response?.error?.message || "Failed to cancel session", {
          id: toastId,
        });
        return;
      }

      toast.success("Session cancelled successfully", { id: toastId });
      await loadSessions();
    } catch {
      toast.error("An error occurred while cancelling the session", {
        id: toastId,
      });
    }
  };

  const submitReview = async () => {
    if (!reviewSession || rating === 0 || !reviewText.trim()) {
      return;
    }

    const toastId = toast.loading("Review submitting...");

    try {
      const response = await createReview({
        bookingId: reviewSession.id,
        rating,
        comment: reviewText.trim(),
      });

      if (!response?.data?.success) {
        toast.error("Review failed!", { id: toastId });
        return;
      }

      toast.success("Review submitted.", { id: toastId });
      await loadSessions();
      setReviewSheetOpen(false);
    } catch {
      toast.error("Review failed!", { id: toastId });
    }
  };

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 p-4">
      <Card className="overflow-hidden border-border/60 bg-linear-to-r from-orange-50 via-white to-amber-50 dark:from-card dark:via-card dark:to-card">
        <CardHeader>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <CardTitle className="ui-title-panel">Student Sessions</CardTitle>
              <CardDescription className="mt-2">
                Review ongoing, upcoming, and previous booking sessions.
              </CardDescription>
            </div>
            <Badge
              variant="outline"
              className="bg-emerald-600 text-white hover:bg-emerald-600 font-normal"
            >
              {completedCount} Completed
            </Badge>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock3
                  className="size-4 text-brand"
                  suppressHydrationWarning
                />
                Today's Sessions
              </CardTitle>
              <CardDescription>
                Keep track of active and scheduled sessions today.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {todaySessions.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No session scheduled for today.
                </p>
              ) : (
                todaySessions.map((session, idx) => (
                  <SessionCard
                    key={session.id}
                    session={session}
                    role={UserRole.STUDENT}
                    animationIndex={idx}
                    openReviewSheet={() => openReviewSheet(session)}
                    handleCancelSession={() => handleCancelSession(session)}
                  />
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarClock
                  className="size-4 text-brand"
                  suppressHydrationWarning
                />
                Upcoming Sessions
              </CardTitle>
              <CardDescription>
                Future confirmed classes from your booking list.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingSessions.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No upcoming sessions.
                </p>
              ) : (
                upcomingSessions.map((session, idx) => (
                  <SessionCard
                    key={session.id}
                    session={session}
                    role={UserRole.STUDENT}
                    animationIndex={idx}
                    openReviewSheet={() => openReviewSheet(session)}
                    handleCancelSession={() => handleCancelSession(session)}
                  />
                ))
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <NotebookTabs
                  className="size-4 text-brand"
                  suppressHydrationWarning
                />
                Session History
              </CardTitle>
              <CardDescription>Recent completed sessions.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {historySessions.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No completed sessions yet.
                </p>
              ) : (
                historySessions
                  .slice(0, 2)
                  .map((session) => (
                    <HistorySessionItem
                      key={session.id}
                      session={session}
                      openReviewSheet={openReviewSheet}
                    />
                  ))
              )}
            </CardContent>

            <CardFooter>
              <Link href="/dashboard/history">
                <Button variant="outline" className="w-full font-normal">
                  <ArrowRight
                    className="mr-2 size-4"
                    suppressHydrationWarning
                  />
                  View all history
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="size-4 text-brand" suppressHydrationWarning />
                Feedback Reminder
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                You have {withoutReviewSessions.length} completed sessions
                without tutor feedback. Share a quick review to improve
                recommendations.
              </p>
              <Button
                className="mt-4 w-full bg-brand text-white hover:bg-brand-strong font-normal"
                disabled={withoutReviewSessions.length === 0}
                onClick={() => setFeedbackSheetOpen(true)}
              >
                Add Reviews
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <ReviewSessionSheet
        reviewSheetOpen={reviewSheetOpen}
        setReviewSheetOpen={setReviewSheetOpen}
        reviewSession={reviewSession}
        rating={rating}
        hoveredRating={hoveredRating}
        reviewText={reviewText}
        setRating={setRating}
        setHoveredRating={setHoveredRating}
        setReviewText={setReviewText}
        submitReview={submitReview}
      />

      <Sheet open={feedBackSheetOpen} onOpenChange={setFeedbackSheetOpen}>
        <SheetContent
          side="bottom"
          showCloseButton={false}
          className="inset-auto left-1/2 top-1/2 flex max-h-[80vh] w-[95%] max-w-2xl -translate-x-1/2 -translate-y-1/2 flex-col rounded-xl border"
        >
          <SheetHeader className="relative shrink-0 border-b bg-linear-to-r from-orange-50 via-orange-50 to-amber-50 px-6 py-5 text-left">
            <SheetClose className="absolute right-4 top-4 rounded-sm p-1 text-brand-ink opacity-90 transition-opacity hover:opacity-100 focus:outline-none">
              <X className="size-4" />
              <span className="sr-only">Close</span>
            </SheetClose>
            <SheetTitle className="flex items-center gap-2 text-xl text-brand-ink dark:text-brand-ink">
              <MessageSquare
                className="size-5 text-brand"
                suppressHydrationWarning
              />
              Add Reviews
            </SheetTitle>
            <SheetDescription className="text-[#6b4f3d] dark:text-[#6b4f3d]">
              Share feedback for your completed sessions to help us improve your
              learning experience.
            </SheetDescription>
          </SheetHeader>

          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 pb-6">
            {withoutReviewSessions.map((session) => (
              <HistorySessionItem
                key={session.id}
                session={session}
                openReviewSheet={() => openReviewSheet(session)}
              />
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
