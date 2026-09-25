"use client";

import { format } from "date-fns";
import { CheckCircle2, Paperclip, ShieldCheck, X } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";
import { convertInto12h } from "@/helpers/TimeHelpers";
import { AvailableSlotType, BookingGoalType, SlotType } from "@/types";
import { useRouter } from "next/navigation";

const DURATION_OPTIONS = [30, 60, 120, 180];
const MAX_ATTACHMENTS = 5;
const MAX_TITLE_LENGTH = 100;
const MAX_DESCRIPTION_LENGTH = 1000;
const ATTACHMENT_ACCEPT =
  "image/*,.pdf,.txt,.doc,.docx,.ppt,.pptx,text/*,application/pdf";

const getSlotMinutes = (time: string) => {
  const [hour, minute] = time.split(":").map(Number);
  return hour * 60 + minute;
};

const formatDuration = (minutes: number) => {
  if (minutes < 60) {
    return `${minutes} minutes`;
  }
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

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [goalType, setGoalType] = useState<BookingGoalType | "">("");
  const [attachments, setAttachments] = useState<File[]>([]);

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

  const handleAttachmentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(event.target.files ?? []);
    event.target.value = "";

    if (selected.length === 0) return;

    setAttachments((prev) => {
      const merged = [...prev];

      for (const file of selected) {
        if (merged.length >= MAX_ATTACHMENTS) {
          toast.error(`You can attach up to ${MAX_ATTACHMENTS} files.`);
          break;
        }

        const isDuplicate = merged.some(
          (existing) =>
            existing.name === file.name && existing.size === file.size,
        );

        if (!isDuplicate) {
          merged.push(file);
        }
      }

      return merged;
    });
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const bookingSession = async () => {
    if (!selectedSlot || !selectedDate) return;

    if (!title.trim() || !description.trim()) {
      toast.error("Please add a title and description before booking.");
      return;
    }

    const now = new Date();
    const formData = new FormData();
    formData.append("tutorId", tutorId);
    formData.append("sessionDate", selectedDate);
    formData.append("startTime", selectedSlot.startTime);
    formData.append("endTime", selectedSlot.endTime);
    formData.append("title", title.trim());
    formData.append("description", description.trim());
    if (goalType) formData.append("goalType", goalType);
    formData.append("currentTime", format(now, "HH:mm"));
    formData.append("todayDate", format(now, "yyyy-MM-dd"));
    attachments.forEach((file) => formData.append("attachments", file));

    const toastId = toast.loading("Booking your session...");
    setIsBooking(true);

    try {
      const response = await createBooking(formData);

      if (!response?.data || response?.error) {
        toast.error(response?.error?.message || "Failed to create booking", {
          id: toastId,
        });
        return;
      }

      const paymentUrl = response.data.data?.paymentUrl;

      if (!paymentUrl) {
        toast.error("Failed to initiate payment", {
          id: toastId,
        });
        return;
      }

      toast.success("Session booked successfully", { id: toastId });
      router.push(paymentUrl);

      setSelectedDate("");
      setSelectedDuration("");
      setSelectedSlot(null);
      setNeedsNewSlotSelection(false);
      setAvailableSlots(null);
      setTitle("");
      setDescription("");
      setGoalType("");
      setAttachments([]);
    } catch {
      toast.error("An error occurred while booking the session", {
        id: toastId,
      });
    } finally {
      setIsBooking(false);
    }
  };

  const isBookingReady = Boolean(
    selectedDate &&
      selectedDuration &&
      selectedSlot &&
      title.trim() &&
      description.trim(),
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

            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Step 1: What do you need help with?
              </p>

              <div className="space-y-1">
                <Input
                  value={title}
                  maxLength={MAX_TITLE_LENGTH}
                  placeholder="Short title (e.g. Help with binary trees)"
                  onChange={(event) => setTitle(event.target.value)}
                  className="border-input bg-background text-foreground"
                />
                <p className="text-right text-[11px] text-muted-foreground">
                  {title.length}/{MAX_TITLE_LENGTH}
                </p>
              </div>

              <ToggleGroup
                type="single"
                value={goalType}
                onValueChange={(value) =>
                  setGoalType((value as BookingGoalType) || "")
                }
                className="flex w-full rounded-xl border border-input bg-background p-1"
              >
                <ToggleGroupItem
                  value="SOLVE_PROBLEM"
                  className="flex-1 rounded-lg text-xs font-semibold data-[state=on]:bg-brand data-[state=on]:text-white"
                >
                  Solve a problem
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="LEARN_TOPIC"
                  className="flex-1 rounded-lg text-xs font-semibold data-[state=on]:bg-brand data-[state=on]:text-white"
                >
                  Learn a topic
                </ToggleGroupItem>
              </ToggleGroup>

              <div className="space-y-1">
                <Textarea
                  value={description}
                  maxLength={MAX_DESCRIPTION_LENGTH}
                  rows={4}
                  placeholder="Describe the problem or topic so your tutor can prepare before the session..."
                  onChange={(event) => setDescription(event.target.value)}
                  className="border-input bg-background text-foreground"
                />
                <p className="text-right text-[11px] text-muted-foreground">
                  {description.length}/{MAX_DESCRIPTION_LENGTH}
                </p>
              </div>

              <div className="space-y-2">
                <label className="flex cursor-pointer items-center justify-between rounded-lg border border-dashed border-border px-3 py-2 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-2">
                    <Paperclip className="size-3.5" />
                    Attach files (optional)
                  </span>
                  <span className="font-medium text-brand">
                    {attachments.length}/{MAX_ATTACHMENTS}
                  </span>
                  <input
                    type="file"
                    multiple
                    accept={ATTACHMENT_ACCEPT}
                    className="hidden"
                    onChange={handleAttachmentChange}
                    disabled={attachments.length >= MAX_ATTACHMENTS}
                  />
                </label>

                {attachments.length > 0 ? (
                  <ul className="space-y-1">
                    {attachments.map((file, index) => (
                      <li
                        key={`${file.name}-${file.size}`}
                        className="flex items-center justify-between gap-2 rounded-md border bg-muted/30 px-2 py-1 text-xs"
                      >
                        <span className="truncate">{file.name}</span>
                        <button
                          type="button"
                          aria-label={`Remove ${file.name}`}
                          onClick={() => removeAttachment(index)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <X className="size-3.5" />
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Step 2: Select Date
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
                Step 3: Select Duration
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
                Step 4: Matching Availability
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
                  : "Add details & slot"}
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
