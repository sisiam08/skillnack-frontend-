"use server";

import { TutorService } from "@/service/tutor.service";
import { Filters, ServiceOptions } from "@/types";

export const getAllTutors = async (
  params?: Filters,
  options?: ServiceOptions,
) => {
  const { data, error } = await TutorService.getAllTutors(params, options);

  return { data, error };
};

