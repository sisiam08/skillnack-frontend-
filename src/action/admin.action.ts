"use server";

import { AdminService } from "@/service/admin.service";
import { UsersFilter } from "@/types";

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


export const getAdminDashboardStats = async () => {
  const { data, error } = await AdminService.getAdminDashboardStats();
  return { data, error };
};