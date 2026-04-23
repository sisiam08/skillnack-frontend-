"use server";

import { CategoryService } from "@/service/category.service";
import { Categories } from "@/types";
import { updateTag } from "next/cache";

export const getcategory = async () => {
  const { data, error } = await CategoryService.getCategories();

  return {data, error};
};

export const createCategory = async (categoryData: Categories) => {
  const { data, error } = await CategoryService.createCategory(categoryData);
  if (data?.success) {
    updateTag("category");
  }

  return { data, error };
};

export const updateCategory = async (categoryData: Categories) => {
  const { data, error } = await CategoryService.updateCategory(categoryData);

  if (data?.success) {
    updateTag("category");
  }
  return { data, error };
};

export const deleteCategory = async (categoryId: string) => {
  const { data, error } = await CategoryService.deleteCategory(categoryId);

  if (error) {
    throw new Error(error.message || "Category delete failed!");
  }

  if (data?.success) {
    updateTag("category");
  }

  return { data, error };
};
