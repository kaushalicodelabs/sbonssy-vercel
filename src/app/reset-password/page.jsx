"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import createClient from "@/lib/supabase/client";

// Validation schema for password and confirmation
const validationSchema = Yup.object({
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Required"),
});

export default function ResetPassword() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const supabase = createClient();
        const { error } = await supabase.auth.updateUser({
          password: values.password,
        });

        if (error) {
          setError(error.message);
          return;
        }

        setSuccess("Password updated successfully. Redirecting to login...");
        setError("");
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } catch (error) {
        setError(error.message || "An unexpected error occurred");
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={formik.handleSubmit} className="space-y-4 w-96">
        <h2 className="text-2xl font-bold">Reset Password</h2>
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}
        <div>
          <input
            name="password"
            type="password"
            placeholder="New Password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {formik.touched.password && formik.errors.password && (
            <p className="text-red-500">{formik.errors.password}</p>
          )}
        </div>
        <div>
          <input
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {formik.touched.confirmPassword && formik.errors.confirmPassword && (
            <p className="text-red-500">{formik.errors.confirmPassword}</p>
          )}
        </div>
        <button
          type="submit"
          disabled={formik.isSubmitting}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Update Password
        </button>
        <p className="text-center">
          Remembered your password?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Login
          </a>
        </p>
      </form>
    </div>
  );
}
