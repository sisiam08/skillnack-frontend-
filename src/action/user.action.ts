"use server";

import { UserService } from "@/service/user.service";
import { UserUpdate } from "@/types";

export const updateUser = async (
  userData: UserUpdate,
  imageFile?: File | null,
) => {
  const { data, error } = await UserService.updateUser(userData, imageFile);
  return { data, error };
};
