import React, { useState } from "react";
import { LuMail } from "react-icons/lu";
import { useForm } from "react-hook-form";
import type { Route } from "./+types/forget-password";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Input from "~/components/dashboard/input";
import Button from "~/components/ui/button";
import { Link } from "react-router";
import useAuth from "~/stores/authStore"; // <-- Import the auth store

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Frontlett - Forgot Password" },
    {
      name: "description",
      content: "Reset your Frontlett account password securely.",
    },
  ];
}

const schema = yup
  .object({
    email: yup
      .string()
      .email("Enter a valid email")
      .required("Email is required"),
  })
  .required();

const maskEmail = (email: string) => {
  const [user, domain] = email.split("@");
  const visibleStart = user.slice(0, 3);
  const visibleEnd = user.slice(-2);
  return `${visibleStart}xxxxx${visibleEnd}@${domain}`;
};

const ForgotPassword = () => {
  const { sendResetLink } = useAuth();

  const [emailSent, setEmailSent] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const email = watch("email");

  const onSubmit = async (data: { email: string }) => {
    setLoading(true);
    setSubmitError("");
    try {
      await sendResetLink(data.email);
      setSubmittedEmail(data.email);
      setEmailSent(true);
    } catch (err: any) {
      setSubmitError(err?.general || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4 font-general">
        <div className="flex flex-col items-center gap-6 w-full max-w-md">
          <h2 className="text-xl lg:text-3xl font-bold text-center">
            Forgot Password
          </h2>
          <p className="text-center text-gray-600 dark:text-neutral-300">
            We’ve sent a mail with password reset information to <br />
            <strong>{maskEmail(submittedEmail)}</strong>
          </p>
          <p className="text-sm text-gray-500 text-center">
            Didn’t receive the email? Check your spam folder or
          </p>
          <Button onClick={() => setEmailSent(false)} className="w-full">
            Resend Mail
          </Button>
          <Link
            to="/login"
            className="w-full text-center text-sm text-gray-600 dark:text-neutral-400 underline"
          >
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-4 font-general">
      <div className="flex flex-col items-center gap-6 w-full max-w-md">
        <h2 className="text-xl lg:text-3xl font-bold text-center">
          Forgot Password
        </h2>
        <p className="text-center text-gray-600 dark:text-neutral-300">
          Enter the email address linked to your Frontlett account.
          <br />
          We’ll send a secure link to reset your password.
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full flex flex-col gap-4"
        >
          <Input
            {...register("email")}
            error={errors.email?.message}
            icon={LuMail}
            placeholder="youremail@mail.com"
            label="Email"
          />
          {submitError && <p className="text-red-500 text-sm">{submitError}</p>}
          <Button
            type="submit"
            disabled={!isValid || loading}
            className="w-full disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {loading ? "Sending..." : "Send Mail"}
          </Button>
          <Link
            to="/login"
            className="w-full text-center text-sm text-gray-600 dark:text-neutral-400 underline"
          >
            Back to Login
          </Link>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
