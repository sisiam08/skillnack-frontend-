import { env } from "@/env";
import { cookies } from "next/headers";

const API_URL = env.API_URL;

export const ReviewService = {
  getAllReviewsForTutorProfile: async (tutorId: string) => {
    try {
      const cookieStore = await cookies();

      const res = await fetch(`${API_URL}/reviews/tutor/${tutorId}`, {
        headers: {
          Cookie: cookieStore.toString(),
        },
      });
      const data = await res.json();

      if (!res.ok || !data?.success) {
        return {
          data: null,
          error: {
            message:
              data?.message || "Failed to get reviews for tutor profile!",
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
};
