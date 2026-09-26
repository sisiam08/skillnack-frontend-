import {
  CalendarClock,
  History,
  LayoutDashboard,
  User,
  Video,
} from "lucide-react";
import { Routes } from "@/types";

export const TutorRoutes: Routes = {
  items: [
    {
      title: "Dashboard",
      url: "/tutor-dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Profile",
      url: "/tutor-dashboard/tutor-profile",
      icon: User,
    },
    {
      title: "Session",
      url: "/tutor-dashboard/session",
      icon: Video,
    },
    {
      title: "Availability",
      url: "/tutor-dashboard/availability",
      icon: CalendarClock,
    },
    {
      title: "History",
      url: "/tutor-dashboard/history",
      icon: History,
    },
  ],
};
