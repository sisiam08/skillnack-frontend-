"use server";

import { CategoryService } from "@/service/category.service";


export const getcategory = async () => {
  const { data, error } = await CategoryService.getCategories();

  return {data, error};
};