import { env } from "@/env";
import { Categories } from "@/types";
import { cookies } from "next/headers";

const API_URL = env.API_URL;
export const CATEGORY_REVALIDATE = 60;

export const CategoryService = {
  createCategory: async function (categoryData: Categories) {
    try {
      const cookieStore = await cookies();
      const url = new URL(`${API_URL}/categories`);

      const res = await fetch(url.toString(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieStore.toString(),
        },
        body: JSON.stringify(categoryData),
      });

      const data = await res.json();

      if (!res.ok || !data?.success) {
        return {
          data: null,
          error: { message: data?.message || "Failed to create category!" },
        };
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: { message: "Something went wrong!" } };
    }
  },

  getCategories: async function () {
    try {
      const url = new URL(`${API_URL}/categories`);

      const res = await fetch(url.toString(), {
        next: {
          revalidate: CATEGORY_REVALIDATE,
          tags: ["category"],
        },
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

  updateCategory: async function (categoryData: Categories) {
    try {
      const cookieStore = await cookies();

      const id = categoryData.id;
      const categoryName = categoryData.name;
      const url = new URL(`${API_URL}/categories/${id}`);

      const res = await fetch(url.toString(), {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieStore.toString(),
        },
        body: JSON.stringify({ name: categoryName }),
      });

      const data = await res.json();

      if (!res.ok || !data?.success) {
        return {
          data: null,
          error: { message: data?.message || "Failed to update category!" },
        };
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: { message: "Something went wrong!" } };
    }
  },

  deleteCategory: async function (id: string) {
    try {
      const cookieStore = await cookies();
      const url = new URL(`${API_URL}/categories/${id}`);

      const res = await fetch(url.toString(), {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieStore.toString(),
        },
      });
      const data = await res.json();

      if (!res.ok || !data?.success) {
        return {
          data: null,
          error: { message: data?.message || "Failed to delete category!" },
        };
      }
      return { data, error: null };
    } catch (error) {
      return { data: null, error: { message: "Something went wrong!" } };
    }
  },
};
