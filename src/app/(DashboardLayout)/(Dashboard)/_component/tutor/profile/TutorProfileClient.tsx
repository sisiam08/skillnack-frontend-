"use client";

import { type ChangeEvent, useRef, useState } from "react";
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
  ShieldAlert,
  UserRound,
} from "lucide-react";
import { updateUser } from "@/action/user.action";
import { createTutorProfile, updateTutorProfile } from "@/action/tutor.action";
import { Categories, TaxonomyItem, TutorProfile } from "@/types";
import { VerificationStatus } from "@/constants/status";
import TaxonomyMultiSelect from "@/components/shared/TaxonomyMultiSelect";

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
  subjectIds: z.array(z.string()),
  skillIds: z.array(z.string()),
  headline: z.string().max(100, "Headline must be at most 100 characters"),
  currentRoleOrInstitution: z
    .string()
    .max(200, "Must be at most 200 characters"),
  linkedinUrl: z.union([z.string().url("Enter a valid URL"), z.literal("")]),
  githubUrl: z.union([z.string().url("Enter a valid URL"), z.literal("")]),
  portfolioUrl: z.union([z.string().url("Enter a valid URL"), z.literal("")]),
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
  initialSubjects: TaxonomyItem[];
  initialSkills: TaxonomyItem[];
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
  initialSubjects,
  initialSkills,
  userId,
}: TutorProfileClientProps) {
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

  const hasProfile = Boolean(tutorData);

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
      subjectIds: tutorData?.subjects?.map((subject) => subject.id) || [],
      skillIds: tutorData?.skills?.map((skill) => skill.id) || [],
      headline: tutorData?.headline || "",
      currentRoleOrInstitution: tutorData?.currentRoleOrInstitution || "",
      linkedinUrl: tutorData?.linkedinUrl || "",
      githubUrl: tutorData?.githubUrl || "",
      portfolioUrl: tutorData?.portfolioUrl || "",
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
        subjectIds: value.subjectIds,
        skillIds: value.skillIds,
        headline: value.headline || null,
        currentRoleOrInstitution: value.currentRoleOrInstitution || null,
        linkedinUrl: value.linkedinUrl || null,
        githubUrl: value.githubUrl || null,
        portfolioUrl: value.portfolioUrl || null,
        experienceYears: Number(value.experienceYears),
        hourlyRate: Number(value.hourlyRate),
      };

      const updatePayload = {
        categoriesId: value.categoryId || undefined,
        bio: value.bio || undefined,
        subjectIds: value.subjectIds,
        skillIds: value.skillIds,
        headline: value.headline || undefined,
        currentRoleOrInstitution: value.currentRoleOrInstitution || undefined,
        linkedinUrl: value.linkedinUrl || undefined,
        githubUrl: value.githubUrl || undefined,
        portfolioUrl: value.portfolioUrl || undefined,
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
          setTutorData(response.data.data as TutorProfile);
          setIsCreating(false);
          setIsEditing(false);
          toast.success("Profile created successfully!", { id: toastId });
        } else {
          const response = await updateTutorProfile(updatePayload);
          if (response.error || !response.data) {
            toast.error(response.error?.message || "Failed to update profile", {
              id: toastId,
            });
            return;
          }
          setTutorData(response.data.data as TutorProfile);
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
                      "subjectIds",
                      tutorData.subjects?.map((subject) => subject.id) || [],
                    );
                    professionalForm.setFieldValue(
                      "skillIds",
                      tutorData.skills?.map((skill) => skill.id) || [],
                    );
                    professionalForm.setFieldValue(
                      "headline",
                      tutorData.headline || "",
                    );
                    professionalForm.setFieldValue(
                      "currentRoleOrInstitution",
                      tutorData.currentRoleOrInstitution || "",
                    );
                    professionalForm.setFieldValue(
                      "linkedinUrl",
                      tutorData.linkedinUrl || "",
                    );
                    professionalForm.setFieldValue(
                      "githubUrl",
                      tutorData.githubUrl || "",
                    );
                    professionalForm.setFieldValue(
                      "portfolioUrl",
                      tutorData.portfolioUrl || "",
                    );
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

      {hasProfile &&
      tutorData?.verificationStatus &&
      tutorData.verificationStatus !== VerificationStatus.APPROVED ? (
        <Card
          className={
            tutorData.verificationStatus === VerificationStatus.REJECTED
              ? "border-red-200 bg-red-50/60 dark:border-red-900 dark:bg-red-950/30"
              : "border-amber-200 bg-amber-50/60 dark:border-amber-900 dark:bg-amber-950/30"
          }
        >
          <CardContent className="flex items-start gap-3 p-4">
            {tutorData.verificationStatus === VerificationStatus.REJECTED ? (
              <ShieldAlert className="mt-0.5 size-5 shrink-0 text-red-600 dark:text-red-400" />
            ) : (
              <BadgeCheck className="mt-0.5 size-5 shrink-0 text-amber-600 dark:text-amber-400" />
            )}
            <div className="space-y-1 text-sm">
              <p className="font-semibold">
                {tutorData.verificationStatus === VerificationStatus.PENDING
                  ? "Verification pending"
                  : "Verification rejected"}
              </p>
              <p className="text-muted-foreground">
                {tutorData.verificationStatus === VerificationStatus.PENDING
                  ? "Your profile is under review by an admin and is not shown in public search yet."
                  : tutorData.rejectionReason ||
                    "Please update your profile and contact support for re-review."}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : null}

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
                  <div className="space-y-2">
                    <Label>Subjects</Label>
                    {isFormEditMode ? (
                      <professionalForm.Field
                        name="subjectIds"
                        children={(field) => {
                          const isInvalid =
                            field.state.meta.isTouched &&
                            !field.state.meta.isValid;
                          return (
                            <Field>
                              <TaxonomyMultiSelect
                                options={initialSubjects}
                                selectedIds={field.state.value}
                                onChange={(ids) => field.handleChange(ids)}
                                disabled={isFormDisableMode}
                                placeholder="Search subjects (e.g. Data Structures)"
                              />
                              {isInvalid && (
                                <FieldError errors={field.state.meta.errors} />
                              )}
                            </Field>
                          );
                        }}
                      />
                    ) : tutorData?.subjects?.length ? (
                      <div className="flex flex-wrap gap-2 rounded-md border bg-muted/30 px-3 py-2">
                        {tutorData.subjects.map((subject) => (
                          <Badge key={subject.id} variant="secondary">
                            {subject.name}
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
                    <Label>Skills</Label>
                    {isFormEditMode ? (
                      <professionalForm.Field
                        name="skillIds"
                        children={(field) => {
                          const isInvalid =
                            field.state.meta.isTouched &&
                            !field.state.meta.isValid;
                          return (
                            <Field>
                              <TaxonomyMultiSelect
                                options={initialSkills}
                                selectedIds={field.state.value}
                                onChange={(ids) => field.handleChange(ids)}
                                disabled={isFormDisableMode}
                                placeholder="Search skills (e.g. React, SQL)"
                              />
                              {isInvalid && (
                                <FieldError errors={field.state.meta.errors} />
                              )}
                            </Field>
                          );
                        }}
                      />
                    ) : tutorData?.skills?.length ? (
                      <div className="flex flex-wrap gap-2 rounded-md border bg-muted/30 px-3 py-2">
                        {tutorData.skills.map((skill) => (
                          <Badge key={skill.id} variant="secondary">
                            {skill.name}
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

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="headline">Headline</Label>
                    {isFormEditMode ? (
                      <professionalForm.Field
                        name="headline"
                        children={(field) => (
                          <Field>
                            <Input
                              id="headline"
                              maxLength={100}
                              placeholder="One-line intro (e.g. Software Engineer helping with DSA)"
                              value={field.state.value}
                              disabled={isFormDisableMode}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                            />
                          </Field>
                        )}
                      />
                    ) : (
                      <p className="rounded-md border bg-muted/30 px-3 py-2 text-sm font-medium">
                        {tutorData?.headline || "-"}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="currentRoleOrInstitution">
                      Current role / institution
                    </Label>
                    {isFormEditMode ? (
                      <professionalForm.Field
                        name="currentRoleOrInstitution"
                        children={(field) => (
                          <Field>
                            <Input
                              id="currentRoleOrInstitution"
                              maxLength={200}
                              placeholder="e.g. Software Engineer at X, or CSE student, BUET"
                              value={field.state.value}
                              disabled={isFormDisableMode}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                            />
                          </Field>
                        )}
                      />
                    ) : (
                      <p className="rounded-md border bg-muted/30 px-3 py-2 text-sm font-medium">
                        {tutorData?.currentRoleOrInstitution || "-"}
                      </p>
                    )}
                  </div>

                  {[
                    {
                      name: "linkedinUrl" as const,
                      label: "LinkedIn URL",
                      placeholder: "https://linkedin.com/in/...",
                    },
                    {
                      name: "githubUrl" as const,
                      label: "GitHub URL",
                      placeholder: "https://github.com/...",
                    },
                    {
                      name: "portfolioUrl" as const,
                      label: "Portfolio URL",
                      placeholder: "https://your-portfolio.com",
                    },
                  ].map((linkField) => (
                    <div key={linkField.name} className="space-y-2">
                      <Label htmlFor={linkField.name}>{linkField.label}</Label>
                      {isFormEditMode ? (
                        <professionalForm.Field
                          name={linkField.name}
                          children={(field) => (
                            <Field>
                              <Input
                                id={linkField.name}
                                placeholder={linkField.placeholder}
                                value={field.state.value}
                                disabled={isFormDisableMode}
                                onChange={(e) =>
                                  field.handleChange(e.target.value)
                                }
                              />
                            </Field>
                          )}
                        />
                      ) : tutorData?.[linkField.name] ? (
                        <a
                          href={tutorData[linkField.name] as string}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block rounded-md border bg-muted/30 px-3 py-2 text-sm font-medium text-brand hover:underline"
                        >
                          {tutorData[linkField.name]}
                        </a>
                      ) : (
                        <p className="rounded-md border bg-muted/30 px-3 py-2 text-sm font-medium">
                          -
                        </p>
                      )}
                    </div>
                  ))}
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
