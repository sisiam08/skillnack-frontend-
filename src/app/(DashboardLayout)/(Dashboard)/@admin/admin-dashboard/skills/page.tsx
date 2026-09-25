import TaxonomyClient from "../../../_component/admin/taxonomy/TaxonomyClient";
import { SkillService } from "@/service/skill.service";
import { CategoryService } from "@/service/category.service";
import { Categories, TaxonomyItem } from "@/types";

export const revalidate = 60;

export default async function SkillsPage() {
  const [skillsResponse, categoriesResponse] = await Promise.all([
    SkillService.getSkills(),
    CategoryService.getCategories(),
  ]);

  const initialItems: TaxonomyItem[] = skillsResponse.data?.data ?? [];
  const categories: Categories[] = categoriesResponse.data?.data ?? [];

  return (
    <TaxonomyClient
      kind="skill"
      initialItems={initialItems}
      categories={categories}
    />
  );
}
