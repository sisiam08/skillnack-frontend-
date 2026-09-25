"use server";

import { AdminService } from "@/service/admin.service";
import { TutorsFilter, UsersFilter } from "@/types";

export const getAllUsers = async (params?: UsersFilter) => {
  const { data, error } = await AdminService.getAllUsers(params);
  return { data, error };
};

export const updateUserStatus = async (userId: string, newStatus: string) => {
  const { data, error } = await AdminService.updateUserStatus(
    userId,
    newStatus,
  );
  return { data, error };
};

export const getTutors = async (params?: TutorsFilter) => {
  const { data, error } = await AdminService.getTutors(params);
  return { data, error };
};

export const updateTutorVerification = async (
  tutorId: string,
  status: string,
  rejectionReason?: string,
) => {
  const { data, error } = await AdminService.updateTutorVerification(
    tutorId,
    status,
    rejectionReason,
  );
  return { data, error };
};
