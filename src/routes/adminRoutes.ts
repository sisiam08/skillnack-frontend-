import { Routes } from "@/types";

export const AdminRoutes: Routes = {
  items: [
    {
      title: "Dashboard",
      url: "/admin-dashboard",
    },
    {
      title: "Category",
      url: "/admin-dashboard/category",
    },
    {
      title: "Users",
      url: "/admin-dashboard/users",
    },
    {
      title: "Bookings",
      url: "/admin-dashboard/bookings",
    },
  ],
};
