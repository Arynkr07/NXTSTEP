"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { auth } from "@/lib/firebase";
import { confirmPasswordReset, verifyPasswordResetCode } from "firebase/auth";
import Link from "next/link";
import { Lock, ArrowLeft, Zap, CheckCircle2, AlertCircle, KeyRound, Eye, EyeOff } from "lucide-react";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // oobCode can come from query param ?oobCode=... or ?code=...
  const queryCode = searchParams.get("oobCode") || searchParams.get("code") || "";

  const [code, setCode] = useState(queryCode);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [accountEmail, setAccountEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  // If code is in URL, automatically verify it
  useEffect(() => {
    if (queryCode) {
      setCode(queryCode);
      setIsVerifyingCode(true);
      verifyPasswordResetCode(auth, queryCode)
        .then((email) => {
          setAccountEmail(email);
          setError("");
        })
        .catch((err) => {
          console.warn("Invalid reset code:", err);
          setError("This password reset link is invalid or has expired. Please request a new one.");
        })
        .finally(() => {
          setIsVerifyingCode(false);
        });
    }
  }, [queryCode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmedCode = code.trim();
    if (!trimmedCode) {
      setError("Please provide a valid reset code from your email.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      await confirmPasswordReset(auth, trimmedCode, newPassword);
      setIsSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 2500);
    } catch (err: any) {
      console.error("Reset error:", err);
      if (err.code === "auth/invalid-action-code" || err.code === "auth/expired-action-code") {
        setError("This reset code is invalid or has expired. Please request a new recovery link.");
      } else if (err.code === "auth/weak-password") {
        setError("Password should be stronger. Try adding numbers or symbols.");
      } else {
        setError(err.message || "Failed to reset password. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      {/* Back to Login */}
      <Link
        href="/login"
        className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest mb-10 hover:text-slate-900 dark:hover:text-white transition group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Sign In
      </Link>

      <div className="mb-8">
        <div className="w-16 h-16 bg-orange-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-5 border-2 border-slate-900 dark:border-slate-700 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
          <Zap className="text-orange-600" fill="currentColor" size={30} />
        </div>
        <h1 className="text-4xl font-black uppercase italic tracking-tighter text-slate-900 dark:text-white">
          Create New <span className="text-orange-600">Password*</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm font-medium italic">
          {accountEmail
            ? `Setting new password for ${accountEmail}`
            : "Enter your verification code and choose a new secure password."}
        </p>
      </div>

      {isSuccess ? (
        <div className="bg-green-50 dark:bg-green-950/30 border-4 border-slate-900 dark:border-green-500 p-8 rounded-[32px] text-center shadow-[12px_12px_0px_0px_rgba(34,197,94,1)] animate-in zoom-in-95 duration-200">
          <CheckCircle2 className="mx-auto text-green-500 mb-4" size={48} />
          <h2 className="text-2xl font-black uppercase italic mb-2 text-slate-900 dark:text-white">
            Password Changed!
          </h2>
          <p className="text-sm text-green-700 dark:text-green-300 font-bold italic mb-6">
            Your credentials have been securely updated. Redirecting you to sign in...
          </p>
          <Link
            href="/login"
            className="inline-block bg-slate-900 dark:bg-green-600 text-white px-6 py-3 rounded-xl font-black uppercase italic text-xs hover:bg-orange-600 transition shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]"
          >
            Sign In Now
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="flex items-start gap-3 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 p-4 rounded-2xl border-2 border-red-500 font-bold text-xs shadow-[4px_4px_0px_0px_rgba(220,38,38,1)]">
              <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Reset Code Input (shown editable if not in URL, or hidden if verified) */}
          {!queryCode && (
            <div>
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">
                Reset Code (from Email link or oobCode)
              </label>
              <div className="relative">
                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  required
                  placeholder="Paste oobCode or code from email"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border-4 border-slate-900 dark:border-slate-700 p-4 pl-12 rounded-2xl font-mono text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-orange-100 dark:focus:ring-orange-950/50 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.1)]"
                />
              </div>
            </div>
          )}

          {/* New Password */}
          <div>
            <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="At least 6 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border-4 border-slate-900 dark:border-slate-700 p-4 pl-12 pr-12 rounded-2xl font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-orange-100 dark:focus:ring-orange-950/50 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.1)]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">
              Confirm New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="Re-enter your new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border-4 border-slate-900 dark:border-slate-700 p-4 pl-12 rounded-2xl font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-orange-100 dark:focus:ring-orange-950/50 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.1)]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || isVerifyingCode}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white p-5 rounded-2xl font-black uppercase italic tracking-widest transition-all shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.2)] active:translate-y-0.5 disabled:opacity-50"
          >
            {isLoading ? "Saving New Password..." : "Update Password"}
          </button>
        </form>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 font-sans text-slate-900 dark:text-white transition-colors duration-300 flex items-center justify-center p-6">
      <Suspense
        fallback={
          <div className="text-center p-12">
            <Zap size={32} className="animate-bounce text-orange-600 mx-auto mb-4" />
            <p className="font-bold text-xs uppercase tracking-widest text-slate-400">Loading Password Recovery...</p>
          </div>
        }
      >
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
