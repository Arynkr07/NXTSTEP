"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase"; 
import { signInWithEmailAndPassword } from "firebase/auth";
import { Zap, ArrowRight, Lock, Mail } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      
      setSuccess("Welcome back! Catching your wave...");
      setError("");

      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      setTimeout(() => router.push("/dashboard"), 1500);
    } catch (err) {
      const errorMessage = (err as Error).message;
      if (errorMessage.includes("user-not-found")) {
        setError("No account found with this email.");
      } else if (errorMessage.includes("wrong-password")) {
        setError("Incorrect password. Try again!");
      } else {
        setError("Login failed. Please check your credentials.");
      }
      setSuccess("");
    }
  };

  return (
    // Root: Added dark:bg-slate-950 and dark:text-white
    <div className="min-h-screen bg-white dark:bg-slate-950 font-sans text-slate-900 dark:text-white transition-colors duration-300">
      
      {/* --- NAVIGATION --- */}
      <div className="grid md:grid-cols-2 min-h-[calc(100vh-88px)]">
        
        {/* --- LEFT SIDE: THE VIBE --- */}
        {/* Kept largely the same, but ensured border contrast if needed */}
        <div className="hidden md:flex bg-slate-900 p-12 flex-col justify-center relative overflow-hidden text-white border-r-4 border-slate-900 dark:border-slate-800">
          <div className="z-10">
            <div className="flex items-center gap-2 text-orange-500 font-bold text-sm uppercase tracking-widest mb-4">
              <Zap size={16} fill="currentColor" />
              <span>Welcome Back</span>
            </div>
            <h1 className="text-7xl font-black leading-[0.9] mb-6 tracking-tighter uppercase italic">
              Resume Your <br /> 
              <span className="text-orange-500">Journey*</span>
            </h1>
            <p className="text-lg text-slate-400 max-w-sm">
              Your personalized roadmaps and AI challenges are waiting. Log in to keep leveling up.
            </p>
          </div>
          {/* Decorative Background Text */}
          <div className="absolute -bottom-10 left-0 opacity-[0.05] select-none pointer-events-none">
            <h2 className="text-[200px] font-black italic whitespace-nowrap">SIGN IN</h2>
          </div>
        </div>

        {/* --- RIGHT SIDE: THE FORM --- */}
        {/* Added dark:bg-slate-950 */}
        <div className="flex items-center justify-center p-8 bg-slate-50 dark:bg-slate-950">
          <div className="w-full max-w-md">
            <div className="mb-10 text-center md:text-left">
              <h2 className="text-4xl font-black uppercase italic tracking-tighter">Login to NxtStep</h2>
              <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Pick up right where you left off.</p>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl border-2 border-red-200 dark:border-red-800 mb-6 font-bold text-sm italic">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 p-4 rounded-xl border-2 border-green-200 dark:border-green-800 mb-6 font-bold text-sm italic">
                {success}
              </div>
            )}

            <div className="space-y-6">
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  {/* Input: Added dark mode classes for bg, border, and focus rings */}
                  <input
                    type="email"
                    placeholder="name@example.com"
                    className="w-full border-2 border-slate-900 dark:border-slate-700 bg-white dark:bg-slate-950 p-4 pl-12 rounded-xl font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-orange-100 dark:focus:ring-orange-900 transition shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  {/* Input: Added dark mode classes */}
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full border-2 border-slate-900 dark:border-slate-700 bg-white dark:bg-slate-950 p-4 pl-12 rounded-xl font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-orange-100 dark:focus:ring-orange-900 transition shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between mt-2">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-5 h-5 border-2 border-slate-900 dark:border-slate-700 rounded accent-orange-600 cursor-pointer bg-white dark:bg-slate-950"
                  />
                  <span className="text-sm font-bold text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition">Remember Me</span>
                </label>
                <Link href="/forgot" id="forgetPassword" className="text-sm font-bold text-orange-600 hover:underline">
                  Forgot Password?
                </Link>
              </div>

              <button
                onClick={handleLogin}
                className="w-full bg-slate-900 dark:bg-orange-600 text-white p-5 rounded-xl font-black uppercase italic tracking-widest flex items-center justify-center gap-3 hover:bg-orange-600 dark:hover:bg-orange-700 transition-all hover:scale-[1.02] shadow-xl dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.2)] mt-4"
              >
                Launch Dashboard <ArrowRight size={20} />
              </button>
            </div>

            <p className="mt-8 text-center text-slate-500 dark:text-slate-400 font-medium">
              New to the waves?{" "}
              <Link href="/signup" className="text-orange-600 font-bold hover:underline">
                Register for Free
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}