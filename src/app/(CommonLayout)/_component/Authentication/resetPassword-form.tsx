"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { useForm } from "@tanstack/react-form";
import * as z from "zod";
import { useState } from "react";
import { Lock, KeyRound } from "lucide-react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { toast } from "@/components/ui/sonner";

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const formSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        passwordRegex,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
      ),
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords don't match!",
    path: ["confirmNewPassword"],
  });

export default function ResetPasswordForm() {
  const [loading, setLoading] = useState(false);
  const [passwordReset, setPasswordReset] = useState(false);

  const form = useForm({
    defaultValues: {
      newPassword: "",
      confirmNewPassword: "",
    },
    validators: { onChange: formSchema },
    onSubmit: async ({ value }) => {
      setLoading(true);
      const token = new URLSearchParams(window.location.search).get("token");

      if (!token) {
        toast.error(
          "Invalid or missing token. Please try resetting your password again.",
        );
        return;
      }

      const { data, error } = await authClient.resetPassword({
        newPassword: value.newPassword,
        token,
      });

      if (error) {
        toast.error(
          error.message || "Failed to reset password. Please try again.",
        );
      } else {
        toast.success(
          "Password reset successful! You can now log in with your new password.",
        );
      }
      setPasswordReset(true);
      setLoading(false);
    },
  });

  return (
    <Card className="mx-auto my-6 w-full max-w-xl">
      {passwordReset ? (
        <>
          <CardHeader>
            <CardTitle className="ui-title-auth mb-2">
              Password Reset Successful
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400">
              Your password has been successfully reset
            </CardDescription>
          </CardHeader>

          <CardContent className="py-6 sm:py-12 flex flex-col justify-center">
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <KeyRound className="size-8 text-green-600 dark:text-green-400" />
              </div>
              <p className="text-slate-600 dark:text-slate-400">
                You can now log in with your new password
              </p>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-5 justify-end">
            <Link href="/login" className="w-full">
              <Button className="w-full bg-brand hover:bg-brand-strong text-white font-bold rounded-xl shadow-lg shadow-primary/20">
                Go to Login
              </Button>
            </Link>
          </CardFooter>
        </>
      ) : (
        <>
          <CardHeader>
            <CardTitle className="ui-title-auth mb-2">
              Reset Password
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400">
              Enter your new password below
            </CardDescription>
          </CardHeader>

          <CardContent className="py-6 sm:py-12 flex flex-col justify-center">
            <form
              id="reset-password"
              className="space-y-5"
              onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
              }}
            >
              <FieldGroup>
                <form.Field
                  name="newPassword"
                  children={(field) => {
                    const isInvalid =
                      (field.state.meta.isTouched ||
                        field.state.value.length > 0) &&
                      !field.state.meta.isValid;
                    return (
                      <Field>
                        <FieldLabel htmlFor={field.name}>
                          New Password
                        </FieldLabel>
                        <div className="relative">
                          <Lock className="absolute size-5 left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl" />
                          <Input
                            type="password"
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            placeholder="••••••••"
                            onChange={(e) => field.handleChange(e.target.value)}
                            className="pl-10 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl"
                          />
                        </div>
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                />
              </FieldGroup>

              <FieldGroup>
                <form.Field
                  name="confirmNewPassword"
                  children={(field) => {
                    const isInvalid =
                      (field.state.meta.isTouched ||
                        field.state.value.length > 0) &&
                      !field.state.meta.isValid;
                    return (
                      <Field>
                        <FieldLabel htmlFor={field.name}>
                          Confirm New Password
                        </FieldLabel>
                        <div className="relative">
                          <Lock className="absolute size-5 left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl" />
                          <Input
                            type="password"
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            placeholder="••••••••"
                            onChange={(e) => field.handleChange(e.target.value)}
                            className="pl-10 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl"
                          />
                        </div>
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                />
              </FieldGroup>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col gap-5 justify-end">
            <Button
              form="reset-password"
              type="submit"
              disabled={loading}
              className="w-full bg-brand hover:bg-brand-strong text-white font-bold rounded-xl shadow-lg shadow-primary/20 disabled:opacity-50"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </Button>

            <div className="text-center">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Remember your password?
                <Link
                  className="text-brand-strong hover:text-brand-strong font-bold hover:underline ml-1"
                  href="/login"
                >
                  Login
                </Link>
              </p>
            </div>
          </CardFooter>
        </>
      )}
    </Card>
  );
}

