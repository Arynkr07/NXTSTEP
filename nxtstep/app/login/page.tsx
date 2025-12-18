"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { auth } from "./firebase"; 
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
    const savedUsername = localStorage.getItem("rememberedUsername");
    if (savedUsername) {
      setEmail(savedUsername);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setSuccess("Welcome back! Catching your wave...");
      setError("");

      if (rememberMe) {
        localStorage.setItem("rememberedUsername", email);
      } else {
        localStorage.removeItem("rememberedUsername");
      }

      setTimeout(() => router.push("/dashboard"), 1500);
    } catch (err) {
      setError((err as Error).message || "Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* --- NAVIGATION --- */}
      <nav className="flex items-center justify-between px-8 py-6 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center text-white font-bold italic">N</div>
          <span className="text-xl font-bold tracking-tight uppercase">NXTSTEP</span>
        </div>
        <div className="hidden md:flex gap-8 text-sm font-medium text-slate-600">
          <Link href="/home" className="hover:text-orange-600 transition">Home</Link>
          <Link href="/about" className="hover:text-orange-600 transition">About</Link>
          <Link href="/options" className="hover:text-orange-600 transition">Options</Link>
          <Link href="/dashboard" className="hover:text-orange-600 transition">Dashboard</Link>
        </div>
        <Link href="/signup">
          <button className="bg-orange-600 text-white px-6 py-2 rounded-full font-bold text-sm hover:bg-orange-700 transition shadow-lg shadow-orange-100">
            Join Now
          </button>
        </Link>
      </nav>

      <div className="grid md:grid-cols-2 min-h-[calc(100vh-88px)]">
        {/* --- LEFT SIDE: THE VIBE --- */}
        <div className="hidden md:flex bg-slate-900 p-12 flex-col justify-center relative overflow-hidden text-white">
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
        <div className="flex items-center justify-center p-8 bg-slate-50">
          <div className="w-full max-w-md">
            <div className="mb-10 text-center md:text-left">
              <h2 className="text-4xl font-black uppercase italic tracking-tighter">Login to NxtStep</h2>
              <p className="text-slate-500 mt-2 font-medium">Pick up right where you left off.</p>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl border-2 border-red-200 mb-6 font-bold text-sm italic">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-50 text-green-600 p-4 rounded-xl border-2 border-green-200 mb-6 font-bold text-sm italic">
                {success}
              </div>
            )}

            <div className="space-y-6">
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="email"
                    placeholder="name@example.com"
                    className="w-full border-2 border-slate-900 p-4 pl-12 rounded-xl font-bold focus:outline-none focus:ring-4 focus:ring-orange-100 transition shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] bg-white"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full border-2 border-slate-900 p-4 pl-12 rounded-xl font-bold focus:outline-none focus:ring-4 focus:ring-orange-100 transition shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] bg-white"
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
                    className="w-5 h-5 border-2 border-slate-900 rounded accent-orange-600 cursor-pointer"
                  />
                  <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900 transition">Remember Me</span>
                </label>
                <Link href="/reset-password" id="forgetPassword" className="text-sm font-bold text-orange-600 hover:underline">
                  Forgot Password?
                </Link>
              </div>

              <button
                onClick={handleLogin}
                className="w-full bg-slate-900 text-white p-5 rounded-xl font-black uppercase italic tracking-widest flex items-center justify-center gap-3 hover:bg-orange-600 transition-all hover:scale-[1.02] shadow-xl mt-4"
              >
                Launch Dashboard <ArrowRight size={20} />
              </button>
            </div>

            <p className="mt-8 text-center text-slate-500 font-medium">
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