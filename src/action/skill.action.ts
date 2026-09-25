"use server";

import { SkillService } from "@/service/skill.service";
import { TaxonomyCreateData, TaxonomyUpdateData } from "@/types";
import { updateTag } from "next/cache";

export const getSkills = async () => {
  const { data, error } = await SkillService.getSkills();
  return { data, error };
};

export const createSkill = async (skillData: TaxonomyCreateData) => {
  const { data, error } = await SkillService.createSkill(skillData);

  if (data?.success) {
    updateTag("skills");
  }

  return { data, error };
};

export const updateSkill = async (skillData: TaxonomyUpdateData) => {
  const { data, error } = await SkillService.updateSkill(skillData);

  if (data?.success) {
    updateTag("skills");
  }

  return { data, error };
};

export const deleteSkill = async (skillId: string) => {
  const { data, error } = await SkillService.deleteSkill(skillId);

  if (data?.success) {
    updateTag("skills");
  }

  return { data, error };
};
