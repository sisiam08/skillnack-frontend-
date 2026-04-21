import { env } from "@/env";
import { Filters, ServiceOptions } from "@/types";

const API_URL = env.API_URL;

export const TutorService = {
  getAllTutors: async function (params?: Filters, options?: ServiceOptions) {
    try {
      const url = new URL(`${API_URL}/tutors`);

      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            url.searchParams.append(key, value);
          }
        });
      }

      const config: RequestInit = {};

      if (options?.cache) {
        config.cache = options.cache;
      }
      if (options?.revalidate) {
        config.next = { revalidate: options.revalidate };
      }

      config.next = { ...config.next, tags: ["tutors"] };

      const res = await fetch(url.toString(), config);

      const data = await res.json();

      if (!res.ok || !data?.success) {
        return {
          data: null,
          error: { message: data?.message || "Failed to get all tutors!" },
        };
      }

      return { data, error: null };
    } catch (error) {
      return {
        data: null,
        error: {
          message: "Somthing went wrong!",
        },
      };
    }
  },

  getTutorById: async function (id: string) {
    try {
      const res = await fetch(`${API_URL}/tutors/${id}`);

      const data = await res.json();

      if (!res.ok || !data?.success) {
        return {
          data: null,
          error: { message: data?.message || "Failed to get tutor by id!" },
        };
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: { message: "Something went wrong!" } };
    }
  },
};
