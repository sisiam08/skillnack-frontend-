"use server";

import { BookingService } from "@/service/booking.service";
import { BookingsFilters, ServiceOptions, SessionOutcome } from "@/types";

export const createBooking = async (formData: FormData) => {
  const { data, error } = await BookingService.createBooking(formData);

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

export const getBookingSessions = async (filters?: BookingsFilters) => {
  const { data, error } = await BookingService.getBookingSessions(filters);

  return { data, error };
};

export const updateBookingSummary = async (
  bookingId: string,
  summary: string,
) => {
  const { data, error } = await BookingService.updateBookingSummary(
    bookingId,
    summary,
  );

  return { data, error };
};

export const recordOutcome = async (
  bookingId: string,
  outcome: SessionOutcome,
) => {
  const { data, error } = await BookingService.recordOutcome(
    bookingId,
    outcome,
  );

  return { data, error };
};