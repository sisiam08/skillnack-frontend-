"use server";

import { AvailabilityService } from "@/service/availability.service";
import { AvailabilityType } from "@/types";

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

export const setAvailability = async (availability: AvailabilityType) => {
  const { data, error } =
    await AvailabilityService.setAvailability(availability);

  return { data, error };
};

export const updateAvailability = async (
  id: string,
  availability: Partial<AvailabilityType>,
) => {
  const { data, error } = await AvailabilityService.updateAvailability(
    id,
    availability,
  );

  return { data, error };
};

export const deleteAvailability = async (id: string) => {
  const { data, error } = await AvailabilityService.deleteAvailability(id);

  return { data, error };
};
