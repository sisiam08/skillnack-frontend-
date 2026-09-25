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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";
import { normalizeText } from "@/helpers/textNormalizer";
import { Categories, TaxonomyItem, TaxonomyKind } from "@/types";
import {
  createSubject,
  deleteSubject,
  getSubjects,
  updateSubject,
} from "@/action/subject.action";
import {
  createSkill,
  deleteSkill,
  getSkills,
  updateSkill,
} from "@/action/skill.action";

type TaxonomyClientProps = {
  kind: TaxonomyKind;
  initialItems: TaxonomyItem[];
  categories: Categories[];
};

const LABELS: Record<TaxonomyKind, { title: string; single: string; plural: string }> = {
  subject: { title: "Subject Management", single: "Subject", plural: "Subjects" },
  skill: { title: "Skill Management", single: "Skill", plural: "Skills" },
};

export default function TaxonomyClient({
  kind,
  initialItems,
  categories,
}: TaxonomyClientProps) {
  const labels = LABELS[kind];
  const [items, setItems] = useState<TaxonomyItem[]>(initialItems);
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [editingId, setEditingId] = useState("");
  const [editingName, setEditingName] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState("");
  const [saving, setSaving] = useState(false);

  const actions =
    kind === "subject"
      ? {
          get: getSubjects,
          create: createSubject,
          update: updateSubject,
          delete: deleteSubject,
        }
      : {
          get: getSkills,
          create: createSkill,
          update: updateSkill,
          delete: deleteSkill,
        };

  const refresh = async () => {
    const response = await actions.get();
    setItems(response.data?.data ?? []);
  };

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    const normalizedName = normalizeText(name);
    if (!normalizedName) {
      toast.error(`${labels.single} name is required!`);
      return;
    }

    setSaving(true);
    const toastId = toast.loading("Creating...");
    try {
      const response = await actions.create({
        name: normalizedName,
        ...(categoryId ? { categoryId } : {}),
      });

      if (response.error || !response.data?.success) {
        toast.error(response.error?.message || "Creation failed!", {
          id: toastId,
        });
        return;
      }

      setName("");
      setCategoryId("");
      await refresh();
      toast.success(`${labels.single} created successfully.`, { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  const handleStartEditing = (item: TaxonomyItem) => {
    setEditingId(item.id);
    setEditingName(item.name);
    setEditingCategoryId(item.categoryId ?? "");
  };

  const handleUpdate = async () => {
    const normalizedName = normalizeText(editingName);
    if (!normalizedName) {
      toast.error(`${labels.single} name is required!`);
      return;
    }

    const toastId = toast.loading("Updating...");
    const response = await actions.update({
      id: editingId,
      name: normalizedName,
      categoryId: editingCategoryId || undefined,
    });

    if (response.error || !response.data?.success) {
      toast.error(response.error?.message || "Update failed!", { id: toastId });
      return;
    }

    setEditingId("");
    setEditingName("");
    setEditingCategoryId("");
    await refresh();
    toast.success(`${labels.single} updated successfully.`, { id: toastId });
  };

  const handleDelete = async (id: string) => {
    const toastId = toast.loading("Deleting...");
    const response = await actions.delete(id);

    if (response.error || !response.data?.success) {
      toast.error(response.error?.message || "Delete failed!", { id: toastId });
      return;
    }

    await refresh();
    toast.success(`${labels.single} deleted successfully.`, { id: toastId });
  };

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 p-4">
      <Card className="animate-in fade-in slide-in-from-bottom-2 duration-500">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <CardTitle className="ui-title-panel">{labels.title}</CardTitle>
            <CardDescription>
              Create, update, and delete tutoring {labels.plural.toLowerCase()}.
            </CardDescription>
          </div>
          <Badge className="bg-brand text-white hover:bg-brand">
            {items.length} {labels.plural}
          </Badge>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-1 animate-in fade-in slide-in-from-bottom-2 duration-500 [animation-delay:80ms]">
          <CardHeader>
            <CardTitle>Create {labels.single}</CardTitle>
            <CardDescription>
              Add a new {labels.single.toLowerCase()} for tutor profiles.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form className="space-y-4" onSubmit={handleCreate}>
              <Input
                placeholder={`e.g. ${
                  kind === "subject" ? "Data Structures" : "React"
                }`}
                value={name}
                onChange={(event) => setName(event.target.value)}
              />

              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Optional category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id || ""}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                type="submit"
                disabled={saving}
                className="w-full bg-brand text-white hover:bg-brand-strong"
              >
                Create {labels.single}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="xl:col-span-2 animate-in fade-in slide-in-from-bottom-2 duration-500 [animation-delay:140ms]">
          <CardHeader>
            <CardTitle>All {labels.plural}</CardTitle>
            <CardDescription>
              Update or remove existing {labels.plural.toLowerCase()}.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {items.length === 0 ? (
              <p className="rounded-md border bg-muted/30 px-3 py-8 text-center text-sm text-muted-foreground">
                No {labels.plural.toLowerCase()} found. Create one first.
              </p>
            ) : (
              items.map((item) => (
                <div key={item.id} className="space-y-3">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                      {editingId === item.id ? (
                        <div className="flex flex-col gap-2 sm:flex-row">
                          <Input
                            value={editingName}
                            onChange={(event) =>
                              setEditingName(event.target.value)
                            }
                            placeholder={`${labels.single} name`}
                            className="max-w-md"
                          />
                          <Select
                            value={editingCategoryId}
                            onValueChange={setEditingCategoryId}
                          >
                            <SelectTrigger className="w-full sm:w-44">
                              <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((cat) => (
                                <SelectItem key={cat.id} value={cat.id || ""}>
                                  {cat.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      ) : (
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-semibold">{item.name}</p>
                          {item.category?.name ? (
                            <Badge variant="outline">
                              {item.category.name}
                            </Badge>
                          ) : null}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {editingId === item.id ? (
                        <>
                          <Button
                            className="bg-brand text-white hover:bg-brand-strong"
                            onClick={(event) => {
                              event.preventDefault();
                              handleUpdate();
                            }}
                          >
                            Update
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setEditingId("");
                              setEditingName("");
                              setEditingCategoryId("");
                            }}
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            variant="outline"
                            onClick={() => handleStartEditing(item)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() => handleDelete(item.id)}
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
