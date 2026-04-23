import CategoryClient from "../../../_component/admin/category/CategoryClient";
import {
  CATEGORY_REVALIDATE,
  CategoryService,
} from "@/service/category.service";
import { Categories } from "@/types";

export const revalidate = CATEGORY_REVALIDATE;

export default async function CategoryPage() {
  const categoriesResponse = await CategoryService.getCategories();
  const initialCategories: Categories[] = categoriesResponse.data?.data ?? [];

  return <CategoryClient initialCategories={initialCategories} />;
}
