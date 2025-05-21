"use client";

import api from "@/lib/axios";
import { useAuthStore } from "@/store/authStore";
import IconsLibrary from "@/util/IconsLibrary";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { useState } from "react";
import * as Yup from "yup";
import { LuEye, LuEyeOff } from "react-icons/lu";

// Validation schema for email and password
const validationSchema = Yup.object({
  email: Yup.string().email("Invalid email address").required("Required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Required"),
});

/**
 * Component for handling user login with email/password or Google OAuth.
 * Also supports password reset requests.
 */
export default function UserLogin() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { setUser, fetchUser } = useAuthStore();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    /**
     * Handles login form submission.
     * Authenticates user and redirects based on role and profile completion.
     * @param {Object} values - The form values containing email and password.
     */
    onSubmit: async (values) => {
      try {
        setError("");
        const response = await api.post("/auth/login", {
          email: values.email,
          password: values.password,
        });

        const { user } = response.data;
        setUser(user);

        const fullUser = await fetchUser();

        const redirectUrl =
          user?.isProfileCompleted && fullUser.role !== "fan"
            ? `/${user.role}`
            : user.role !== "fan"
            ? `/onboarding/${user.role}`
            : "/";
        router.push(redirectUrl);
      } catch (error) {
        setError(
          error.response?.data?.error ||
            error.message ||
            "An unexpected error occurred"
        );
      }
    },
  });

  /**
   * Initiates the Google OAuth login flow.
   */
  const handleGoogleLogin = async () => {
    try {
      setError("");
      const response = await api.post("/auth/google/login");
      window.location.href = response.data.url;
    } catch (error) {
      setError(
        error.response?.data?.error ||
          error.message ||
          "Failed to initiate Google login"
      );
    }
  };

  /**
   * Sends a password reset email for the given email address.
   */
  const handlePasswordReset = async () => {
    if (!formik.values.email) {
      setError("Please enter your email address");
      return;
    }

    try {
      setError("");
      const response = await api.post("/auth/reset-password", {
        email: formik.values.email,
      });
      setResetMessage("Password reset email sent. Please check your inbox.");
    } catch (error) {
      setError(
        error.response?.data?.error ||
          error.message ||
          "Failed to send password reset email"
      );
    }
  };

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <div className="text-center mb-[29px] lg:mb-[23px]">
          <h2 className="text-[36px] lg:text-[48px] mb-5 lg:mb-6">Login</h2>
          <p className="text-lg">Enter your credential to get in. </p>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}
        {resetMessage && (
          <p className="text-green-400 text-sm">{resetMessage}</p>
        )}
        <div>
          <label htmlFor="email" className="block mb-2">
            Email*
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Enter Email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
          {formik.touched.email && formik.errors.email && (
            <p className="text-red-500 text-sm">{formik.errors.email}</p>
          )}
        </div>
        <div>
          <label htmlFor="password" className="block mb-2 mt-6">
            Password*
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <LuEyeOff size={20} /> : <LuEye size={20} />}
            </button>
          </div>
          {formik.touched.password && formik.errors.password && (
            <p className="text-red-500 text-sm">{formik.errors.password}</p>
          )}
        </div>

        <button
          type="button"
          onClick={handlePasswordReset}
          className="text-right text-sm w-full my-2"
        >
          Forgot Password?
        </button>

        <button
          type="submit"
          disabled={formik.isSubmitting}
          className="w-full primaryBtn"
        >
          Login with Email
        </button>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="btn w-full border-0 rounded-full py-2 mt-4 mb-1 text-textColor flex gap-2 items-center justify-center"
        >
          <IconsLibrary name="solidGoogle" /> Login with Google
        </button>

        <p className="text-center">
          Don't have an account?{" "}
          <button
            onClick={() => router.push("/register")}
            className="text-orange hover:underline"
          >
            Register
          </button>
        </p>
      </form>
    </>
  );
}
