import type { MetadataRoute } from "next";

const BASE_URL =
  process.env.NEXT_PUBLIC_FRONTEND_URL ?? "http://localhost:3000";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/dashboard",
          "/tutor-dashboard",
          "/admin-dashboard",
          "/class",
          "/login",
          "/signup",
          "/reset-password",
          "/api/",
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
