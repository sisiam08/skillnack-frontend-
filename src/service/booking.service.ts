import { BookingStatus } from "@/constants/status";
import { env } from "@/env";
import { BookingsFilters, BookingSlot } from "@/types";
import { create } from "domain";
import { cookies } from "next/headers";

const API_URL = env.API_URL;

export const BookingService = {
  createBooking: async (tutorId: string, bookingData: BookingSlot) => {
    try {
      const cookieStore = await cookies();
      const res = await fetch(`${API_URL}/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieStore.toString(),
        },
        body: JSON.stringify({ tutorId, ...bookingData }),
      });
      const data = await res.json();


      if (!res.ok || !data?.success) {
        return {
          data: null,
          error: { message: data?.message == "Unauthorized" ? "Please login as a student to confirm booking." : data?.message || "Failed to create booking!" },
        };
      }

      return { data, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: { message: error.message || "Something went wrong!" },
      };
    }
  },
};
