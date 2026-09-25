import { env } from "@/env";
import { TaxonomyCreateData, TaxonomyUpdateData } from "@/types";
import { cookies } from "next/headers";

const API_URL = env.API_URL;
export const SUBJECT_REVALIDATE = 60;

export const SubjectService = {
  getSubjects: async function () {
    try {
      const res = await fetch(`${API_URL}/subjects`, {
        next: { revalidate: SUBJECT_REVALIDATE, tags: ["subjects"] },
      });

      const data = await res.json();

      if (!res.ok || !data?.success) {
        return {
          data: null,
          error: { message: data?.message || "Failed to get subjects!" },
        };
      }

      return { data, error: null };
    } catch {
      return { data: null, error: { message: "Something went wrong!" } };
    }
  },

  createSubject: async function (subjectData: TaxonomyCreateData) {
    try {
      const cookieStore = await cookies();
      const res = await fetch(`${API_URL}/subjects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieStore.toString(),
        },
        body: JSON.stringify(subjectData),
      });

      const data = await res.json();

      if (!res.ok || !data?.success) {
        return {
          data: null,
          error: { message: data?.message || "Failed to create subject!" },
        };
      }

      return { data, error: null };
    } catch {
      return { data: null, error: { message: "Something went wrong!" } };
    }
  },

  updateSubject: async function (subjectData: TaxonomyUpdateData) {
    try {
      const cookieStore = await cookies();
      const { id, ...rest } = subjectData;

      const res = await fetch(`${API_URL}/subjects/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieStore.toString(),
        },
        body: JSON.stringify(rest),
      });

      const data = await res.json();

      if (!res.ok || !data?.success) {
        return {
          data: null,
          error: { message: data?.message || "Failed to update subject!" },
        };
      }

      return { data, error: null };
    } catch {
      return { data: null, error: { message: "Something went wrong!" } };
    }
  },

  deleteSubject: async function (id: string) {
    try {
      const cookieStore = await cookies();
      const res = await fetch(`${API_URL}/subjects/${id}`, {
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
          error: { message: data?.message || "Failed to delete subject!" },
        };
      }

      return { data, error: null };
    } catch {
      return { data: null, error: { message: "Something went wrong!" } };
    }
  },
};
