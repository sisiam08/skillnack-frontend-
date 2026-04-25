import CategoryClient from "../../../_component/admin/category/CategoryClient";
import { CategoryService } from "@/service/category.service";
import { Categories } from "@/types";

export const revalidate = 60;

export default async function CategoryPage() {
  const categoriesResponse = await CategoryService.getCategories();
  const initialCategories: Categories[] = categoriesResponse.data?.data ?? [];

  return <CategoryClient initialCategories={initialCategories} />;
}
