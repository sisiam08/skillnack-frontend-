import { BookingStatus } from "@/constants/status";
import { env } from "@/env";
import { BookingsFilters, BookingSlot } from "@/types";
import { create } from "domain";
import { cookies } from "next/headers";

const API_URL = env.API_URL;

export const BookingService = {
  createBooking: async (tutorId: string, bookingData: BookingSlot) => {
    console.log();
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
          error: {
            message:
              data?.message == "Unauthorized"
                ? "Please login as a student to confirm booking."
                : data?.message || "Failed to create booking!",
          },
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

  getAllBookings: async (filters?: BookingsFilters) => {
    try {
      const cookieStore = await cookies();
      const url = new URL(`${API_URL}/bookings`);

      if (filters) {
        Object.entries(filters as BookingsFilters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            url.searchParams.append(key, value);
          }
        });
      }

      const res = await fetch(url.toString(), {
        headers: {
          cookie: cookieStore.toString(),
        },
      });

      const data = await res.json();

      if (!res.ok || !data?.success) {
        return {
          data: null,
          error: { message: data?.message || "Failed to get all bookings!" },
        };
      }

      return {
        data,
        error: null,
      };
    } catch (error: any) {
      return {
        data: null,
        error: { message: error.message || "Something went wrong!" },
      };
    }
  },
};
