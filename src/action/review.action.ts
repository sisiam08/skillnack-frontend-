"use server";

import { ReviewService } from "@/service/review.service";
import { ReviewType } from "@/types";

export const createReview = async (reviewData: ReviewType) => {
  const { data, error } = await ReviewService.createReview(reviewData);

  return { data, error };
};