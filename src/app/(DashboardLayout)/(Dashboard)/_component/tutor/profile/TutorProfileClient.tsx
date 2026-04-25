"use client";

import { type ChangeEvent, type KeyboardEvent, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldError } from "@/components/ui/field";
import { toast } from "@/components/ui/sonner";
import { useForm } from "@tanstack/react-form";
import * as z from "zod";
import { authClient } from "@/lib/auth-client";
import {
  BadgeCheck,
  BriefcaseBusiness,
  Camera,
  PencilLine,
  Save,
  UserRound,
  X,
} from "lucide-react";
import { updateUser } from "@/action/user.action";
import { createTutorProfile, updateTutorProfile } from "@/action/tutor.action";
import { Categories, TutorProfile } from "@/types";

const BD_PHONE_REGEX = /^(?:\+?88)?01[3-9]\d{8}$/;

const AccountSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .refine(
      (val) => val === "" || val === "01XXXXXXXXX" || BD_PHONE_REGEX.test(val),
      "Please enter a valid phone number",
    ),
});

const ProfessionalSchema = z.object({
  categoryId: z.string().min(1, "Category is required"),
  bio: z.string().max(255, "Bio must be at most 255 characters"),
  tags: z.array(z.string()),
  experienceYears: z.string().refine((value) => {
    const num = Number(value);
    return !isNaN(num) && num >= 0;
  }, "Experience years must be greater than or equal to 0"),
  hourlyRate: z.string().refine((value) => {
    const num = Number(value);
    return !isNaN(num) && num >= 0;
  }, "Hourly rate must be a non-negative number"),
});

type TutorProfileClientProps = {
  initialName: string;
  initialEmail: string;
  initialPhone: string;
  initialRole: string;
  initialStatus: string;
  initialImage?: string;
  initialTutorProfile?: TutorProfile;
  initialCategories: Categories[];
  userId: string;
};

const DEFAULT_AVATAR = "/default-avatar-profile.jpg";

