"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  validatePassword,
  validateEmail,
  validateNID,
  validatePhone,
  getFirebaseErrorMessage,
} from "@/utils/validation";
import { motion } from "framer-motion";
import Swal from "sweetalert2";

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register, loginWithGoogle } = useAuth();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    nidNumber: "",
    contactNumber: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!validateEmail(formData.email)) {
      newErrors.email = "Invalid email address";
    }

    if (!validateNID(formData.nidNumber)) {
      newErrors.nidNumber = "Invalid NID number (must be 10, 13, or 17 digits)";
    }

    if (!validatePhone(formData.contactNumber)) {
      newErrors.contactNumber = "Invalid phone number";
    }

    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.errors.join(", ");
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    const result = await register(
      formData.email,
      formData.password,
      formData.fullName,
      formData.nidNumber,
      formData.contactNumber
    );

    setLoading(false);

    if (result.success) {
      Swal.fire({
        icon: "success",
        title: "Account Created!",
        text: "Your account has been created successfully.",
        timer: 1800,
        showConfirmButton: false,
      });

      const redirectTo = searchParams.get("redirect") || "/";
      setTimeout(() => router.push(redirectTo), 1800);
    } else {
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: getFirebaseErrorMessage(result.error),
      });
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    const result = await loginWithGoogle();
    setLoading(false);

    if (result.success) {
      Swal.fire({
        icon: "success",
        title: "Signed In!",
        text: "Google sign-in successful.",
        timer: 1500,
        showConfirmButton: false,
      });

      const redirectTo = searchParams.get("redirect") || "/";
      setTimeout(() => router.push(redirectTo), 1500);
    } else {
      Swal.fire({
        icon: "error",
        title: "Google Sign-in Failed",
        text: getFirebaseErrorMessage(result.error),
      });
    }
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-100 mb-2">
            Create Account
          </h1>
          <p className="text-gray-300">
            Join CareNest and find trusted caregivers
          </p>
        </div>

        <div className="rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {[
              { label: "Full Name", name: "fullName", type: "text" },
              { label: "Email Address", name: "email", type: "email" },
              { label: "NID Number", name: "nidNumber", type: "text" },
              { label: "Contact Number", name: "contactNumber", type: "tel" },
              { label: "Password", name: "password", type: "password" },
              {
                label: "Confirm Password",
                name: "confirmPassword",
                type: "password",
              },
            ].map(({ label, name, type }) => (
              <div key={name}>
                <label className="block text-sm font-medium text-gray-100 mb-2">
                  {label} *
                </label>
                <input
                  type={type}
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors[name] ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors[name] && (
                  <p className="mt-1 text-sm text-red-500">{errors[name]}</p>
                )}
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 text-white rounded-lg font-semibold hover:scale-105 transition-all disabled:opacity-50"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-600 text-gray-100">
                Or continue with
              </span>
            </div>
          </div>

          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-500 flex items-center justify-center gap-3"
          >
            <span>Sign up with Google</span>
          </button>

          <p className="mt-6 text-center text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 font-semibold">
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
