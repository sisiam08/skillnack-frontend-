"use server";

import { UserService } from "@/service/user.service";


export const getSession = async () => {
  const session = await UserService.getSession();
  console.log("Session in action: ", session);
  return session;
};
