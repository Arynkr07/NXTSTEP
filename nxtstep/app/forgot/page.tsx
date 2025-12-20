"use client";
import { useState } from "react";
import { auth } from "@/lib/firebase"; 
import { sendPasswordResetEmail } from "firebase/auth";
import Link from "next/link";
import { Mail, ArrowLeft, Zap, CheckCircle } from "lucide-react";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSent, setIsSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await sendPasswordResetEmail(auth, email);
      setIsSent(true);
    } catch (err: any) {
      if (err.code === "auth/user-not-found") {
        setError("No account found with this email address.");
      } else {
        setError("Something went wrong. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Added dark:bg-slate-950 and dark:text-white
    <div className="min-h-screen bg-white dark:bg-slate-950 font-sans text-slate-900 dark:text-white transition-colors duration-300">
      <div className="flex items-center justify-center p-8 min-h-[calc(100vh-80px)]">
        <div className="w-full max-w-md">
          {/* Back to Login */}
          <Link href="/login" className="flex items-center gap-2 text-slate-400 font-bold text-sm uppercase tracking-widest mb-12 hover:text-slate-900 dark:hover:text-white transition group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Login
          </Link>

          <div className="mb-10">
            {/* Icon Box: Added dark mode border/bg */}
            <div className="w-16 h-16 bg-orange-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-6 border-2 border-slate-900 dark:border-slate-700 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
              <Zap className="text-orange-600" fill="currentColor" size={32} />
            </div>
            <h1 className="text-4xl font-black uppercase italic tracking-tighter">Reset <span className="text-orange-600">Password*</span></h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium italic">We'll send a recovery link to your inbox.</p>
          </div>

          {isSent ? (
            // Success Message: Added dark mode support
            <div className="bg-green-50 dark:bg-green-900/20 border-4 border-slate-900 dark:border-green-500 p-8 rounded-[32px] text-center shadow-[12px_12px_0px_0px_rgba(34,197,94,1)]">
              <CheckCircle className="mx-auto text-green-500 mb-4" size={48} />
              <h2 className="text-xl font-black uppercase italic mb-2 dark:text-green-400">Check Your Email</h2>
              <p className="text-sm text-green-700 dark:text-green-300 font-bold italic">We've sent a reset link to <strong>{email}</strong>. Follow the instructions to catch the wave again.</p>
            </div>
          ) : (
            <form onSubmit={handleReset} className="space-y-6">
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl border-4 border-slate-900 dark:border-red-500 font-bold text-sm italic shadow-[4px_4px_0px_0px_rgba(220,38,38,1)]">
                  {error}
                </div>
              )}
              
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  {/* Input: Added dark mode background, text, and border */}
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    className="w-full bg-white dark:bg-slate-950 border-4 border-slate-900 dark:border-slate-700 p-4 pl-12 rounded-xl font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-orange-100 dark:focus:ring-orange-900 transition shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-slate-900 dark:bg-orange-600 text-white p-5 rounded-xl font-black uppercase italic tracking-widest flex items-center justify-center gap-3 hover:bg-orange-600 dark:hover:bg-orange-700 transition-all hover:scale-[1.02] shadow-[8px_8px_0px_0px_rgba(234,88,12,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.5)] disabled:bg-slate-400 disabled:shadow-none"
              >
                {isLoading ? "Sending Link..." : "Send Reset Link"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}