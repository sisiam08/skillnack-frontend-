"use server";

import { BookingService } from "@/service/booking.service";
import { BookingsFilters, BookingSlot, ServiceOptions } from "@/types";

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

export const getAllBookings = async (
  filters?: BookingsFilters,
  options?: ServiceOptions,
) => {
  const { data, error } = await BookingService.getAllBookings(filters, options);
  return { data, error };
};

export const updateBookingStatus = async (
  bookingId: string,
  status: string,
) => {
  const { data, error } = await BookingService.updateBookingStatus(
    bookingId,
    status,
  );
  return { data, error };
};

export const getMyBookings = async (
  filters?: BookingsFilters,
  options?: ServiceOptions,
) => {
  const { data, error } = await BookingService.getMyBookings(filters, options);
  return { data, error };
};
