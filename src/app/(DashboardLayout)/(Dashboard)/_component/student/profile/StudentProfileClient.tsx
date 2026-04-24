"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BadgeCheck, Camera, PencilLine, Save, UserRound } from "lucide-react";
import { ChangeEvent, useRef, useState } from "react";
import * as z from "zod";
import default_avatar from "../../../../../../public/default-avatar-profile.jpg";
import { toast } from "@/components/ui/sonner";
import { useForm } from "@tanstack/react-form";
import { authClient } from "@/lib/auth-client";
import { Field, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateUser } from "@/action/user.action";

const BD_PHONE_REGEX = /^(?:\+?88)?01[3-9]\d{8}$/;

const StudentAccountSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .refine(
      (val) => val === "" || val === "01XXXXXXXXX" || BD_PHONE_REGEX.test(val),
      "Please enter a valid phone number",
    ),
});

type StudentProfileClientProps = {
  initialName: string;
  initialEmail: string;
  initialPhone: string;
  initialRole: string;
  initialStatus: string;
  initialImage?: string;
};

export default function StudentProfileClient({
  initialName,
  initialEmail,
  initialPhone,
  initialRole,
  initialStatus,
  initialImage,
}: StudentProfileClientProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [mainEmail, setMainEmail] = useState(initialEmail);
  const [phone, setPhone] = useState(initialPhone);
  const [role] = useState(initialRole);
  const [status] = useState(initialStatus);

  const [profileImagePreview, setProfileImagePreview] = useState<string>(
    initialImage || default_avatar.src,
  );

  const fileInputRef = useRef<HTMLInputElement>(null);
  const selectedFileRef = useRef<File | null>(null);

  const form = useForm({
    defaultValues: {
      name,
      email,
      phone,
    },
    validators: { onSubmit: StudentAccountSchema },
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

      const updatedData: { name: string; phone: string } = {
        name: value.name,
        phone: value.phone,
      };

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
            "A verification email has been sent to your new email address. Your email will be updated once verified.",
            { id: toastId },
          );
          return;
        }

        if (!response?.data) {
          toast.error("Failed to save profile changes. Please try again.", {
            id: toastId,
          });
          return;
        }

        setName(value.name);
        setEmail(value.email);
        setMainEmail(value.email);
        setPhone(value.phone);

        const latestImage = response.data?.data?.image;
        if (latestImage) {
          setProfileImagePreview(latestImage);
        }

        selectedFileRef.current = null;
        setIsEditing(false);
        toast.success("Profile updated successfully!", { id: toastId });
      } catch {
        toast.error(
          "Something went wrong while saving your profile. Please try again.",
          { id: toastId },
        );
      }
    },
  });

  const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    selectedFileRef.current = file;
    setProfileImagePreview(URL.createObjectURL(file));
  };

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 p-4">
      <Card className="overflow-hidden border-border/70 bg-linear-to-r from-orange-50 via-white to-amber-50 dark:from-card dark:via-card dark:to-card">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <CardTitle className="ui-title-panel">Student Profile</CardTitle>
            <CardDescription>Student information.</CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsEditing(true);
                form.setFieldValue("name", name);
                form.setFieldValue("email", email);
                form.setFieldValue("phone", phone);
              }}
            >
              <PencilLine className="mr-2 size-4" suppressHydrationWarning />
              Edit Profile
            </Button>
          </div>
        </CardHeader>
      </Card>

      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserRound className="size-4 text-brand" suppressHydrationWarning />
            Account details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form
            id="profileForm"
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
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
                  disabled={!isEditing}
                />
                {isEditing ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={!isEditing}
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
                {isEditing ? (
                  <form.Field
                    name="name"
                    children={(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid;
                      return (
                        <Field>
                          <Input
                            id="name"
                            value={field.state.value}
                            disabled={!isEditing}
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
                {isEditing ? (
                  <form.Field
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
                            disabled={!isEditing}
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
                {isEditing ? (
                  <form.Field
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
                            disabled={!isEditing}
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
          </form>

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
        <CardFooter className="flex justify-center">
          <div className="mt-15 flex flex-wrap justify-center gap-2">
            <Button
              className="bg-brand text-white hover:bg-brand-strong"
              disabled={!isEditing}
              form="profileForm"
              type="submit"
            >
              <Save className="mr-2 size-4" suppressHydrationWarning />
              Save Changes
            </Button>

            <Button
              variant="outline"
              disabled={!isEditing}
              onClick={() => {
                setIsEditing(false);
                selectedFileRef.current = null;
              }}
            >
              Cancel
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
