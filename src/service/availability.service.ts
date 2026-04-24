import { env } from "@/env";
import { AvailabilityType } from "@/types";
import { cookies } from "next/headers";

const API_URL = env.API_URL;

export const AvailabilityService = {
  getAvailability: async (tutorId: string) => {
    try {
      const cookieStore = await cookies();
      const res = await fetch(`${API_URL}/tutors/${tutorId}/availability`, {
        headers: {
          Cookie: cookieStore.toString(),
        },
      });

      const data = await res.json();

      if (!res.ok || !data?.success) {
        return {
          data: null,
          error: { message: data?.message || "Failed to get availability!" },
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

  getAvailableSlots: async (
    tutorId: string,
    selectedDate: Date,
    slotDuration: string,
  ) => {
    try {
      const cookieStore = await cookies();
      const res = await fetch(
        `${API_URL}/tutors/${tutorId}/availableSlots/?selectedDate=${selectedDate}&slotDuration=${slotDuration}`,
        {
          headers: {
            Cookie: cookieStore.toString(),
          },
        },
      );
      const data = await res.json();

      if (!res.ok || !data?.success) {
        return {
          data: null,
          error: { message: data?.message || "Failed to get available slots!" },
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

  setAvailability: async (availability: AvailabilityType) => {
    try {
      const cookieStore = await cookies();
      const res = await fetch(`${API_URL}/tutors/availability`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieStore.toString(),
        },
        body: JSON.stringify(availability),
      });

      const data = await res.json();

      if (!res.ok || !data?.success) {
        return {
          data: null,
          error: { message: data?.message || "Failed to set availability!" },
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

  updateAvailability: async (
    id: string,
    availability: Partial<AvailabilityType>,
  ) => {
    try {
      const cookieStore = await cookies();
      const res = await fetch(`${API_URL}/tutors/availability/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieStore.toString(),
        },
        body: JSON.stringify(availability),
      });

      const data = await res.json();

      if (!res.ok || !data?.success) {
        return {
          data: null,
          error: { message: data?.message || "Failed to update availability!" },
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

  deleteAvailability: async (id: string) => {
    try {
      const cookieStore = await cookies();
      const res = await fetch(`${API_URL}/tutors/availability/${id}`, {
        method: "DELETE",
        headers: { Cookie: cookieStore.toString() },
      });

      const data = await res.json();

      if (!res.ok || !data?.success) {
        return {
          data: null,
          error: { message: data?.message || "Failed to delete availability!" },
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
