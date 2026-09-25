import { BookingStatus } from "@/constants/status";
import { env } from "@/env";
import { BookingsFilters, ServiceOptions, SessionOutcome } from "@/types";
import { cookies } from "next/headers";

const API_URL = env.API_URL;
export const BOOKING_REVALIDATE = 20;

export const BookingService = {
  createBooking: async (formData: FormData) => {
    try {
      const cookieStore = await cookies();
      const res = await fetch(`${API_URL}/bookings`, {
        method: "POST",
        headers: {
          Cookie: cookieStore.toString(),
        },
        body: formData,
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

  getAllBookings: async (
    filters?: BookingsFilters,
    options?: ServiceOptions,
  ) => {
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

      const config: RequestInit = {
        headers: {
          cookie: cookieStore.toString(),
        },
      };

      if (options?.cache) {
        config.cache = options.cache;
      }

      if (options?.revalidate) {
        config.next = { ...config.next, revalidate: options.revalidate };
      }

      config.next = { ...config.next, tags: ["bookings"] };

      const res = await fetch(url.toString(), config);

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

  updateBookingStatus: async (bookingId: string, status: string) => {
    try {
      const cookieStore = await cookies();
      const res = await fetch(`${API_URL}/bookings/${bookingId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieStore.toString(),
        },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();

      if (!res.ok || !data?.success) {
        return {
          data: null,
          error: {
            message: data?.message || "Failed to update booking status!",
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

  getMyBookings: async (
    filters?: BookingsFilters,
    options?: ServiceOptions,
  ) => {
    try {
      const cookieStore = await cookies();
      const url = new URL(`${API_URL}/bookings/my-bookings`);

      if (filters) {
        Object.entries(filters as BookingsFilters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            url.searchParams.append(key, value);
          }
        });
      }

      const config: RequestInit = {
        headers: {
          cookie: cookieStore.toString(),
        },
      };

      if (options?.cache) {
        config.cache = options.cache;
      }

      if (options?.revalidate) {
        config.next = { ...config.next, revalidate: options.revalidate };
      }

      config.next = { ...config.next, tags: ["my-bookings"] };

      const res = await fetch(url.toString(), config);

      const data = await res.json();

      if (!res.ok || !data?.success) {
        return {
          data: null,
          error: { message: data?.message || "Failed to get my bookings!" },
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

  updateBookingSummary: async (bookingId: string, summary: string) => {
    try {
      const cookieStore = await cookies();
      const res = await fetch(`${API_URL}/bookings/${bookingId}/summary`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieStore.toString(),
        },
        body: JSON.stringify({ summary }),
      });

      const data = await res.json();

      if (!res.ok || !data?.success) {
        return {
          data: null,
          error: { message: data?.message || "Failed to save summary!" },
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

  getBookingRequestInfo: async (bookingId: string) => {
    try {
      const cookieStore = await cookies();
      const cookieHeader = cookieStore.toString();

      const detailRes = await fetch(`${API_URL}/bookings/${bookingId}`, {
        headers: { Cookie: cookieHeader },
        cache: "no-store",
      });

      if (detailRes.ok) {
        const data = await detailRes.json();
        if (data?.success) {
          return {
            data: {
              title: data.data?.title ?? null,
              description: data.data?.description ?? null,
              attachments: (data.data?.attachments ?? []) as string[],
            },
            error: null,
          };
        }
      }

      // Tutors cannot read /bookings/:id; fall back to their own session list.
      const listRes = await fetch(
        `${API_URL}/tutors/bookings?page=1&limit=100`,
        {
          headers: { Cookie: cookieHeader },
          cache: "no-store",
        },
      );
      const listData = await listRes.json();
      const found = listData?.data?.data?.data?.find(
        (booking: { id: string }) => booking.id === bookingId,
      );

      if (!found) {
        return { data: null, error: { message: "Booking not found" } };
      }

      return {
        data: {
          title: found.title ?? null,
          description: found.description ?? null,
          attachments: (found.attachments ?? []) as string[],
        },
        error: null,
      };
    } catch (error: any) {
      return {
        data: null,
        error: { message: error.message || "Something went wrong!" },
      };
    }
  },

  recordOutcome: async (bookingId: string, outcome: SessionOutcome) => {
    try {
      const cookieStore = await cookies();
      const res = await fetch(`${API_URL}/bookings/${bookingId}/outcome`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieStore.toString(),
        },
        body: JSON.stringify({ outcome }),
      });

      const data = await res.json();

      if (!res.ok || !data?.success) {
        return {
          data: null,
          error: {
            message: data?.message || "Failed to record outcome!",
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

  getBookingSessions: async (filters?: BookingsFilters) => {
    try {
      const cookieStore = await cookies();
      const url = new URL(`${API_URL}/tutors/bookings`);

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

      // console.log(data);

      if (!res.ok || !data?.success) {
        return {
          data: null,
          error: {
            message: data?.message || "Failed to get booking sessions!",
          },
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
