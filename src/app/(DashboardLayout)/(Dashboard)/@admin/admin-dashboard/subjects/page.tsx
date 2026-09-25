import TaxonomyClient from "../../../_component/admin/taxonomy/TaxonomyClient";
import { SubjectService } from "@/service/subject.service";
import { CategoryService } from "@/service/category.service";
import { Categories, TaxonomyItem } from "@/types";

export const revalidate = 60;

export default async function SubjectsPage() {
  const [subjectsResponse, categoriesResponse] = await Promise.all([
    SubjectService.getSubjects(),
    CategoryService.getCategories(),
  ]);

  const initialItems: TaxonomyItem[] = subjectsResponse.data?.data ?? [];
  const categories: Categories[] = categoriesResponse.data?.data ?? [];

  return (
    <TaxonomyClient
      kind="subject"
      initialItems={initialItems}
      categories={categories}
    />
  );
}
