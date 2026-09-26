import { env } from "@/env";
import { AdminAnalyticsRange, TutorsFilter, UsersFilter } from "@/types";
import { cookies } from "next/headers";

const API_URL = env.API_URL;

export const AdminService = {
  getAllUsers: async (params?: UsersFilter) => {
    try {
      const cookieStore = await cookies();
      const url = new URL(`${API_URL}/admin/users`);

      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            url.searchParams.append(key, value);
          }
        });
      }

      const res = await fetch(url.toString(), {
        headers: {
          Cookie: cookieStore.toString(),
        },
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        return {
          data: null,
          error: {
            message: data?.message || "Failed to fetch users",
          },
        };
      }

      return { data, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: {
          message: error?.message || "An error occurred while fetching users",
        },
      };
    }
  },

  updateUserStatus: async (userId: string, newStatus: string) => {
    try {
      const cookieStore = await cookies();
      const res = await fetch(`${API_URL}/admin/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieStore.toString(),
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        return {
          data: null,
          error: {
            message: data?.message || "Failed to update user status",
          },
        };
      }

      return { data, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: {
          message:
            error?.message || "An error occurred while updating user status",
        },
      };
    }
  },

  getAdminDashboardStats: async () => {
    try {
      const cookieStore = await cookies();
      const res = await fetch(`${API_URL}/admin/stats`, {
        headers: {
          Cookie: cookieStore.toString(),
        },
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        return {
          data: null,
          error: {
            message: data?.message || "Failed to fetch dashboard stats",
          },
        };
      }

      return { data, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: {
          message:
            error?.message ||
            "An error occurred while fetching dashboard stats",
        },
      };
    }
  },

  getAdminAnalytics: async (range: AdminAnalyticsRange = "30d") => {
    try {
      const cookieStore = await cookies();
      const res = await fetch(`${API_URL}/admin/analytics?range=${range}`, {
        headers: {
          Cookie: cookieStore.toString(),
        },
        cache: "no-store",
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        return {
          data: null,
          error: {
            message: data?.message || "Failed to fetch analytics",
          },
        };
      }

      return { data, error: null };
    } catch (error) {
      return {
        data: null,
        error: {
          message:
            error instanceof Error
              ? error.message
              : "An error occurred while fetching analytics",
        },
      };
    }
  },

  getTutors: async (params?: TutorsFilter) => {
    try {
      const cookieStore = await cookies();
      const url = new URL(`${API_URL}/admin/tutors`);

      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            url.searchParams.append(key, value);
          }
        });
      }

      const res = await fetch(url.toString(), {
        headers: {
          Cookie: cookieStore.toString(),
        },
        cache: "no-store",
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        return {
          data: null,
          error: {
            message: data?.message || "Failed to fetch tutors",
          },
        };
      }

      return { data, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: {
          message: error?.message || "An error occurred while fetching tutors",
        },
      };
    }
  },

  updateTutorVerification: async (
    tutorId: string,
    status: string,
    rejectionReason?: string,
  ) => {
    try {
      const cookieStore = await cookies();
      const res = await fetch(`${API_URL}/admin/tutors/${tutorId}/verification`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieStore.toString(),
        },
        body: JSON.stringify({ status, rejectionReason }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        return {
          data: null,
          error: {
            message: data?.message || "Failed to update tutor verification",
          },
        };
      }

      return { data, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: {
          message:
            error?.message ||
            "An error occurred while updating tutor verification",
        },
      };
    }
  },
};
