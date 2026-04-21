"use server";

import { ReviewService } from "@/service/review.service";

export const getAllReviewsForTutorProfile = async (tutorId: string) => {
  const { data, error } =
    await ReviewService.getAllReviewsForTutorProfile(tutorId);
  return { data, error };
};
