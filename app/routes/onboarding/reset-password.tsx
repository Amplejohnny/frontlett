import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Input from "~/components/dashboard/input";
import Button from "~/components/ui/button";
import { useNavigate, useLocation } from "react-router";
import useAuth from "~/stores/authStore";
import { RiLockPasswordLine } from "react-icons/ri";
import type { Route } from "./+types/verify-code";

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");
  if (!token) throw new Error("Missing reset token");
  return { token };
}

const schema = yup
  .object({
    password: yup
      .string()
      .required("Password is required")
      .min(8, "Minimum 8 characters"),
    confirmPassword: yup
      .string()
      .required("Please confirm your password")
      .oneOf([yup.ref("password")], "Confirm Password must match Password"),
  })
  .required();

const ResetPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { resetPassword } = useAuth();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const emailParam = query.get("email");
    const tokenParam = query.get("token");

    if (emailParam && tokenParam) {
      setEmail(emailParam);
      setToken(tokenParam);
    } else {
      navigate("/forgot-password");
    }
  }, [location.search, navigate]);

  const onSubmit = async (data: any) => {
    try {
      await resetPassword({
        email,
        password: data.password,
        token,
      });
      setSuccess(true);
    } catch (err: any) {
      alert(err.general || "Failed to reset password");
    }
  };

  if (success) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4 font-general">
        <div className="flex flex-col items-center gap-6 w-full max-w-md text-center">
          <img
            src="/images/done-ring-round.png"
            alt="Success"
            className="w-full h-full object-cover rounded-xl"
          />
          <h2 className="text-xl lg:text-3xl font-bold">Reset Password</h2>
          <p className="text-gray-600 dark:text-neutral-300">
            Now continue your logistics journey.
          </p>
          <Button className="w-full" onClick={() => navigate("/login")}>
            Continue to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-4 font-general">
      <div className="flex flex-col items-center gap-6 w-full max-w-md">
        <h2 className="text-xl lg:text-3xl font-bold text-center">
          Reset Your Password
        </h2>
        <p className="text-center text-gray-600 dark:text-neutral-300">
          Welcome back! Let’s secure your account so you can continue <br />
          your flexible work journey
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full flex flex-col gap-4"
        >
          <Input
            {...register("password")}
            type="password"
            label="New Password"
            icon={RiLockPasswordLine}
            placeholder="Create a strong password"
            error={errors.password?.message}
          />
          <Input
            {...register("confirmPassword")}
            type="password"
            label="Confirm Password"
            icon={RiLockPasswordLine}
            placeholder="Retype your new password"
            error={errors.confirmPassword?.message}
          />
          <Button
            type="submit"
            disabled={!isValid}
            className="w-full disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Reset Password
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
