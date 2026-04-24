"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookingStatus } from "@/constants/status";
import { convertInto12h } from "@/helpers/TimeHelpers";
import { StudentBookings } from "@/types";
import { format } from "date-fns";
import { MessageSquare } from "lucide-react";

type HistorySessionItemProps = {
  session: StudentBookings;
  openReviewSheet: (session: StudentBookings) => void;
};

const hasReview = (session: StudentBookings) => Boolean(session.reviews);

export default function HistorySessionItem({
  session,
  openReviewSheet,
}: HistorySessionItemProps) {
  return (
    <div className="rounded-xl border bg-muted/20 p-3 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-medium text-sm">{session.tutor.user.name}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {session.tutor.category.name}
          </p>
        </div>
        <Badge
          className={
            session.status === BookingStatus.COMPLETED
              ? "bg-emerald-600 text-white hover:bg-emerald-600 font-normal"
              : "bg-red-500 text-white hover:bg-red-500 font-normal"
          }
        >
          {session.status}
        </Badge>
      </div>

      <div className="text-xs text-muted-foreground space-y-1">
        <p>{format(new Date(session.sessionDate), "MMM dd, yyyy")}</p>
        <p>
          {convertInto12h(session.startTime)} -{" "}
          {convertInto12h(session.endTime)}
        </p>
      </div>

      <Button
        variant="outline"
        size="sm"
        className="w-full border-brand/30 text-brand hover:bg-brand/5 hover:text-brand-strong font-normal"
        onClick={() => openReviewSheet(session)}
      >
        <MessageSquare className="mr-2 size-4" />
        {hasReview(session) ? "See Review" : "Review Session"}
      </Button>
    </div>
  );
}
