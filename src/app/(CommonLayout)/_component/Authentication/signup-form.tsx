"use client";

import { useState } from "react";
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
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { useForm } from "@tanstack/react-form";
import * as z from "zod";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { toast } from "@/components/ui/sonner";
import { UserRole } from "@/constants/roles";
import { Lock, Mail, User } from "lucide-react";
import { normalizeText } from "@/helpers/textNormalizer";

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const formSchema = z
  .object({
    role: z.nativeEnum(UserRole, { message: "Role is required!" }),
    name: z.string().min(1, "Full Name is required!"),
    email: z.string().email("Invalid email!"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        passwordRegex,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match!",
    path: ["confirmPassword"],
  });

export default function SignupForm() {
  // const handleGoogleLogin = async () => {
  //   try {
  //     const { data, error } = await authClient.signIn.social({
  //       provider: "google",
  //       callbackURL: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/`,
  //     });

  //     if (error) {
  //       toast.error(`Google login failed: ${error.message}`);
  //       console.error("Google login error:", error);
  //       return;
  //     }

  //     // router.push("/");
  //   } catch (error) {
  //     console.error("Google login exception:", error);
  //     toast.error("An error occurred during Google login");
  //   }
  // };
  const [loading, setLoading] = useState(false);
  const form = useForm({
    defaultValues: {
      role: UserRole.STUDENT,
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validators: { onChange: formSchema },
    onSubmit: async ({ value }) => {
      setLoading(true);
      const toastId = toast.loading("Creating user...");

      try {
        const userData = {
          name: normalizeText(value.name),
          email: value.email,
          password: value.password,
          role: value.role,
        };
        const { data, error } = await authClient.signUp.email(userData);

        if (error) {
          toast.error(error.message, { id: toastId });
          return;
        }

        toast.success("Verification email sent! Please check your inbox.", {
          id: toastId,
        });
      } catch (error: any) {
        toast.error(error.message, { id: toastId });
      } finally {
        setLoading(false);
      }
    },
  });
  const [passwordValue, setPasswordValue] = useState("");
  const [confirmPasswordValue, setConfirmPasswordValue] = useState("");
  const passwordsMatch =
    passwordValue.length > 0 && passwordValue === confirmPasswordValue;
  return (
    <Card className="mx-auto w-full max-w-xl rounded-2xl border border-border/70 bg-card/80 shadow-sm lg:mx-0 lg:max-w-none lg:rounded-none lg:rounded-r-2xl">
      <CardHeader>
        <CardTitle className="ui-title-auth mb-2">Create Account</CardTitle>
        <CardDescription className="text-muted-foreground">
          Fill in your details to get started
        </CardDescription>
      </CardHeader>

      <CardContent className="py-6 sm:py-12 flex flex-col justify-center">
        <form
          id="sign-up"
          className="space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <FieldGroup>
            <form.Field
              name="role"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field>
                    <FieldLabel htmlFor={field.name}>
                      I am joining as a:
                    </FieldLabel>
                    <ToggleGroup
                      type="single"
                      id={field.name}
                      value={field.state.value}
                      onValueChange={(value) =>
                        field.handleChange(value as UserRole)
                      }
                      className="flex rounded-xl border border-input bg-background p-1"
                    >
                      <ToggleGroupItem
                        value={UserRole.STUDENT}
                        className="flex-1  rounded-lg text-sm font-bold data-[state=on]:bg-brand data-[state=on]:text-white"
                      >
                        Student
                      </ToggleGroupItem>

                      <ToggleGroupItem
                        value={UserRole.TUTOR}
                        className="flex-1  rounded-lg text-sm font-bold data-[state=on]:bg-brand data-[state=on]:text-white"
                      >
                        Tutor
                      </ToggleGroupItem>
                    </ToggleGroup>
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
              name="name"
              children={(field) => {
                const isInvalid =
                  (field.state.meta.isTouched ||
                    field.state.value.length > 0) &&
                  !field.state.meta.isValid;
                return (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Full Name</FieldLabel>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type="text"
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        placeholder="Enter your full name"
                        onChange={(e) => field.handleChange(e.target.value)}
                        className="rounded-xl border-input bg-background py-4 pl-10 text-foreground"
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
              name="email"
              children={(field) => {
                const isInvalid =
                  (field.state.meta.isTouched ||
                    field.state.value.length > 0) &&
                  !field.state.meta.isValid;
                return (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type="email"
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        placeholder="example@gmail.com"
                        onChange={(e) => field.handleChange(e.target.value)}
                        className="rounded-xl border-input bg-background py-4 pl-10 text-foreground"
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

          <FieldGroup className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <form.Field
              name="password"
              children={(field) => {
                const isInvalid =
                  (field.state.meta.isTouched ||
                    field.state.value.length > 0) &&
                  !field.state.meta.isValid;
                return (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type="password"
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        placeholder="••••••••"
                        onChange={(e) => {
                          const v = e.target.value;
                          field.handleChange(v);
                          setPasswordValue(v);
                        }}
                        className="rounded-xl border-input bg-background py-4 pl-10 text-foreground"
                      />
                    </div>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />

            <form.Field
              name="confirmPassword"
              children={(field) => {
                const isInvalid =
                  (field.state.meta.isTouched ||
                    field.state.value.length > 0) &&
                  !field.state.meta.isValid;
                return (
                  <Field>
                    <FieldLabel htmlFor={field.name}>
                      Confirm Password
                    </FieldLabel>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type="password"
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        placeholder="••••••••"
                        onChange={(e) => {
                          const v = e.target.value;
                          field.handleChange(v);
                          setConfirmPasswordValue(v);
                        }}
                        className="rounded-xl border-input bg-background py-4 pl-10 text-foreground"
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
      <CardFooter className="flex flex-col gap-5 justify-end ">
        <Button
          form="sign-up"
          type="submit"
          disabled={loading || !passwordsMatch}
          className="w-full py-4 rounded-xl bg-brand text-white shadow-sm hover:bg-brand-strong disabled:opacity-50"
        >
          {loading ? "Verification mail sending..." : "Create Account"}
        </Button>
        {/* <p className="text-sm">or</p>
        <Button
          type="submit"
          onClick={handleGoogleLogin}
          className="w-full bg-brand hover:bg-brand-strong text-white dark:text-black font-bold  py-4 rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          Continue with google
        </Button> */}

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?
            <Link
              className="text-brand hover:text-brand-strong font-bold hover:underline ml-1"
              href="/login"
            >
              Login
            </Link>
          </p>
        </div>
      </CardFooter>
    </Card>
  );
}
