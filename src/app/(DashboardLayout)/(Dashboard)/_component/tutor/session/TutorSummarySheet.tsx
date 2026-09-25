"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/sonner";
import { updateBookingSummary } from "@/action/booking.action";
import { TutorBookingSession } from "@/types";
import { NotebookPen } from "lucide-react";

const EDIT_WINDOW_MS = 24 * 60 * 60 * 1000;

type TutorSummarySheetProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  session: TutorBookingSession | null;
  onSaved?: () => void;
};

export default function TutorSummarySheet({
  open,
  setOpen,
  session,
  onSaved,
}: TutorSummarySheetProps) {
  const [summary, setSummary] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setSummary(session?.summary ?? "");
    }
  }, [open, session]);

  const hasSummary = Boolean(session?.summary);
  const isLocked = Boolean(
    session?.summaryAt &&
      Date.now() - new Date(session.summaryAt).getTime() > EDIT_WINDOW_MS,
  );

  const submit = async () => {
    if (!session || !summary.trim()) return;

    setSaving(true);
    const toastId = toast.loading("Saving summary...");

    try {
      const response = await updateBookingSummary(session.id, summary.trim());

      if (response.error || !response.data) {
        toast.error(response.error?.message || "Failed to save summary", {
          id: toastId,
        });
        return;
      }

      toast.success("Summary saved. The student can see it now.", {
        id: toastId,
      });
      onSaved?.();
      setOpen(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-xl p-0 gap-0"
        showCloseButton={false}
      >
        <SheetHeader className="border-b bg-linear-to-r from-orange-50 via-white to-amber-50 px-6 py-5 text-left">
          <SheetTitle className="flex items-center gap-2 text-xl text-brand-ink dark:text-brand-ink">
            <NotebookPen className="size-5 text-brand" />
            Session summary
          </SheetTitle>
          <SheetDescription className="text-[#6b4f3d]">
            Give the student something to keep: what you covered, the solution,
            and any next steps. Optional, but strongly encouraged.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 space-y-3 overflow-y-auto px-6 py-5">
          {session ? (
            <p className="text-sm text-muted-foreground">
              {session.student?.name} •{" "}
              {format(new Date(session.sessionDate), "MMM dd, yyyy")}
            </p>
          ) : null}

          {isLocked ? (
            <>
              <div className="whitespace-pre-wrap rounded-md border bg-muted/30 p-3 text-sm">
                {session?.summary || "No summary was provided."}
              </div>
              <p className="text-xs text-muted-foreground">
                The 24-hour editing window has passed. This summary is now
                read-only.
              </p>
            </>
          ) : (
            <>
              <Textarea
                rows={8}
                maxLength={2000}
                value={summary}
                onChange={(event) => setSummary(event.target.value)}
                placeholder="What was the problem/topic? What was the solution or what did you teach? Recommended next steps or resources?"
              />
              <p className="text-right text-[11px] text-muted-foreground">
                {summary.length}/2000
              </p>
            </>
          )}
        </div>

        <SheetFooter className="border-t bg-background px-6 py-5 sm:flex-row sm:justify-end">
          {isLocked ? (
            <Button variant="outline" onClick={() => setOpen(false)}>
              Close
            </Button>
          ) : (
            <>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Later
              </Button>
              <Button
                className="bg-brand text-white hover:bg-brand-strong"
                disabled={saving || !summary.trim()}
                onClick={submit}
              >
                {hasSummary ? "Update summary" : "Save summary"}
              </Button>
            </>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
