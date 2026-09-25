"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { recordOutcome } from "@/action/booking.action";
import { SessionOutcome } from "@/types";
import {
  CircleCheckBig,
  CircleDashed,
  CircleX,
  Loader2,
} from "lucide-react";

type SessionOutcomeControlProps = {
  bookingId: string;
  outcome?: SessionOutcome | null;
  onRecorded?: () => void;
  className?: string;
};

const OUTCOME_META: Record<
  SessionOutcome,
  { label: string; className: string; icon: typeof CircleCheckBig }
> = {
  SOLVED: {
    label: "Solved",
    className: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100",
    icon: CircleCheckBig,
  },
  PARTIALLY_SOLVED: {
    label: "Partially solved",
    className: "bg-amber-100 text-amber-700 hover:bg-amber-100",
    icon: CircleDashed,
  },
  NOT_SOLVED: {
    label: "Not solved",
    className: "bg-red-100 text-red-700 hover:bg-red-100",
    icon: CircleX,
  },
};

const OPTIONS: SessionOutcome[] = ["SOLVED", "PARTIALLY_SOLVED", "NOT_SOLVED"];

export default function SessionOutcomeControl({
  bookingId,
  outcome,
  onRecorded,
  className,
}: SessionOutcomeControlProps) {
  const [current, setCurrent] = useState<SessionOutcome | null>(
    outcome ?? null,
  );
  const [saving, setSaving] = useState<SessionOutcome | null>(null);

  const submit = async (value: SessionOutcome) => {
    if (saving || current) return;

    setSaving(value);
    const toastId = toast.loading("Saving outcome...");

    try {
      const response = await recordOutcome(bookingId, value);

      if (response.error || !response.data?.success) {
        toast.error(response.error?.message || "Failed to save outcome", {
          id: toastId,
        });
        return;
      }

      setCurrent(value);
      toast.success("Thanks! Your feedback was recorded.", { id: toastId });
      onRecorded?.();
    } finally {
      setSaving(null);
    }
  };

  if (current) {
    const meta = OUTCOME_META[current];
    const Icon = meta.icon;
    return (
      <Badge className={className ? `${meta.className} ${className}` : meta.className}>
        <Icon className="mr-1 h-3 w-3" />
        {meta.label}
      </Badge>
    );
  }

  return (
    <div className={className}>
      <p className="text-xs font-medium text-muted-foreground">
        Was your problem solved?
      </p>
      <div className="mt-1 flex flex-wrap gap-2">
        {OPTIONS.map((value) => {
          const meta = OUTCOME_META[value];
          const Icon = meta.icon;
          return (
            <Button
              key={value}
              type="button"
              variant="outline"
              size="sm"
              disabled={Boolean(saving)}
              className="h-7 px-2 text-xs font-normal"
              onClick={() => submit(value)}
            >
              {saving === value ? (
                <Loader2 className="mr-1 h-3 w-3 animate-spin" />
              ) : (
                <Icon className="mr-1 h-3 w-3" />
              )}
              {meta.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
