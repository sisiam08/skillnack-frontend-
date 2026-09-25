import { env } from "@/env";
import { TaxonomyCreateData, TaxonomyUpdateData } from "@/types";
import { cookies } from "next/headers";

const API_URL = env.API_URL;
export const SKILL_REVALIDATE = 60;

export const SkillService = {
  getSkills: async function () {
    try {
      const res = await fetch(`${API_URL}/skills`, {
        next: { revalidate: SKILL_REVALIDATE, tags: ["skills"] },
      });

      const data = await res.json();

      if (!res.ok || !data?.success) {
        return {
          data: null,
          error: { message: data?.message || "Failed to get skills!" },
        };
      }

      return { data, error: null };
    } catch {
      return { data: null, error: { message: "Something went wrong!" } };
    }
  },

  createSkill: async function (skillData: TaxonomyCreateData) {
    try {
      const cookieStore = await cookies();
      const res = await fetch(`${API_URL}/skills`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieStore.toString(),
        },
        body: JSON.stringify(skillData),
      });

      const data = await res.json();

      if (!res.ok || !data?.success) {
        return {
          data: null,
          error: { message: data?.message || "Failed to create skill!" },
        };
      }

      return { data, error: null };
    } catch {
      return { data: null, error: { message: "Something went wrong!" } };
    }
  },

  updateSkill: async function (skillData: TaxonomyUpdateData) {
    try {
      const cookieStore = await cookies();
      const { id, ...rest } = skillData;

      const res = await fetch(`${API_URL}/skills/${id}`, {
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
          error: { message: data?.message || "Failed to update skill!" },
        };
      }

      return { data, error: null };
    } catch {
      return { data: null, error: { message: "Something went wrong!" } };
    }
  },

  deleteSkill: async function (id: string) {
    try {
      const cookieStore = await cookies();
      const res = await fetch(`${API_URL}/skills/${id}`, {
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
          error: { message: data?.message || "Failed to delete skill!" },
        };
      }

      return { data, error: null };
    } catch {
      return { data: null, error: { message: "Something went wrong!" } };
    }
  },
};
