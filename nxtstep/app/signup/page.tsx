"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import Link from "next/link";
import { Zap, ArrowRight, Target } from "lucide-react";
// Just import the tools you need
import { auth, db } from "@/lib/firebase"; 
import { doc, setDoc } from "firebase/firestore";
import navbar from '../components/navbar'; 

// Now use them

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();
  const [username, setUsername] = useState("");

  

  const handleSignup = async () => {
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      // 1. Create the Auth Account
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCred.user;

      // 2. Create the Firestore User Profile
      // This is the "Memory" piece that stores their NxtStep data
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        username: username, // Saving the name here
      likedCareers: [],
      quizResults: [],
      createdAt: new Date().toISOString()
      });

      // 3. Send Verification Email
      await sendEmailVerification(user);

      setSuccess("Account created! Check your email to verify.");
      setError("");
      
      // Delay redirect so they can read the success message
      setTimeout(() => router.push("/login"), 3000);
      
    } catch (err) {
      // Friendly error handling
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
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* --- NAVIGATION (Matching Template) --- */}
      <nav className="flex items-center justify-between px-8 py-6 border-b-4 border-slate-900 sticky top-0 bg-white z-50">
        <div className="flex items-center gap-2">
          <Link href="/landing" className="hover:text-orange-600 transition"><div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center text-white font-black italic border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">N</div>
          <span className="text-2xl font-black tracking-tighter uppercase italic">NXTSTEP</span>
        </Link>
          </div>
        <div className="hidden md:flex gap-10 text-sm font-black uppercase tracking-widest italic text-slate-600">
          <Link href="/landing" className="hover:text-orange-600 transition">Roadmaps</Link>
          <Link href="/options" className="hover:text-orange-600 transition">Careers</Link>
          <Link href="/dashboard" className="hover:text-orange-600 transition">Dashboard</Link>
          <Link href="/contact" className="hover:text-orange-600 transition">Contact</Link>
        </div>
        <Link href="/signup">
          <button className="bg-slate-900 text-white px-8 py-3 rounded-full font-black uppercase italic tracking-widest text-sm hover:bg-orange-600 transition shadow-[4px_4px_0px_0px_rgba(234,88,12,1)]">
            Join Now
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