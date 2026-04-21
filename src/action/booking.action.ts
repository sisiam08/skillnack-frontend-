"use server";

import { BookingService } from "@/service/booking.service";
import { BookingSlot } from "@/types";


export const createBooking = async (
  tutorId: string,
  bookingData: BookingSlot,
) => {
  const { data, error } = await BookingService.createBooking(
    tutorId,
    bookingData,
  );

  return { data, error };
};