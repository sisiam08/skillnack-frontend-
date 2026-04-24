"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { convertInto12h } from "@/helpers/TimeHelpers";
import { TutorBookingSession } from "@/types";
import { format } from "date-fns";

type CompleteSessionSheetProps = {
  completeSessionSheetOpen: boolean;
  setCompleteSessionSheetOpen: (open: boolean) => void;
  completedSession: TutorBookingSession | null;
  dismissCompleteSessionSheet: () => void;
  confirmCompletedSession: () => void;
};

export default function CompleteSessionSheet({
  completeSessionSheetOpen,
  setCompleteSessionSheetOpen,
  completedSession,
  dismissCompleteSessionSheet,
  confirmCompletedSession,
}: CompleteSessionSheetProps) {
  return (
    <Sheet
      open={completeSessionSheetOpen}
      onOpenChange={setCompleteSessionSheetOpen}
    >
      <SheetContent
        side="bottom"
        className="inset-auto left-1/2 top-1/2 w-[95%] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-xl border"
      >
        <SheetHeader>
          <SheetTitle>Session Ended - Mark as Completed</SheetTitle>
        </SheetHeader>

        {completedSession && (
          <div className="space-y-4 px-4 pb-6">
            <p className="text-sm text-muted-foreground">
              The following session has ended. Please mark it as completed.
            </p>

            <div className="rounded-md border bg-muted/30 p-4 space-y-2">
              <div className="flex items-center gap-3">
                <div>
                  <p className="font-semibold">
                    {completedSession.student.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {completedSession.student.email}
                  </p>
                </div>
              </div>
              <div className="text-sm text-muted-foreground space-y-1 pt-1">
                <p>
                  <span className="font-medium text-foreground">Time: </span>
                  {convertInto12h(completedSession.startTime)} -{" "}
                  {convertInto12h(completedSession.endTime)}
                </p>
                <p>
                  <span className="font-medium text-foreground">Date: </span>
                  {format(
                    new Date(completedSession.sessionDate),
                    "MMM dd, yyyy",
                  )}
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={dismissCompleteSessionSheet}>
                Dismiss
              </Button>
              <Button
                className="bg-emerald-600 text-white hover:bg-emerald-700"
                onClick={confirmCompletedSession}
              >
                Mark as Completed
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
