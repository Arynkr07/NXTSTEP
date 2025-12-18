"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "./firebase"; 
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import Link from "next/link";
import { Zap, ArrowRight, Target } from "lucide-react";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(userCred.user);
      setSuccess("Account created! Check your email to verify.");
      setError("");
      setTimeout(() => router.push("/login"), 3000);
    } catch (err) {
      setError((err as Error).message || "Signup failed");
      setSuccess("");
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* --- NAVIGATION (Matching Template) --- */}
      <nav className="flex items-center justify-between px-8 py-6 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center text-white font-bold italic">N</div>
          <span className="text-xl font-bold tracking-tight uppercase">NXTSTEP</span>
        </div>
        <div className="hidden md:flex gap-8 text-sm font-medium text-slate-600">
          <Link href="/home" className="hover:text-orange-600 transition">Home</Link>
          <Link href="/options" className="hover:text-orange-600 transition">Options</Link>
          <Link href="/dashboard" className="hover:text-orange-600 transition">Dashboard</Link>
        </div>
        <Link href="/login">
          <button className="border-2 border-slate-900 px-6 py-2 rounded-full font-bold text-sm hover:bg-slate-900 hover:text-white transition">
            Sign In
          </button>
        </Link>
      </nav>

      <div className="grid md:grid-cols-2 min-h-[calc(100vh-88px)]">
        {/* --- LEFT SIDE: THE VIBE --- */}
        <div className="hidden md:flex bg-slate-50 p-12 flex-col justify-center relative overflow-hidden">
          <div className="z-10">
            <div className="flex items-center gap-2 text-orange-600 font-bold text-sm uppercase tracking-widest mb-4">
              <Zap size={16} fill="currentColor" />
              <span>Join the community</span>
            </div>
            <h1 className="text-7xl font-black leading-[0.9] mb-6 tracking-tighter uppercase italic">
              Ready for<br /> 
              <span className="text-orange-600">The Jump?*</span>
            </h1>
            <p className="text-lg text-slate-600 max-w-sm">
              Create an account to start building your personalized career roadmap and take on daily AI challenges.
            </p>
          </div>
          {/* Decorative Background Text */}
          <div className="absolute -bottom-10 left-0 opacity-[0.03] select-none pointer-events-none">
            <h2 className="text-[200px] font-black italic whitespace-nowrap">NXTSTEP</h2>
          </div>
        </div>

        {/* --- RIGHT SIDE: THE FORM --- */}
        <div className="flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <div className="mb-10">
              <h2 className="text-4xl font-black uppercase italic tracking-tighter">Create Account</h2>
              <p className="text-slate-500 mt-2">Enter your details to catch the wave.</p>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 mb-6 font-medium text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-50 text-green-600 p-4 rounded-xl border border-green-100 mb-6 font-medium text-sm">
                {success}
              </div>
            )}

            <div className="space-y-5">
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">Email Address</label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  className="w-full border-2 border-slate-900 p-4 rounded-xl font-bold focus:outline-none focus:ring-4 focus:ring-orange-100 transition shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full border-2 border-slate-900 p-4 rounded-xl font-bold focus:outline-none focus:ring-4 focus:ring-orange-100 transition shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div>
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">Confirm Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full border-2 border-slate-900 p-4 rounded-xl font-bold focus:outline-none focus:ring-4 focus:ring-orange-100 transition shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <button
                onClick={handleSignup}
                className="w-full bg-orange-600 text-white p-5 rounded-xl font-black uppercase italic tracking-widest flex items-center justify-center gap-3 hover:bg-orange-700 transition-all hover:scale-[1.02] shadow-xl shadow-orange-200 mt-8"
              >
                Sign Up Now <ArrowRight size={20} />
              </button>
            </div>

            <p className="mt-8 text-center text-slate-500 font-medium">
              Already a member?{" "}
              <Link href="/login" className="text-orange-600 font-bold hover:underline">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}