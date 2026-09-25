export type TaxonomyItem = {
  id: string;
  name: string;
  isActive?: boolean;
  categoryId?: string | null;
  category?: { id: string; name: string } | null;
};

export type SubjectType = TaxonomyItem;
export type SkillType = TaxonomyItem;

export type TaxonomyKind = "subject" | "skill";

export type TaxonomyCreateData = {
  name: string;
  categoryId?: string;
};

export type TaxonomyUpdateData = {
  id?: string;
  name?: string;
  categoryId?: string;
  isActive?: boolean;
};
