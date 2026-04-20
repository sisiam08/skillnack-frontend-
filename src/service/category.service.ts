import { env } from "@/env";

const API_URL = env.API_URL;

export const CategoryService = {
  getCategories: async function () {
    try {
      const url = new URL(`${API_URL}/categories`);

      const res = await fetch(url.toString(), {
        next: { revalidate: 10, tags: ["category"] },
      });

      const data = await res.json();

      if (!res.ok || !data?.success) {
        return {
          data: null,
          error: { message: data?.message || "Failed to get category!" },
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
};
