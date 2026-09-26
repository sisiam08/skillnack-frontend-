import { env } from "@/env";
import { ReviewType } from "@/types";
import { cookies } from "next/headers";

const API_URL = env.API_URL;

export const ReviewService = {
  getAllReviewsForTutorProfile: async (tutorId: string) => {
    try {
      // Public endpoint: no auth needed, so no cookies -> cacheable (ISR).
      const res = await fetch(`${API_URL}/reviews/tutor/${tutorId}`);
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

  createReview: async (reviewData: ReviewType) => {
    try {
      const cookieStore = await cookies();

      const res = await fetch(`${API_URL}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieStore.toString(),
        },
        body: JSON.stringify(reviewData),
      });
      const data = await res.json();

      if (!res.ok || !data?.success) {
        return {
          data: null,
          error: { message: data?.message || "Failed to create review!" },
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
