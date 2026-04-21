import { env } from "@/env";
import { cookies } from "next/headers";

const AUTH_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth`;

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

      console.log("Session in service: ", session);

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
};
