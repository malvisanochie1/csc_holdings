"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { getCountryCallingCode, getCountries } from "react-phone-number-input/input";
import { useRegister } from "@/lib/api/auth";
import type { ApiErrors } from "@/lib/types/api";
import { Eye, EyeOff, Shield, User, Mail, Phone, Globe, Lock, CheckCircle2 } from "lucide-react";
import "react-phone-number-input/style.css";

type RegisterForm = {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  country: string;
  country_code: string;
  selected_country_code: string;
  password: string;
  password_confirmation: string;
};

type StatusState = {
  type: "success" | "error";
  text: string;
} | null;

const initialForm: RegisterForm = {
  username: "",
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  country: "",
  country_code: "",
  selected_country_code: "",
  password: "",
  password_confirmation: "",
};

const RegisterPage = () => {
  const router = useRouter();
  const registerMutation = useRegister();
  const [form, setForm] = React.useState<RegisterForm>(initialForm);
  const [status, setStatus] = React.useState<StatusState>(null);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const requestError =
    registerMutation.error as (Error & { errors?: ApiErrors }) | null;

  const handleChange = (field: keyof RegisterForm) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const getCountryName = (countryCode: string) => {
    const names = new Intl.DisplayNames(['en'], {type: 'region'});
    try {
      return names.of(countryCode);
    } catch {
      return countryCode;
    }
  };

  const handleCountryChange = (countryCode: string) => {
    const countryName = getCountryName(countryCode);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const callingCode = getCountryCallingCode(countryCode as any);
    setForm((prev) => ({ 
      ...prev, 
      country: countryName || countryCode,
      country_code: callingCode,
      selected_country_code: countryCode
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus(null);

    if (form.password !== form.password_confirmation) {
      setStatus({ type: "error", text: "Passwords do not match." });
      return;
    }

    // Extract only the fields needed for API
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { selected_country_code, ...apiPayload } = form;
    registerMutation.mutate(apiPayload, {
      onSuccess: () => {
        setStatus({ type: "success", text: "Account created! Redirecting..." });
        setTimeout(() => router.push("/dashboard"), 250);
      },
      onError: (error) => {
        setStatus({ type: "error", text: error.message });
      },
    });
  };

  const fieldError = (field: keyof RegisterForm) =>
    requestError?.errors?.[field]?.[0];

  return (
    <div className="min-h-screen home-bg flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900/20"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(59,130,246,0.15)_1px,transparent_0)] [background-size:24px_24px] dark:bg-[radial-gradient(circle_at_1px_1px,rgba(147,197,253,0.08)_1px,transparent_0)]"></div>
      
      <div className="relative w-full max-w-md mx-auto">
        {/* Card */}
        <div className="card border border-slate-200/60 dark:border-slate-700/60 shadow-2xl shadow-blue-500/10 dark:shadow-purple-500/20 backdrop-blur-sm bg-white/95 dark:bg-slate-900/95 p-6">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl mb-3 shadow-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
              Create Account
            </h1>
            <p className="text-blue-600 dark:text-blue-400 font-semibold text-sm">CSC ESCROW & SETTLEMENT UK</p>
            <p className="text-gray-600 dark:text-gray-300 text-xs mt-1">
              Secure platform for asset recovery
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <FieldSet>
              <FieldGroup className="space-y-3">
                {/* Username */}
                <Field>
                  <FieldLabel htmlFor="username" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Username
                  </FieldLabel>
                  <Input
                    className="h-9 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-all duration-200 bg-white dark:bg-gray-800 text-sm"
                    type="text"
                    id="username"
                    placeholder="john_doe"
                    value={form.username}
                    onChange={handleChange("username")}
                    autoComplete="username"
                    aria-invalid={Boolean(fieldError("username"))}
                  />
                  {fieldError("username") && (
                    <p className="text-xs text-red-500 mt-1">{fieldError("username")}</p>
                  )}
                </Field>

                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-3">
                  <Field>
                    <FieldLabel htmlFor="first_name" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      First Name
                    </FieldLabel>
                    <Input
                      className="h-9 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-all duration-200 bg-white dark:bg-gray-800 text-sm"
                      type="text"
                      id="first_name"
                      placeholder="John"
                      value={form.first_name}
                      onChange={handleChange("first_name")}
                      autoComplete="given-name"
                      aria-invalid={Boolean(fieldError("first_name"))}
                    />
                    {fieldError("first_name") && (
                      <p className="text-xs text-red-500 mt-1">{fieldError("first_name")}</p>
                    )}
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="last_name" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Last Name
                    </FieldLabel>
                    <Input
                      className="h-9 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-all duration-200 bg-white dark:bg-gray-800 text-sm"
                      type="text"
                      id="last_name"
                      placeholder="Doe"
                      value={form.last_name}
                      onChange={handleChange("last_name")}
                      autoComplete="family-name"
                      aria-invalid={Boolean(fieldError("last_name"))}
                    />
                    {fieldError("last_name") && (
                      <p className="text-xs text-red-500 mt-1">{fieldError("last_name")}</p>
                    )}
                  </Field>
                </div>

                {/* Email */}
                <Field>
                  <FieldLabel htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </FieldLabel>
                  <Input
                    className="h-9 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-all duration-200 bg-white dark:bg-gray-800 text-sm"
                    type="email"
                    id="email"
                    placeholder="john.doe@example.com"
                    value={form.email}
                    onChange={handleChange("email")}
                    autoComplete="email"
                    aria-invalid={Boolean(fieldError("email"))}
                  />
                  {fieldError("email") && (
                    <p className="text-xs text-red-500 mt-1">{fieldError("email")}</p>
                  )}
                </Field>

                {/* Country */}
                <Field>
                  <FieldLabel htmlFor="country" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    Country
                  </FieldLabel>
                  <div className="relative">
                    <select
                      className="h-9 w-full pl-3 pr-8 border border-gray-300 dark:border-gray-600 rounded-md focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-all duration-200 bg-white dark:bg-gray-800 dark:text-white appearance-none text-sm"
                      id="country"
                      value={form.selected_country_code}
                      onChange={(e) => handleCountryChange(e.target.value)}
                      aria-invalid={Boolean(fieldError("country"))}
                    >
                      <option value="">Select country</option>
                      {getCountries().map((country) => (
                        <option key={country} value={country}>
                          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                          {getCountryName(country)} (+{getCountryCallingCode(country as any)})
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  {fieldError("country") && (
                    <p className="text-xs text-red-500 mt-1">{fieldError("country")}</p>
                  )}
                </Field>

                {/* Phone */}
                <Field>
                  <FieldLabel htmlFor="phone" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Phone Number
                  </FieldLabel>
                  <div className="flex gap-2">
                    {form.country_code && (
                      <div className="flex items-center px-3 py-1 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-xs font-semibold text-gray-700 dark:text-gray-300 h-9 min-w-[60px] justify-center">
                        +{form.country_code}
                      </div>
                    )}
                    <Input
                      className="h-9 flex-1 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-all duration-200 bg-white dark:bg-gray-800 text-sm"
                      type="tel"
                      id="phone"
                      placeholder="123-456-7890"
                      value={form.phone}
                      onChange={handleChange("phone")}
                      autoComplete="tel"
                      aria-invalid={Boolean(fieldError("phone"))}
                    />
                  </div>
                  {fieldError("phone") && (
                    <p className="text-xs text-red-500 mt-1">{fieldError("phone")}</p>
                  )}
                </Field>

                {/* Password Fields */}
                <div className="grid grid-cols-2 gap-3">
                  <Field>
                    <FieldLabel htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      Password
                    </FieldLabel>
                    <div className="relative">
                      <Input
                        className="h-9 pr-9 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-all duration-200 bg-white dark:bg-gray-800 text-sm"
                        type={showPassword ? "text" : "password"}
                        id="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange("password")}
                        autoComplete="new-password"
                        aria-invalid={Boolean(fieldError("password"))}
                      />
                      <button
                        type="button"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {fieldError("password") && (
                      <p className="text-xs text-red-500 mt-1">{fieldError("password")}</p>
                    )}
                  </Field>

                  <Field>
                    <FieldLabel
                      htmlFor="password_confirmation"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2"
                    >
                      <Lock className="w-4 h-4" />
                      Confirm
                    </FieldLabel>
                    <div className="relative">
                      <Input
                        className="h-9 pr-9 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-all duration-200 bg-white dark:bg-gray-800 text-sm"
                        type={showConfirmPassword ? "text" : "password"}
                        id="password_confirmation"
                        placeholder="Confirm"
                        value={form.password_confirmation}
                        onChange={handleChange("password_confirmation")}
                        autoComplete="new-password"
                        aria-invalid={Boolean(fieldError("password_confirmation"))}
                      />
                      <button
                        type="button"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {fieldError("password_confirmation") && (
                      <p className="text-xs text-red-500 mt-1">{fieldError("password_confirmation")}</p>
                    )}
                  </Field>
                </div>
              </FieldGroup>
            </FieldSet>

            {/* Status Message */}
            {status && (
              <div
                className={`rounded-md p-3 flex items-center gap-2 text-sm ${
                  status.type === "error" 
                    ? "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300" 
                    : "bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300"
                }`}
                aria-live="polite"
              >
                {status.type === "success" ? (
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full bg-red-600 dark:bg-red-500 flex-shrink-0 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">!</span>
                  </div>
                )}
                <p className="font-medium">{status.text}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full h-9 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-md transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-blue-500/25 dark:shadow-purple-500/25 text-sm"
              disabled={registerMutation.isPending}
            >
              <div className="flex items-center justify-center gap-2">
                {registerMutation.isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4" />
                    Create Account
                  </>
                )}
              </div>
            </button>
          </form>
          
          {/* Login Link */}
          <div className="text-center mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link
                href="/login"
                className="font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;