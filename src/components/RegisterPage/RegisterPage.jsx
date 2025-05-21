"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAuthStore } from "@/store/authStore";
import api from "@/lib/axios";
import { LuEye, LuEyeOff } from "react-icons/lu";

// Yup validation schema for registration form
const validationSchema = Yup.object({
  email: Yup.string().email("Invalid email address").required("Required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Required"),
});

/**
 * Component for user registration using email/password or Google OAuth.
 * Redirects user based on role after successful registration.
 */
export default function RegisterPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [error, setError] = useState("");
  const [selected, setSelected] = useState("fan");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      confirmPassword: "",
      role: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setError("");
        // Register with email/password via backend API
        const response = await api.post("/auth/register", {
          email: values.email,
          password: values.password,
          role: selected,
        });

        const { user } = response.data;
        setUser(user);

        // Redirect based on role
        if (user.role !== "fan") {
          router.push(`/onboarding/${user.role}`);
        } else {
          router.push("/");
        }
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
   * Handles Google OAuth registration.
   * Redirects user to Google OAuth URL.
   */
  const handleGoogleRegister = async () => {
    try {
      setError("");
      if (!formik.values.role) {
        setError("Please select a role before registering with Google.");
        return;
      }

      // Call backend API to start Google OAuth
      const response = await api.post("/auth/google/register", {
        role: formik.values.role,
      });
      // Redirect to Google OAuth URL provided by backend
      window.location.href = response?.data?.url;
      router.push(`/`);
    } catch (error) {
      setError(
        error.response?.data?.error ||
          error.message ||
          "Failed to initiate Google registration"
      );
    }
  };

  return (
    <div className="">
      {/* select Role Tab menu */}
      <form onSubmit={formik.handleSubmit} className="formInputs">
        <div className="text-center mb-[29px] lg:mb-[23px]">
          <h2 className="text-[36px] lg:text-[48px] mb-5 lg:mb-6">Sign Up</h2>
          <p className="text-lg">Choose which type of an user are you. </p>
        </div>

        <div className="flex border-b border-black w-fit mb-[22px]">
          {tabs.map((tab) => (
            <label
              key={tab.id}
              className={`h-10 flex justify-center items-center cursor-pointer w-[160px] text-center transition-all font-medium text-base
            ${
              selected === tab.id
                ? "bg-black outline-2 z-10 outline-[#0C0D06] text-white shadow-tabCustom"
                : "bg-gray-100 text-black"
            }`}
            >
              <input
                type="radio"
                name="role"
                value={tab.id}
                checked={selected === tab.id}
                onChange={() => setSelected(tab.id)}
                className="hidden"
              />
              {tab.label}
            </label>
          ))}
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>

        <div>
          <label htmlFor="email" className="block mb-2">
            Email*
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="mt-0 w-full border border-gray-300 rounded px-3 py-2"
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

        <div>
          <label htmlFor="confirmPassword" className="block mb-2 mt-6">
            Confirm Password*
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Enter Confirm Password"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              aria-label={
                showConfirmPassword ? "Hide password" : "Show password"
              }
            >
              {showConfirmPassword ? (
                <LuEyeOff size={20} />
              ) : (
                <LuEye size={20} />
              )}
            </button>
          </div>
          {formik.touched.confirmPassword && formik.errors.confirmPassword && (
            <p className="text-red-500 text-sm">
              {formik.errors.confirmPassword}
            </p>
          )}
        </div>

        <button type="submit" className="w-full primaryBtn mt-6">
          {formik.isSubmitting ? "Registering..." : "Register"}
        </button>
        <button
          type="button"
          onClick={handleGoogleRegister}
          className="w-full px-4 py-2 mt-3 lg:mt-4 border border-gray-300 bg-white text-gray-700 rounded hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Register with Google
        </button>

        <p className="text-center mt-1 mb-20">
          Already have an account?{" "}
          <a href="/login" className="text-orange hover:underline">
            Login
          </a>
        </p>
      </form>
    </div>
  );
}

const tabs = [
  { id: "fan", label: "Fan" },
  { id: "sports-ambassador", label: "Sport Ambassador" },
  { id: "brand", label: "Brand" },
];
