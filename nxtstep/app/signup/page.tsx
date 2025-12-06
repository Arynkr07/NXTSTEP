"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "./firebase"; // make sure firebase.js is set up correctly
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import Link from "next/dist/client/link";

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

      // Send email verification
      await sendEmailVerification(userCred.user);

      setSuccess("Signup successful! Please check your email for verification.");
      setError("");

      // Redirect after a delay
      setTimeout(() => router.push("/"), 3000);
    } catch (err) {
      setError((err as Error).message || "Signup failed");
      setSuccess("");
    }
  };

  return (
    <div className="bg-[#210440] text-gray-800 font-inter">
      <nav className="bg-[#210440] relative z-10 flex justify-between items-center p-4 md:p-8 max-w-7xl mx-auto">
                    <div className="flex items-center space-x-2">
                        <img src="https://placehold.co/40x40/F1AA9B/white?text=N" alt="Foody Logo" className="rounded-full"/>
                        <span className="text-2xl font-bold text-[#fdfdfd]">NXTSTEP</span>
                    </div>
                    <div className="hidden md:flex items-center space-x-6">
                        <a href="/home" className="font-medium text-[#fcfcfb] hover:text-[#650b4b] transition-colors">Home</a>
                        <a href="/about" className="font-medium text-[#fffefe] hover:text-[#650b4b] transition-colors">About</a>
                        <a href="/form" className="font-medium text-[#fdfcfb] hover:text-[#650b4b] transition-colors">Form</a>
                        <a href="/options" className="font-medium text-[#fdfbfb] hover:text-[#650b4b] transition-colors">Options</a>
                        <a href="/quiz" className="font-medium text-[#fefdfd] hover:text-[#650b4b] transition-colors">Quiz</a>
                        <a href="/dashboard" className="font-medium text-[#fefbfb] hover:text-[#650b4b] transition-colors">Dashboard</a>
                    </div>
                    <div className="flex items-center space-x-4">
                        {/* <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white cursor-pointer hover:text-gray-300 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg> */}
                        {/* <input
                        type="text"
                        id="searchBar"
                        placeholder="Search career options..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full sm:w-auto p-2 text-base rounded-l-md focus:outline-none focus:ring-2 focus:[#310E10] text-[#F5EFEB]"
                        /> */}
                        <Link href="/signup">

                        <button onClick={() => {}} className="px-4 py-2 border border-white text-white text-sm font-semibold rounded-full hover:bg-[#650b4b] transition-colors hidden sm:block">Sign in</button>
                        </Link>
                    
                    </div>
                </nav>
    
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br "><img src="https://pbs.twimg.com/media/EDyxVvhWsAMIbLx?format=png&name=small" alt="Background" className="absolute inset-0 w-full h-full object-cover opacity-20 z-0"/>
      
      <div className="bg-[#e5bbfa] p-8 rounded-xl shadow-lg w-full max-w-md">
        
        <h1 className="text-2xl font-bold mb-4 text-center text-black">Create Account</h1>

        {error && <p className="text-red-500 text-center mb-2">{error}</p>}
        {success && <p className="text-green-500 text-center mb-2">{success}</p>}

        <input
          type="email"
          placeholder="Email"
          className="border border-black text-black p-2 w-full mb-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="border-black text-black border p-2 w-full mb-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="Confirm Password"
          className="border border-black text-black p-2 w-full mb-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button
          onClick={handleSignup}
          className="bg-[#650b4b] text-white p-2 w-full rounded hover:bg-[#f9a8e1] transition"
        >
          Sign Up
        </button>

        <p className="text-black mt-4 text-center">
          Already have an account?{" "}
          <a href="/login" className="text-blue-500 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
    </div>
  );
}