import { UserRole } from "@/constants/roles";
import { UserStatus } from "@/constants/status";

export type UserUpdate = {
  name?: string;
  phone?: string;
  image?: string;
};

export type UserType = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  image?: string;
  createdAt: string;
};
