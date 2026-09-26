import {
  BadgeCheck,
  BookOpen,
  CalendarClock,
  LayoutDashboard,
  Lightbulb,
  Tag,
  Users,
} from "lucide-react";
import { Routes } from "@/types";

export const AdminRoutes: Routes = {
  items: [
    {
      title: "Dashboard",
      url: "/admin-dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Category",
      url: "/admin-dashboard/category",
      icon: Tag,
    },
    {
      title: "Subjects",
      url: "/admin-dashboard/subjects",
      icon: BookOpen,
    },
    {
      title: "Skills",
      url: "/admin-dashboard/skills",
      icon: Lightbulb,
    },
    {
      title: "Verification",
      url: "/admin-dashboard/verification",
      icon: BadgeCheck,
    },
    {
      title: "Users",
      url: "/admin-dashboard/users",
      icon: Users,
    },
    {
      title: "Bookings",
      url: "/admin-dashboard/bookings",
      icon: CalendarClock,
    },
  ],
};