export default function TutorProfileClient({
  initialName,
  initialEmail,
  initialPhone,
  initialRole,
  initialStatus,
  initialImage,
  initialTutorProfile,
  initialCategories,
  userId,
}: TutorProfileClientProps) {
  const hasProfile = Boolean(initialTutorProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [mainEmail, setMainEmail] = useState(initialEmail);
  const [phone, setPhone] = useState(initialPhone);
  const [role] = useState(initialRole);
  const [status] = useState(initialStatus);

  const [profileImagePreview, setProfileImagePreview] = useState<string>(
    initialImage || DEFAULT_AVATAR,
  );

  const [tutorData, setTutorData] = useState<TutorProfile | undefined>(
    initialTutorProfile,
  );
  const [tagInput, setTagInput] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const selectedFileRef = useRef<File | null>(null);

  const isFormEditMode = isEditing || isCreating;
  const isFormDisableMode = !isFormEditMode;

  const accountForm = useForm({
    defaultValues: {
      name,
      email,
      phone,
    },
    validators: { onSubmit: AccountSchema },
    onSubmit: async ({ value }) => {
      const accountChanged =
        value.name !== name ||
        value.email !== mainEmail ||
        value.phone !== phone ||
        selectedFileRef.current !== null;

      if (!accountChanged) {
        setIsEditing(false);
        return;
      }

      const updatedData = { name: value.name, phone: value.phone };
      const toastId = toast.loading("Saving your profile changes...");

      try {
        const response = await updateUser(updatedData, selectedFileRef.current);

        if (value.email !== mainEmail) {
          const emailResponse = await authClient.changeEmail({
            newEmail: value.email,
            callbackURL: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/dashboard`,
          });

          if (emailResponse.error) {
            toast.error(
              emailResponse.error.message ||
                "Failed to change email. Please check and try again.",
              { id: toastId },
            );
            return;
          }

          toast.success(
            "A verification email has been sent to your new email address.",
            { id: toastId },
          );
          return;
        }

        if (!response?.data) {
          toast.error("Failed to save profile changes.", { id: toastId });
          return;
        }

        setName(value.name);
        setEmail(value.email);
        setMainEmail(value.email);
        setPhone(value.phone);

        const latestImage = response.data?.data?.image;
        if (latestImage) setProfileImagePreview(latestImage);

        selectedFileRef.current = null;
        setIsEditing(false);
        toast.success("Profile updated successfully!", { id: toastId });
      } catch {
        toast.error("Something went wrong while saving your profile.", {
          id: toastId,
        });
      }
    },
  });

  const professionalForm = useForm({
    defaultValues: {
      categoryId: tutorData?.categoriesId || "",
      bio: tutorData?.bio || "",
      tags: tutorData?.tags || [],
      experienceYears: tutorData?.experienceYears?.toString() || "",
      hourlyRate: tutorData?.hourlyRate?.toString() || "",
    },
    validators: { onSubmit: ProfessionalSchema },
    onSubmit: async ({ value }) => {
      const toastId = toast.loading(
        isCreating ? "Creating profile..." : "Saving changes...",
      );

      const createPayload = {
        userId,
        categoriesId: value.categoryId,
        bio: value.bio,
        tags: value.tags,
        experienceYears: Number(value.experienceYears),
        hourlyRate: Number(value.hourlyRate),
      };

      const updatePayload = {
        categoriesId: value.categoryId || undefined,
        bio: value.bio || undefined,
        tags: value.tags,
        experienceYears: Number(value.experienceYears),
        hourlyRate: Number(value.hourlyRate),
      };

      try {
        if (isCreating) {
          const response = await createTutorProfile(createPayload);
          if (response.error || !response.data) {
            toast.error(response.error?.message || "Failed to create profile", {
              id: toastId,
            });
            return;
          }
          setIsCreating(false);
          toast.success("Profile created successfully!", { id: toastId });
        } else {
          const response = await updateTutorProfile(updatePayload);
          if (response.error || !response.data) {
            toast.error(response.error?.message || "Failed to update profile", {
              id: toastId,
            });
            return;
          }
          setIsEditing(false);
          toast.success("Changes saved successfully!", { id: toastId });
        }
      } catch {
        toast.error("An error occurred.", { id: toastId });
      }
    },
  });

  const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    selectedFileRef.current = file;
    setProfileImagePreview(URL.createObjectURL(file));
  };

  const handleBothSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await accountForm.handleSubmit();
    if (hasProfile || isCreating) {
      await professionalForm.handleSubmit();
    }
  };

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 p-4">
      <Card className="overflow-hidden border-border/70 bg-linear-to-r from-orange-50 via-white to-amber-50 dark:from-card dark:via-card dark:to-card">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <CardTitle className="ui-title-panel">Tutor Profile</CardTitle>
            <CardDescription>Tutor information.</CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            {!hasProfile && !isCreating ? (
              <Button
                className="bg-brand hover:bg-brand-strong text-white"
                onClick={() => {
                  setIsCreating(true);
                  setIsEditing(true);
                }}
              >
                <PencilLine className="mr-2 size-4" suppressHydrationWarning />
                Create Profile
              </Button>
            ) : (
              <Button
                variant="outline"
                disabled={isFormEditMode}
                onClick={() => {
                  setIsEditing(true);
                  accountForm.setFieldValue("name", name);
                  accountForm.setFieldValue("email", email);
                  accountForm.setFieldValue("phone", phone);
                  if (tutorData) {
                    professionalForm.setFieldValue(
                      "categoryId",
                      tutorData.categoriesId || "",
                    );
                    professionalForm.setFieldValue("bio", tutorData.bio || "");
                    professionalForm.setFieldValue(
                      "tags",
                      tutorData.tags || [],
                    );
                    setTagInput("");
                    professionalForm.setFieldValue(
                      "experienceYears",
                      tutorData.experienceYears?.toString() || "",
                    );
                    professionalForm.setFieldValue(
                      "hourlyRate",
                      tutorData.hourlyRate?.toString() || "",
                    );
                  }
                }}
              >
                <PencilLine className="mr-2 size-4" suppressHydrationWarning />
                Edit Profile
              </Button>
            )}
          </div>
        </CardHeader>
      </Card>

      <form
        onSubmit={handleBothSubmit}
        className="grid grid-cols-1 gap-6 lg:grid-cols-3"
      >
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserRound
                className="size-4 text-brand"
                suppressHydrationWarning
              />
              Account details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="mb-3 flex flex-col items-center gap-3">
              <Avatar className="size-24 sm:size-28">
                <AvatarImage src={profileImagePreview} />
                <AvatarFallback>TP</AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-2">
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                  disabled={isFormDisableMode}
                />
                {isFormEditMode ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={isFormDisableMode}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Camera className="mr-2 size-4" suppressHydrationWarning />
                    Add Profile Picture
                  </Button>
                ) : null}
              </div>
            </div>
            <Separator />
            <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="name">Name</Label>
                {isFormEditMode ? (
                  <accountForm.Field
                    name="name"
                    children={(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid;
                      return (
                        <Field>
                          <Input
                            id="name"
                            value={field.state.value}
                            disabled={isFormDisableMode}
                            onChange={(e) => field.handleChange(e.target.value)}
                          />
                          {isInvalid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </Field>
                      );
                    }}
                  />
                ) : (
                  <p className="rounded-md border bg-muted/30 px-3 py-2 text-sm font-medium">
                    {name}
                  </p>
                )}
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="email">Email</Label>
                {isFormEditMode ? (
                  <accountForm.Field
                    name="email"
                    children={(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid;
                      return (
                        <Field>
                          <Input
                            id="email"
                            type="email"
                            value={field.state.value}
                            disabled={isFormDisableMode}
                            onChange={(e) => field.handleChange(e.target.value)}
                          />
                          {isInvalid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </Field>
                      );
                    }}
                  />
                ) : (
                  <p className="rounded-md border bg-muted/30 px-3 py-2 text-sm font-medium">
                    {email}
                  </p>
                )}
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="phone">Phone</Label>
                {isFormEditMode ? (
                  <accountForm.Field
                    name="phone"
                    children={(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid;
                      return (
                        <Field>
                          <Input
                            id="phone"
                            type="tel"
                            value={field.state.value ?? "01XXXXXXXXX"}
                            disabled={isFormDisableMode}
                            onChange={(e) => field.handleChange(e.target.value)}
                          />
                          {isInvalid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </Field>
                      );
                    }}
                  />
                ) : (
                  <p className="rounded-md border bg-muted/30 px-3 py-2 text-sm font-medium">
                    {phone || "01XXXXXXXXX"}
                  </p>
                )}
              </div>
            </div>

            <Separator />

            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <p className="text-muted-foreground">Role</p>
                <Badge className="bg-brand text-white hover:bg-brand">
                  {role}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-muted-foreground">Status</p>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <BadgeCheck className="size-3.5" suppressHydrationWarning />
                  {status}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BriefcaseBusiness
                className="size-4 text-brand"
                suppressHydrationWarning
              />
              Professional profile details
            </CardTitle>
            <CardDescription>
              {isCreating
                ? "Write all tutor information to create your profile."
                : hasProfile
                  ? "Manage your professional profile."
                  : "Create your professional profile."}
            </CardDescription>
          </CardHeader>

          <Separator className="mb-5" />

          <CardContent className="space-y-5">
            {hasProfile || isCreating ? (
              <>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    {isFormEditMode ? (
                      <professionalForm.Field
                        name="categoryId"
                        children={(field) => {
                          const isInvalid =
                            field.state.meta.isTouched &&
                            !field.state.meta.isValid;
                          return (
                            <Field>
                              <Select
                                disabled={isFormDisableMode}
                                value={field.state.value}
                                onValueChange={(value) =>
                                  field.handleChange(value)
                                }
                              >
                                <SelectTrigger id="category" className="w-full">
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                  {initialCategories.map((cat) => (
                                    <SelectItem
                                      key={cat.id}
                                      value={cat.id || ""}
                                    >
                                      {cat.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              {isInvalid && (
                                <FieldError errors={field.state.meta.errors} />
                              )}
                            </Field>
                          );
                        }}
                      />
                    ) : (
                      <p className="rounded-md border bg-muted/30 px-3 py-2 text-sm font-medium">
                        {tutorData?.category?.name || "-"}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="tags">Tags</Label>
                    {isFormEditMode ? (
                      <professionalForm.Field
                        name="tags"
                        children={(field) => {
                          const isInvalid =
                            field.state.meta.isTouched &&
                            !field.state.meta.isValid;

                          const addTag = (rawTag: string) => {
                            const normalizedTag = rawTag.trim();
                            if (!normalizedTag) {
                              return;
                            }

                            const exists = field.state.value.some(
                              (tag) =>
                                tag.toLowerCase() ===
                                normalizedTag.toLowerCase(),
                            );

                            if (!exists) {
                              field.handleChange([
                                ...field.state.value,
                                normalizedTag,
                              ]);
                            }
                          };

                          const removeTag = (indexToRemove: number) => {
                            field.handleChange(
                              field.state.value.filter(
                                (_, index) => index !== indexToRemove,
                              ),
                            );
                          };

                          const handleTagKeyDown = (
                            event: KeyboardEvent<HTMLInputElement>,
                          ) => {
                            if (
                              event.key === " " ||
                              event.key === "Enter" ||
                              event.key === ","
                            ) {
                              event.preventDefault();
                              addTag(tagInput);
                              setTagInput("");
                            }

                            if (
                              event.key === "Backspace" &&
                              !tagInput &&
                              field.state.value.length > 0
                            ) {
                              removeTag(field.state.value.length - 1);
                            }
                          };

                          return (
                            <Field>
                              <div className="rounded-md border border-input px-2 py-2">
                                <div className="mb-2 flex flex-wrap gap-2">
                                  {field.state.value.map((tag, index) => (
                                    <Badge
                                      key={`${tag}-${index}`}
                                      variant="secondary"
                                      className="gap-1"
                                    >
                                      {tag}
                                      <button
                                        type="button"
                                        aria-label={`Remove ${tag}`}
                                        className="rounded-full p-0.5 hover:bg-muted"
                                        onClick={() => removeTag(index)}
                                      >
                                        <X
                                          className="size-3"
                                          suppressHydrationWarning
                                        />
                                      </button>
                                    </Badge>
                                  ))}
                                </div>

                                <Input
                                  id="tags"
                                  placeholder="Type tag and press space"
                                  value={tagInput}
                                  disabled={isFormDisableMode}
                                  className="border-0 p-1 shadow-none focus-visible:ring-0"
                                  onKeyDown={handleTagKeyDown}
                                  onChange={(e) => setTagInput(e.target.value)}
                                  onBlur={() => {
                                    if (tagInput.trim()) {
                                      addTag(tagInput);
                                      setTagInput("");
                                    }
                                  }}
                                />
                              </div>
                              {isInvalid && (
                                <FieldError errors={field.state.meta.errors} />
                              )}
                            </Field>
                          );
                        }}
                      />
                    ) : tutorData?.tags?.length ? (
                      <div className="flex flex-wrap gap-2 rounded-md border bg-muted/30 px-3 py-2">
                        {tutorData.tags.map((tag) => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="rounded-md border bg-muted/30 px-3 py-2 text-sm font-medium">
                        -
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="experience">Experience (Years)</Label>
                    {isFormEditMode ? (
                      <professionalForm.Field
                        name="experienceYears"
                        children={(field) => {
                          const isInvalid =
                            field.state.meta.isTouched &&
                            !field.state.meta.isValid;
                          return (
                            <Field>
                              <Input
                                id="experience"
                                type="number"
                                placeholder="year"
                                value={field.state.value}
                                disabled={isFormDisableMode}
                                onChange={(e) =>
                                  field.handleChange(e.target.value)
                                }
                              />
                              {isInvalid && (
                                <FieldError errors={field.state.meta.errors} />
                              )}
                            </Field>
                          );
                        }}
                      />
                    ) : (
                      <p className="rounded-md border bg-muted/30 px-3 py-2 text-sm font-medium">
                        {tutorData?.experienceYears ?? "-"}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hourly-rate">Hourly Rate (tk)</Label>
                    {isFormEditMode ? (
                      <professionalForm.Field
                        name="hourlyRate"
                        children={(field) => {
                          const isInvalid =
                            field.state.meta.isTouched &&
                            !field.state.meta.isValid;
                          return (
                            <Field>
                              <Input
                                id="hourly-rate"
                                type="number"
                                placeholder="tk"
                                value={field.state.value}
                                disabled={isFormDisableMode}
                                onChange={(e) =>
                                  field.handleChange(e.target.value)
                                }
                              />
                              {isInvalid && (
                                <FieldError errors={field.state.meta.errors} />
                              )}
                            </Field>
                          );
                        }}
                      />
                    ) : (
                      <p className="rounded-md border bg-muted/30 px-3 py-2 text-sm font-medium">
                        {tutorData?.hourlyRate ?? "-"}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  {isFormEditMode ? (
                    <professionalForm.Field
                      name="bio"
                      children={(field) => {
                        const isInvalid =
                          field.state.meta.isTouched &&
                          !field.state.meta.isValid;
                        return (
                          <Field>
                            <Textarea
                              id="bio"
                              value={field.state.value}
                              placeholder="write here..."
                              rows={5}
                              className="flex min-h-28 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              disabled={isFormDisableMode}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                            />
                            {isInvalid && (
                              <FieldError errors={field.state.meta.errors} />
                            )}
                          </Field>
                        );
                      }}
                    />
                  ) : (
                    <p className="min-h-28 whitespace-pre-wrap rounded-md border bg-muted/30 px-3 py-2 text-sm font-medium leading-relaxed">
                      {tutorData?.bio || "-"}
                    </p>
                  )}
                </div>
              </>
            ) : (
              <div className="flex justify-center py-6">
                <p className="text-sm text-muted-foreground">
                  No professional profile yet. Click "Create Profile" to get
                  started.
                </p>
              </div>
            )}

            <Separator />

            <div className="flex flex-wrap justify-center gap-2">
              {isFormEditMode && (
                <>
                  <Button
                    className="bg-brand hover:bg-brand-strong text-white"
                    type="submit"
                  >
                    <Save className="mr-2 size-4" suppressHydrationWarning />
                    {isCreating ? "Create Profile" : "Save Changes"}
                  </Button>
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setIsCreating(false);
                      selectedFileRef.current = null;
                    }}
                  >
                    Cancel
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
