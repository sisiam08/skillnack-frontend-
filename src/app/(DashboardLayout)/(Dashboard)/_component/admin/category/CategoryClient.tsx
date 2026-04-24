"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useForm } from "@tanstack/react-form";
import { Field, FieldLabel } from "@/components/ui/field";
import { Categories } from "@/types";
import { toast } from "@/components/ui/sonner";
import * as z from "zod";
import { normalizeText } from "@/helpers/textNormalizer";
import {
  createCategory,
  deleteCategory,
  getcategory,
  updateCategory,
} from "@/action/category.action";

const formValidation = z.object({
  categoryName: z.string().min(1),
});

type CategoryClientProps = {
  initialCategories: Categories[];
};

export default function CategoryClient({
  initialCategories,
}: CategoryClientProps) {
  const [categories, setCategories] = useState<Categories[]>(initialCategories);
  const [editingCategoryId, setEditingCategoryId] = useState("");

  const refreshCategories = async () => {
    const response = await getcategory();
    setCategories(response.data?.data ?? []);
  };

  const createForm = useForm({
    defaultValues: {
      categoryName: "",
    },
    validators: { onSubmit: formValidation },
    onSubmit: async ({ value }) => {
      const normalizedName = normalizeText(value.categoryName);
      if (!normalizedName) return;

      const toastId = toast.loading("Creating...");
      try {
        const response = await createCategory({
          name: normalizedName,
        } as Categories);

        if (!response.data?.success) {
          throw new Error(response.data?.error || "Category creation failed!");
        }

        await refreshCategories();
        createForm.setFieldValue("categoryName", "");

        toast.success("Category successfully created.", { id: toastId });
      } catch {
        toast.error("Category creation failed!", { id: toastId });
      }
    },
  });

  const editForm = useForm({
    defaultValues: {
      categoryName: "",
    },
    validators: { onSubmit: formValidation },
    onSubmit: async ({ value }) => {
      const normalizedName = normalizeText(value.categoryName);
      if (!normalizedName) {
        toast.error("Category name is required!");
        return;
      }

      const toastId = toast.loading("Category updating...");
      try {
        const categoryData = {
          id: editingCategoryId,
          name: normalizedName,
        };

        await updateCategory(categoryData as Categories);
        await refreshCategories();
        setEditingCategoryId("");
        editForm.setFieldValue("categoryName", "");

        toast.success("Category updated successfully.", { id: toastId });
      } catch {
        toast.error("Category updating failed!", { id: toastId });
      }
    },
  });

  const handleStartEditing = (categoryId: string, categoryName: string) => {
    setEditingCategoryId(categoryId);
    editForm.setFieldValue("categoryName", categoryName);
  };

  const handleDelete = async (categoryId: string) => {
    const toastId = toast.loading("Deleting category...");
    try {
      const response = await deleteCategory(categoryId);

      if (!response.data?.success) {
        throw new Error(response.data?.error || "Category delete failed!");
      }

      await refreshCategories();

      toast.success("Category deleted successfully.", { id: toastId });
    } catch {
      toast.error("Category delete failed!", { id: toastId });
    }
  };

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 p-4">
      <Card className="animate-in fade-in slide-in-from-bottom-2 duration-500">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <CardTitle className="ui-title-panel">
              Category Management
            </CardTitle>
            <CardDescription>
              Create, update, and delete tutoring categories.
            </CardDescription>
          </div>
          <Badge className="bg-brand text-white hover:bg-brand">
            {categories.length} Categories
          </Badge>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-1 animate-in fade-in slide-in-from-bottom-2 duration-500 [animation-delay:80ms]">
          <CardHeader>
            <CardTitle>Create Category</CardTitle>
            <CardDescription>
              Add a new category for tutor profiles.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2"></div>

            <form
              id="newCategoryForm"
              className="space-y-6"
              onSubmit={(e) => {
                e.preventDefault();
                createForm.handleSubmit();
              }}
            >
              <createForm.Field
                name="categoryName"
                children={(field) => {
                  return (
                    <Field>
                      <FieldLabel htmlFor="new-category-name">
                        Category Name
                      </FieldLabel>
                      <Input
                        id="new-category-name"
                        name={field.name}
                        placeholder="e.g. Mathematics"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                    </Field>
                  );
                }}
              />
              <Button
                form="newCategoryForm"
                type="submit"
                className="w-full bg-brand text-white hover:bg-brand-strong"
              >
                Create Category
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="xl:col-span-2 animate-in fade-in slide-in-from-bottom-2 duration-500 [animation-delay:140ms]">
          <CardHeader>
            <CardTitle>All Categories</CardTitle>
            <CardDescription>
              Update or remove existing categories.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {categories.length === 0 ? (
              <p className="rounded-md border bg-muted/30 px-3 py-8 text-center text-sm text-muted-foreground">
                No categories found. Create a new category first.
              </p>
            ) : (
              categories.map((category) => (
                <div key={category.id} className="space-y-3">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                      {editingCategoryId === category.id ? (
                        <div className="max-w-md">
                          <editForm.Field
                            name="categoryName"
                            children={(field) => {
                              return (
                                <Input
                                  name={field.name}
                                  value={field.state.value ?? ""}
                                  onChange={(e) =>
                                    field.handleChange(e.target.value)
                                  }
                                  placeholder="Category name"
                                />
                              );
                            }}
                          />
                        </div>
                      ) : (
                        <p className="font-semibold">{category.name}</p>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {editingCategoryId === category.id ? (
                        <>
                          <Button
                            className="bg-brand text-white hover:bg-brand-strong"
                            onClick={(e) => {
                              e.preventDefault();
                              editForm.handleSubmit();
                            }}
                          >
                            Update
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setEditingCategoryId("");
                              editForm.setFieldValue("categoryName", "");
                            }}
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            variant="outline"
                            onClick={() =>
                              handleStartEditing(
                                category.id as string,
                                category.name as string,
                              )
                            }
                          >
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() => handleDelete(category.id as string)}
                          >
                            Delete
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                  <Separator />
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
