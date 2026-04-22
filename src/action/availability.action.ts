"use server";

import { AvailabilityService } from "@/service/availability.service";

export const getAvailableSlots = async (
  tutorId: string,
  selectedDate: Date,
  slotDuration: string,
) => {
  const { data, error } = await AvailabilityService.getAvailableSlots(
    tutorId,
    selectedDate,
    slotDuration,
  );

  return { data, error };
};
