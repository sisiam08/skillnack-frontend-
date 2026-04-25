"use client";

import { format } from "date-fns";
import { CheckCircle2, ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";

import { getAvailableSlots } from "@/action/availability.action";
import { createBooking } from "@/action/booking.action";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";
import { convertInto12h } from "@/helpers/TimeHelpers";
import { AvailableSlotType, SlotType } from "@/types";
import { redirect, useRouter } from "next/navigation";

const DURATION_OPTIONS = [60, 120, 180];

const getSlotMinutes = (time: string) => {
  const [hour, minute] = time.split(":").map(Number);
  return hour * 60 + minute;
};

const formatDuration = (minutes: number) => {
  const hours = minutes / 60;
  return `${hours} ${hours === 1 ? "hour" : "hours"}`;
};

type TutorBookingPanelProps = {
  tutorId: string;
  hourlyRate: number;
};

export default function TutorBookingPanel({
  tutorId,
  hourlyRate,
}: TutorBookingPanelProps) {
  const router = useRouter();
  const [availableSlots, setAvailableSlots] =
    useState<AvailableSlotType | null>(null);

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedDuration, setSelectedDuration] = useState("");
  const [selectedSlot, setSelectedSlot] = useState<SlotType | null>(null);
  const [needsNewSlotSelection, setNeedsNewSlotSelection] = useState(false);
  const [isBooking, setIsBooking] = useState(false);

  const today = format(new Date(), "yyyy-MM-dd");

  const groupedSlots = useMemo(() => {
    const slots = availableSlots?.availableSlots ?? [];

    return {
      morning: slots.filter((slot) => {
        const hour = getSlotMinutes(slot.startTime) / 60;
        return hour >= 6 && hour < 12;
      }),
      afternoon: slots.filter((slot) => {
        const hour = getSlotMinutes(slot.startTime) / 60;
        return hour >= 12 && hour < 18;
      }),
      evening: slots.filter((slot) => {
        const hour = getSlotMinutes(slot.startTime) / 60;
        return hour >= 18 && hour < 24;
      }),
    };
  }, [availableSlots]);

  const slotCount = availableSlots?.availableSlots.length ?? 0;

  const selectedSummary = useMemo(() => {
    if (!selectedDate || !selectedSlot || !selectedDuration) return null;

    return `Selected: ${format(new Date(selectedDate), "EEEE")}, ${convertInto12h(selectedSlot.startTime)} - ${convertInto12h(selectedSlot.endTime)} (${formatDuration(Number(selectedDuration))})`;
  }, [selectedDate, selectedDuration, selectedSlot]);

  const loadAvailableSlots = async (date: string, duration: string) => {
    if (!date || !duration) {
      setAvailableSlots(null);
      return;
    }

    const toastId = toast.loading("Checking available slots...");

    try {
      const response = await getAvailableSlots(
        tutorId,
        new Date(date),
        duration,
      );

      if (!response?.data?.success || !response?.data?.data) {
        toast.error(
          response?.error?.message || "Failed to load matching slots",
          {
            id: toastId,
          },
        );
        setAvailableSlots(null);
        return;
      }

      setAvailableSlots(response.data.data);
      toast.success("Slots updated", { id: toastId });
    } catch {
      setAvailableSlots(null);
      toast.error("Something went wrong while loading slots", {
        id: toastId,
      });
    }
  };

  const updateDate = (value: string) => {
    setSelectedDate(value);
    setSelectedSlot(null);
    setNeedsNewSlotSelection(Boolean(value && selectedDuration));

    if (value && selectedDuration) {
      void loadAvailableSlots(value, selectedDuration);
    } else {
      setAvailableSlots(null);
    }
  };

  const updateDuration = async (value: string) => {
    setSelectedDuration(value);
    setSelectedSlot(null);
    setNeedsNewSlotSelection(Boolean(selectedDate && value));

    void loadAvailableSlots(selectedDate, value);
  };

  const selectSlot = (slot: SlotType) => {
    setSelectedSlot(slot);
    setNeedsNewSlotSelection(false);
  };

  const bookingSession = async () => {
    if (!selectedSlot || !selectedDate) return;

    const now = new Date();
    const bookingData = {
      sessionDate: selectedDate,
      startTime: selectedSlot.startTime,
      endTime: selectedSlot.endTime,
      currentTime: format(now, "HH:mm"),
      todayDate: format(now, "yyyy-MM-dd"),
    };

    const toastId = toast.loading("Booking your session...");
    setIsBooking(true);

    try {
      const response = await createBooking(tutorId, bookingData);

      if (!response?.data || response?.error) {
        toast.error(response?.error?.message || "Failed to create booking", {
          id: toastId,
        });
        return;
      }

      console.log("Booking response: ", response);

      // redirect to payment page
      router.push(response.data.data.paymentUrl);

      if (!response.data.data.paymentUrl) {
        toast.error("Failed to initiate payment", {
          id: toastId,
        });
        return;
      }

      if (response.data.data.paymentUrl) {
        toast.success("Session booked successfully", { id: toastId });
      }
      setSelectedDate("");
      setSelectedDuration("");
      setSelectedSlot(null);
      setNeedsNewSlotSelection(false);
      setAvailableSlots(null);
    } catch {
      toast.error("An error occurred while booking the session", {
        id: toastId,
      });
    } finally {
      setIsBooking(false);
    }
  };

  const isBookingReady = Boolean(
    selectedDate && selectedDuration && selectedSlot,
  );

  return (
    <>
      <aside
        id="booking-panel"
        className="order-last lg:order-0 lg:sticky lg:top-24 lg:self-start"
      >
        <Card className="rounded-2xl border border-border/70 bg-card/90 shadow-sm">
          <CardHeader className="border-b border-border">
            <CardTitle className="text-foreground">Book This Tutor</CardTitle>
            <CardDescription className="text-muted-foreground">
              Follow the steps to confirm your session.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5 pt-5">
            <div className="rounded-xl border border-border bg-muted/30 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Hourly rate
                  </p>
                  <p className="mt-1 text-lg font-semibold text-foreground">
                    ৳{hourlyRate} / hour
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Estimated
                  </p>
                  <p className="mt-1 text-lg font-bold text-brand">
                    ৳{availableSlots?.price ?? 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Step 1: Select Date
              </p>
              <Input
                type="date"
                min={today}
                value={selectedDate}
                onChange={(event) => updateDate(event.target.value)}
                className="border-input bg-background text-foreground"
              />
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Step 2: Select Duration
              </p>
              <Select value={selectedDuration} onValueChange={updateDuration}>
                <SelectTrigger className="w-full border-input bg-background text-foreground">
                  <SelectValue placeholder="Choose duration" />
                </SelectTrigger>
                <SelectContent>
                  {DURATION_OPTIONS.map((duration) => (
                    <SelectItem key={duration} value={String(duration)}>
                      {formatDuration(duration)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3 rounded-xl border border-border bg-muted/30 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Step 3: Matching Availability
              </p>

              {selectedDuration ? (
                <p className="text-xs text-muted-foreground">
                  Showing {formatDuration(Number(selectedDuration))} sessions •{" "}
                  {slotCount} slots available
                </p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Choose date and duration to reveal available slots.
                </p>
              )}

              {needsNewSlotSelection ? (
                <p className="rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs text-amber-700 dark:text-amber-300">
                  Please select a new time slot.
                </p>
              ) : null}

              {selectedDate && selectedDuration ? (
                <div className="space-y-3">
                  {[
                    {
                      key: "morning",
                      label: "Morning",
                      emoji: "🌅",
                      slots: groupedSlots.morning,
                    },
                    {
                      key: "afternoon",
                      label: "Afternoon",
                      emoji: "🌇",
                      slots: groupedSlots.afternoon,
                    },
                    {
                      key: "evening",
                      label: "Evening",
                      emoji: "🌙",
                      slots: groupedSlots.evening,
                    },
                  ].map((group) => (
                    <div key={group.key} className="space-y-2">
                      <p className="text-xs font-medium text-muted-foreground">
                        {group.emoji} {group.label}
                      </p>

                      {group.slots.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {group.slots.map((slot) => {
                            const isSelected =
                              selectedSlot?.startTime === slot.startTime &&
                              selectedSlot?.endTime === slot.endTime;

                            return (
                              <button
                                key={`${group.key}-${slot.startTime}`}
                                type="button"
                                onClick={() => selectSlot(slot)}
                                className={`rounded-full border px-3 py-1 text-xs font-medium transition-all duration-200 ${
                                  isSelected
                                    ? "scale-105 border-brand bg-brand text-white"
                                    : "border-brand/40 bg-brand/10 text-brand hover:-translate-y-0.5 hover:border-brand"
                                }`}
                              >
                                {convertInto12h(slot.startTime)} -{" "}
                                {convertInto12h(slot.endTime)}
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-xs text-muted-foreground">
                          No slots
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : null}
            </div>

            {selectedSummary ? (
              <div className="rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground">
                {selectedSummary}
              </div>
            ) : null}
          </CardContent>

          <CardFooter className="flex flex-col items-stretch gap-2 border-t border-border pt-4">
            <Button
              disabled={!isBookingReady || isBooking}
              onClick={bookingSession}
              className="hidden h-11 w-full rounded-lg bg-brand text-white transition-all hover:scale-[1.02] hover:bg-brand-strong disabled:border disabled:border-border disabled:bg-muted disabled:text-muted-foreground lg:inline-flex"
            >
              {isBooking
                ? "Processing..."
                : isBookingReady
                  ? "Confirm Booking"
                  : "Select a time slot"}
            </Button>

            <div className="flex items-center justify-center gap-4 text-[11px] text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <ShieldCheck className="size-3.5" /> Secure payment
              </span>
              <span className="inline-flex items-center gap-1">
                <CheckCircle2 className="size-3.5" /> Instant confirmation
              </span>
            </div>
          </CardFooter>
        </Card>
      </aside>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 px-4 py-3 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-7xl items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs text-muted-foreground">
              {selectedSummary ||
                "Select date, duration, and a slot to continue"}
            </p>
          </div>
          <Button
            disabled={!isBookingReady || isBooking}
            onClick={bookingSession}
            className="h-10 shrink-0 rounded-lg bg-brand px-4 text-white hover:bg-brand-strong disabled:border disabled:border-border disabled:bg-muted disabled:text-muted-foreground"
          >
            {isBookingReady ? "Confirm Booking" : "Select Slot"}
          </Button>
        </div>
      </div>
    </>
  );
}
