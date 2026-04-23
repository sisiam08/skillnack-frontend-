import { env } from "@/env";
import { cookies } from "next/headers";

const API_URL = env.API_URL;

export const StudentService = {
  getStudentStats: async () => {
    try {
      const cookieStore = await cookies();
      const res = await fetch(`${API_URL}/students/stats`, {
        headers: {
          Cookie: cookieStore.toString(),
        },
      });

      const data = await res.json();

      if (!res.ok || !data?.success) {
        return {
          data: null,
          error: { message: data?.message || "Failed to get student stats!" },
        };
      }


      return { data, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: { message: error.message || "Something went wrong!" },
      };
    }
  },

  getStudentRecentActivity: async () => {
    try {
      const cookieStore = await cookies();
      const res = await fetch(`${API_URL}/students/recentActivity`, {
        headers: {
          Cookie: cookieStore.toString(),
        },
      });
      const data = await res.json();

      if (!res.ok || !data?.success) {
        return {
          data: null,
          error: { message: data?.message || "Failed to get student recent activity!" },
        };
      }

      return { data, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: { message: error.message || "Something went wrong!" },
      };
    }
  },
};
