"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useLogin } from "@/lib/api/auth";
import type { ApiErrors } from "@/lib/types/api";
import { Eye, EyeOff, Shield, Mail, Lock, CheckCircle2 } from "lucide-react";
import { useSiteTitle } from "@/hooks/use-site-title";

type FormState = {
  email: string;
  password: string;
};

type StatusState = {
  type: "success" | "error";
  text: string;
} | null;

const initialForm: FormState = {
  email: "",
  password: "",
};

const LoginPage = () => {
  const router = useRouter();
  const login = useLogin();
  const [form, setForm] = React.useState<FormState>(initialForm);
  const [status, setStatus] = React.useState<StatusState>(null);
  const [showPassword, setShowPassword] = React.useState(false);
  const siteTitle = useSiteTitle();
  const headlineTitle = React.useMemo(() => siteTitle.toUpperCase(), [siteTitle]);

  const requestError = login.error as (Error & { errors?: ApiErrors }) | null;

  const handleChange = (field: keyof FormState) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus(null);
    login.mutate(form, {
      onSuccess: () => {
        setStatus({ type: "success", text: "Login successful. Redirecting..." });
        setTimeout(() => router.push("/dashboard"), 250);
      },
      onError: (error) => {
        setStatus({ type: "error", text: error.message });
      },
    });
  };

  const fieldError = (field: keyof FormState) =>
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
              Welcome Back
            </h1>
            <p className="text-blue-600 dark:text-blue-400 font-semibold text-sm">{headlineTitle}</p>
            <p className="text-gray-600 dark:text-gray-300 text-xs mt-1">
              Sign in to access your secure account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <FieldSet>
              <FieldGroup className="space-y-4">
                {/* Email */}
                <Field>
                  <FieldLabel htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </FieldLabel>
                  <Input
                    className="h-10 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-all duration-200 bg-white dark:bg-gray-800 text-sm"
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

                {/* Password */}
                <Field>
                  <FieldLabel htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Password
                  </FieldLabel>
                  <div className="relative">
                    <Input
                      className="h-10 pr-10 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-all duration-200 bg-white dark:bg-gray-800 text-sm"
                      type={showPassword ? "text" : "password"}
                      id="password"
                      placeholder="Enter your password"
                      value={form.password}
                      onChange={handleChange("password")}
                      autoComplete="current-password"
                      aria-invalid={Boolean(fieldError("password"))}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {fieldError("password") && (
                    <p className="text-xs text-red-500 mt-1">{fieldError("password")}</p>
                  )}
                </Field>

                {/* Forgot Password Link */}
                <div className="flex justify-end">
                  <Link
                    href="/forgot-password"
                    className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
                  >
                    Forgot Password?
                  </Link>
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
              className="w-full h-10 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-md transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-blue-500/25 dark:shadow-purple-500/25 text-sm"
              disabled={login.isPending}
            >
              <div className="flex items-center justify-center gap-2">
                {login.isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Signing in...
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4" />
                    Sign In
                  </>
                )}
              </div>
            </button>
          </form>
          
          {/* Register Link */}
          <div className="text-center mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Don&apos;t have an account?{' '}
              <Link
                href="/register"
                className="font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
