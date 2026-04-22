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
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { toast } from "@/components/ui/sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Lock, Mail } from "lucide-react";

const formSchema = z.object({
  email: z.string().email("Invalid email!"),
  password: z.string(),
});

export default function LoginForm() {
  const router = useRouter();

  // const handleGoogleLogin = async () => {
  //   try {
  //     const { data, error } = await authClient.signIn.social({
  //       provider: "google",
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

  const handleEmailVerification = async () => {
    setVerificationLoading(true);
    const toastId = toast.loading("Sending verification email...");

    try {
      await authClient.sendVerificationEmail({
        email: verificationEmail,
        callbackURL: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/login`,
      });

      toast.success("Verification email sent! Please check your inbox.", {
        id: toastId,
      });
    } catch (error) {
      toast.error("Failed to send verification email. Please try again.", {
        id: toastId,
      });
    } finally {
      setVerificationLoading(false);
    }
  };

  const handleRequestResetPassword = async (email: string) => {
    await authClient.requestPasswordReset({
      email: email,
      redirectTo: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/reset-password`,
    });
  };

  const [loading, setLoading] = useState(false);
  const [verificationLoading, setVerificationLoading] = useState(false);

  const [showVerifyButton, setShowVerifyButton] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState("");

  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetPasswordEmail, setResetPasswordEmail] = useState("");
  const [resetEmailSent, setResetEmailSent] = useState(false);

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: { onChange: formSchema },
    onSubmit: async ({ value }) => {
      setLoading(true);
      const toastId = toast.loading("Logging...");

      try {
        const { data, error } = await authClient.signIn.email({
          email: value.email,
          password: value.password,
        });

        if (error?.code === "EMAIL_NOT_VERIFIED") {
          toast.warning("Please verify your email first!", { id: toastId });
          setVerificationEmail(value.email);
          setShowVerifyButton(true);
          return;
        }

        if (error) {
          toast.error(error.message, { id: toastId });
          return;
        }

        toast.success("Login successful!", {
          id: toastId,
        });
        router.push("/");
      } catch (error) {
        toast.error("An unexpected error occurred. Please try again.", {
          id: toastId,
        });
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <Card className="mx-auto my-6 w-full max-w-xl rounded-2xl border border-border/70 bg-card/80 shadow-sm ">
      {showResetPassword ? (
        <>
          <CardHeader>
            <button
              type="button"
              onClick={() => {
                setShowResetPassword(false);
                setResetEmailSent(false);
                setResetPasswordEmail("");
              }}
              className="mb-4 flex w-fit items-center gap-2 text-muted-foreground transition-colors hover:text-brand"
            >
              <ArrowLeft className="size-4" />
              <span className="text-sm">Back to login</span>
            </button>
            <CardTitle className="ui-title-auth mb-2">
              Forgot Password?
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {resetEmailSent
                ? "Check your email for password reset instructions"
                : "Enter your email address and we'll send you a link to reset your password"}
            </CardDescription>
          </CardHeader>

          <CardContent className="py-6 sm:py-12 flex flex-col justify-center">
            {resetEmailSent ? (
              <div className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <Mail className="size-8 text-green-600 dark:text-green-400" />
                </div>
                <p className="text-muted-foreground">
                  We've sent a password reset link to{" "}
                  <span className="font-semibold text-brand">
                    {resetPasswordEmail}
                  </span>
                </p>
                <p className="text-sm text-muted-foreground">
                  Didn't receive the email? Check your spam folder or{" "}
                  <button
                    type="button"
                    onClick={() => setResetEmailSent(false)}
                    className="text-brand hover:underline font-medium"
                  >
                    try again
                  </button>
                </p>
              </div>
            ) : (
              <form
                className="space-y-5"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (resetPasswordEmail) {
                    handleRequestResetPassword(resetPasswordEmail);
                    setResetEmailSent(true);
                  }
                }}
              >
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="reset-password-email">
                      Email
                    </FieldLabel>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type="email"
                        id="reset-password-email"
                        name="reset-password-email"
                        value={resetPasswordEmail}
                        placeholder="example@gmail.com"
                        onChange={(e) => setResetPasswordEmail(e.target.value)}
                        className="rounded-xl border-input bg-background py-4 pl-10 text-foreground"
                        required
                      />
                    </div>
                  </Field>
                </FieldGroup>

                <Button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-brand text-white shadow-sm hover:bg-brand-strong"
                >
                  Send Reset Link
                </Button>
              </form>
            )}
          </CardContent>

          <CardFooter className="flex flex-col gap-5 justify-end">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Remember your password?
                <Button
                  type="button"
                  onClick={() => {
                    setShowResetPassword(false);
                    setResetEmailSent(false);
                    setResetPasswordEmail("");
                  }}
                  className="font-bold text-brand text-sm bg-transparent hover:bg-transparent hover:text-brand-strong hover:underline"
                >
                  Login
                </Button>
              </p>
            </div>
          </CardFooter>
        </>
      ) : (
        <>
          <CardHeader>
            <CardTitle className="ui-title-auth mb-2">Welcome back</CardTitle>
            <CardDescription className="text-muted-foreground">
              Fill in your details to learn more skills
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
                  name="email"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
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

              <FieldGroup>
                <form.Field
                  name="password"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field>
                        <div className="flex justify-between items-center">
                          <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                          <button
                            type="button"
                            onClick={() => setShowResetPassword(true)}
                            className="text-sm text-brand hover:text-brand-strong hover:underline"
                          >
                            Forgot Password?
                          </button>
                        </div>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            type="password"
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            placeholder="••••••••"
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
            </form>
          </CardContent>

          <CardFooter className="flex flex-col gap-5 justify-end ">
            <Button
              form="sign-up"
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-brand text-white shadow-sm hover:bg-brand-strong disabled:opacity-50"
            >
              {loading ? "Logging..." : "Login"}
            </Button>
            {showVerifyButton && (
              <Button
                type="button"
                onClick={handleEmailVerification}
                disabled={verificationLoading}
                className="bg-transparent p-0 text-brand shadow-none hover:bg-transparent hover:underline disabled:opacity-50"
              >
                {verificationLoading
                  ? "Sending..."
                  : "Resend Verification Email"}
              </Button>
            )}
            {/* <p className="text-sm">or</p>
            <Button
              type="submit"
              onClick={handleGoogleLogin}
              className="w-full bg-brand hover:bg-brand-strong text-white dark:text-black font-bold rounded-xl shadow-lg shadow-primary/20 disabled:opacity-50"
            >
              Log in with google
            </Button> */}

            <div className="mt-8 text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?
                <Link
                  className="ml-1 font-bold text-brand hover:text-brand-strong hover:underline"
                  href="/signup"
                >
                  Register
                </Link>
              </p>
            </div>
          </CardFooter>
        </>
      )}
    </Card>
  );
}
