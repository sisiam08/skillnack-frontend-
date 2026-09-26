import { History, LayoutDashboard, User, Video } from "lucide-react";
import { Routes } from "@/types";

export const StudentRoutes: Routes = {
  items: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Profile",
      url: "/dashboard/profile",
      icon: User,
    },
    {
      title: "Session",
      url: "/dashboard/session",
      icon: Video,
    },
    {
      title: "History",
      url: "/dashboard/history",
      icon: History,
    },
  ],
};
