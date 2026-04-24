"use server";

import { TutorService } from "@/service/tutor.service";
import { Filters, ServiceOptions, TutorProfileCreateData } from "@/types";

export const getAllTutors = async (
  params?: Filters,
  options?: ServiceOptions,
) => {
  const { data, error } = await TutorService.getAllTutors(params, options);

  return { data, error };
};

export const createTutorProfile = async (tutorData: TutorProfileCreateData) => {
  const { data, error } = await TutorService.createTutorProfile(tutorData);
  return { data, error };
};

export const updateTutorProfile = async (tutorData: TutorProfileCreateData) => {
  const { data, error } = await TutorService.updateTutorProfile(tutorData);
  return { data, error };
};

export const getTutorProfile = async () => {
  const { data, error } = await TutorService.getTutorProfile();
  return { data, error };
};

export const setDefaultClassLink = async (defaultClassLink: string) => {
  const { data, error } =
    await TutorService.setDefaultClassLink(defaultClassLink);
  return { data, error };
};

export const getDefaultClassLink = async () => {
  const { data, error } = await TutorService.getDefaultClassLink();
  return { data, error };
};

export const sendClassLink = async (bookingId: string, classLink: string) => {
  const { data, error } = await TutorService.sendClassLink(
    bookingId,
    classLink,
  );
  return { data, error };
};

export const getTutorStats = async () => {
  const { data, error } = await TutorService.getTutorStats();
  return { data, error };
};

export const getWeeklyEarnings = async () => {
  const { data, error } = await TutorService.getWeeklyEarnings();
  return { data, error };
};
