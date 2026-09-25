"use server";

import { SubjectService } from "@/service/subject.service";
import { TaxonomyCreateData, TaxonomyUpdateData } from "@/types";
import { updateTag } from "next/cache";

export const getSubjects = async () => {
  const { data, error } = await SubjectService.getSubjects();
  return { data, error };
};

export const createSubject = async (subjectData: TaxonomyCreateData) => {
  const { data, error } = await SubjectService.createSubject(subjectData);

  if (data?.success) {
    updateTag("subjects");
  }

  return { data, error };
};

export const updateSubject = async (subjectData: TaxonomyUpdateData) => {
  const { data, error } = await SubjectService.updateSubject(subjectData);

  if (data?.success) {
    updateTag("subjects");
  }

  return { data, error };
};

export const deleteSubject = async (subjectId: string) => {
  const { data, error } = await SubjectService.deleteSubject(subjectId);

  if (data?.success) {
    updateTag("subjects");
  }

  return { data, error };
};
