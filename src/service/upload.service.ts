import { env } from "@/env";
import { cookies } from "next/headers";

const API_URL = env.API_URL;

export const UploadService = {
  uploadSessionFile: async (file: File) => {
    try {
      const cookieStore = await cookies();
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch(`${API_URL}/uploads`, {
        method: "POST",
        headers: {
          Cookie: cookieStore.toString(),
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data?.success) {
        return {
          url: null,
          error: { message: data?.message || "Failed to upload file!" },
        };
      }

      return { url: data.data?.url as string, error: null };
    } catch (error: any) {
      return {
        url: null,
        error: { message: error.message || "Something went wrong!" },
      };
    }
  },
};
