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

export const getTutorById = async (id: string) => {
  const { data, error } = await TutorService.getTutorById(id);
  return { data, error };
};
