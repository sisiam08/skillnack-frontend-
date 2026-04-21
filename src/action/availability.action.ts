"use server";

import { AvailabilityService } from "@/service/availability.service";

export const getAvailability = async (tutorId: string) => {
  const { data, error } = await AvailabilityService.getAvailability(tutorId);

  return { data, error };
};

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
