import type { MetadataRoute } from "next";
import { TutorService } from "@/service/tutor.service";

const BASE_URL =
  process.env.NEXT_PUBLIC_FRONTEND_URL ?? "http://localhost:3000";

export const revalidate = 3600;

const STATIC_ROUTES: {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}[] = [
  { path: "", changeFrequency: "daily", priority: 1 },
  { path: "/find-tutors", changeFrequency: "daily", priority: 0.9 },
  { path: "/about", changeFrequency: "monthly", priority: 0.6 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.6 },
  { path: "/faq", changeFrequency: "monthly", priority: 0.6 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
  { path: "/refund-policy", changeFrequency: "yearly", priority: 0.3 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const entries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${BASE_URL}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  // Add public tutor profiles. Wrap in try/catch so the sitemap still builds
  // if the API is unavailable at build time.
  try {
    const response = await TutorService.getAllTutors({
      page: "1",
      limit: "100",
    });
    const tutors = response.data?.data?.data ?? [];

    for (const tutor of tutors) {
      entries.push({
        url: `${BASE_URL}/find-tutors/${tutor.id}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }
  } catch {
    // ignore — static routes are still emitted
  }

  return entries;
}
