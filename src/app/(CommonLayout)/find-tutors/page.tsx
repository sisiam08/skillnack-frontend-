import { CategoryService } from "@/service/category.service";
import { TutorService } from "@/service/tutor.service";
import { PaginationType, TutorProfile } from "@/types";

import TutorsClient from "../_component/page/find-tutors/TutorsClient";

const FALLBACK_PAGINATION: PaginationType = {
  totalData: 0,
  page: 1,
  limit: 12,
  totalPages: 1,
};

export default async function TutorsPage() {
  const [tutorsResponse, categoriesResponse] = await Promise.all([
    TutorService.getAllTutors({ page: "1", limit: "12" }, { revalidate: 10 }),
    CategoryService.getCategories(),
  ]);

  const initialTutors: TutorProfile[] = tutorsResponse.data?.data?.data ?? [];
  const initialPagination: PaginationType =
    tutorsResponse.data?.data?.pagination ?? FALLBACK_PAGINATION;
  const categories = categoriesResponse.data?.data ?? [];

  return (
    <main className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 " />

      <div className="relative mx-auto w-full max-w-7xl px-4 py-8">
        <TutorsClient
          initialTutors={initialTutors}
          initialPagination={initialPagination}
          categories={categories}
        />
      </div>
    </main>
  );
}
