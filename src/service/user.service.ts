import { env } from "@/env";
import { UserUpdate } from "@/types";
import { cookies } from "next/headers";

const AUTH_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth`;
const API_URL = env.API_URL;

export const UserService = {
  getSession: async function () {
    try {
      const cookieStore = await cookies();

      const res = await fetch(`${AUTH_URL}/get-session`, {
        headers: {
          Cookie: cookieStore.toString(),
        },
        cache: "no-store",
      });

      const session = await res.json();

      if (session == null) {
        return {
          data: null,
          error: {
            message: "Session is null",
          },
        };
      }

      return {
        data: session,
        error: null,
      };
    } catch (error) {
      return {
        data: null,
        error: {
          message: "Something went wrong!",
        },
      };
    }
  },

  updateUser: async function (userData: UserUpdate, imageFile?: File | null) {
    try {
      const cookieStore = await cookies();

      const formData = new FormData();

      if (userData.name !== undefined) {
        formData.append("name", userData.name);
      }

      if (userData.phone !== undefined) {
        formData.append("phone", userData.phone);
      }

      if (imageFile) {
        formData.append("image", imageFile);
      }

      const res = await fetch(`${API_URL}/users/me`, {
        method: "PATCH",
        headers: {
          Cookie: cookieStore.toString(),
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data?.success) {
        return {
          data: null,
          error: { message: data?.message || "Failed to update user!" },
        };
      }

      return {
        data,
        error: null,
      };
    } catch (error) {
      return {
        data: null,
        error: {
          message: "Something went wrong!",
        },
      };
    }
  },
};
