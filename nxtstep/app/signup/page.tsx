"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import Link from "next/link";
import { Zap, ArrowRight, User, Mail, Lock } from "lucide-react";
import { auth, db } from "@/lib/firebase"; 
import { doc, setDoc } from "firebase/firestore";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState(""); // This was missing from the UI
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    // Basic validation
    if (!username.trim()) {
        setError("Please enter a username.");
        return;
    }

    try {
      // 1. Create the Auth Account
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCred.user;

      // 2. Create the Firestore User Profile
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        username: username, // Now this will actually have a value
        likedCareers: [],
        quizResults: [],
        createdAt: new Date().toISOString()
      });

      // 3. Send Verification Email
      await sendEmailVerification(user);

      setSuccess("Account created! Check your email to verify.");
      setError("");
      
      setTimeout(() => router.push("/login"), 3000);
      
    } catch (err) {
      const errorMessage = (err as Error).message;
      if (errorMessage.includes("email-already-in-use")) {
        setError("This email is already registered. Try logging in!");
      } else {
        setError(errorMessage || "Signup failed");
      }
      setSuccess("");
    }
  };

  return (
    // Root: Added dark:bg-slate-950 and dark:text-white
    <div className="min-h-screen bg-white dark:bg-slate-950 font-sans text-slate-900 dark:text-white transition-colors duration-300">
      
      <div className="grid md:grid-cols-2 min-h-[calc(100vh-88px)]">
        {/* --- LEFT SIDE: THE VIBE --- */}
        {/* Added dark:bg-slate-900 and border for separation */}
        <div className="hidden md:flex bg-slate-50 dark:bg-slate-900 p-12 flex-col justify-center relative overflow-hidden border-r-4 border-slate-900 dark:border-slate-800 transition-colors duration-300">
          <div className="z-10">
            <div className="flex items-center gap-2 text-orange-600 font-bold text-sm uppercase tracking-widest mb-4">
              <Zap size={16} fill="currentColor" />
              <span>Join the community</span>
            </div>
            <h1 className="text-7xl font-black leading-[0.9] mb-6 tracking-tighter uppercase italic text-slate-900 dark:text-white">
              Ready for<br /> 
              <span className="text-orange-600">The Jump?*</span>
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-sm">
              Create an account to start building your personalized career roadmap and take on daily AI challenges.
            </p>
          </div>
          {/* Decorative Background Text */}
          <div className="absolute -bottom-10 left-0 opacity-[0.03] select-none pointer-events-none dark:opacity-[0.05] dark:text-white">
            <h2 className="text-[200px] font-black italic whitespace-nowrap">NXTSTEP</h2>
          </div>
        </div>

        {/* --- RIGHT SIDE: THE FORM --- */}
        <div className="flex items-center justify-center p-8 bg-white dark:bg-slate-950 transition-colors duration-300">
          <div className="w-full max-w-md">
            <div className="mb-10">
              <h2 className="text-4xl font-black uppercase italic tracking-tighter">Create Account</h2>
              <p className="text-slate-500 dark:text-slate-400 mt-2">Enter your details to catch the wave.</p>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl border-2 border-red-100 dark:border-red-800 mb-6 font-bold text-sm italic">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 p-4 rounded-xl border-2 border-green-100 dark:border-green-800 mb-6 font-bold text-sm italic">
                {success}
              </div>
            )}

            <div className="space-y-5">
              
              {/* 1. Added Username Input */}
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">Username</label>
                <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="text"
                      placeholder="FutureCEO"
                      className="w-full bg-white dark:bg-slate-950 border-2 border-slate-900 dark:border-slate-700 text-slate-900 dark:text-white p-4 pl-12 rounded-xl font-bold focus:outline-none focus:ring-4 focus:ring-orange-100 dark:focus:ring-orange-900 transition shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
              </div>

              <div>
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">Email Address</label>
                <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="email"
                      placeholder="name@example.com"
                      className="w-full bg-white dark:bg-slate-950 border-2 border-slate-900 dark:border-slate-700 text-slate-900 dark:text-white p-4 pl-12 rounded-xl font-bold focus:outline-none focus:ring-4 focus:ring-orange-100 dark:focus:ring-orange-900 transition shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]"
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
                      className="w-full bg-white dark:bg-slate-950 border-2 border-slate-900 dark:border-slate-700 text-slate-900 dark:text-white p-4 pl-12 rounded-xl font-bold focus:outline-none focus:ring-4 focus:ring-orange-100 dark:focus:ring-orange-900 transition shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
              </div>

              <div>
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">Confirm Password</label>
                <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full bg-white dark:bg-slate-950 border-2 border-slate-900 dark:border-slate-700 text-slate-900 dark:text-white p-4 pl-12 rounded-xl font-bold focus:outline-none focus:ring-4 focus:ring-orange-100 dark:focus:ring-orange-900 transition shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>
              </div>

              <button
                onClick={handleSignup}
                className="w-full bg-orange-600 text-white p-5 rounded-xl font-black uppercase italic tracking-widest flex items-center justify-center gap-3 hover:bg-orange-700 dark:hover:bg-orange-500 transition-all hover:scale-[1.02] shadow-xl shadow-orange-200 dark:shadow-none mt-8"
              >
                Sign Up Now <ArrowRight size={20} />
              </button>
            </div>

            <p className="mt-8 text-center text-slate-500 dark:text-slate-400 font-medium">
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