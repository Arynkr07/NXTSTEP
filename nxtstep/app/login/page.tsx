"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { auth } from "./firebase"; // make sure firebase.js is set up
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { sendEmailVerification, signInWithEmailAndPassword } from "firebase/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  // Firebase hook
  const [createUserWithEmailAndPassword, user, loading, hookError] =
    useCreateUserWithEmailAndPassword(auth);

  useEffect(() => {
    const savedUsername = localStorage.getItem("rememberedUsername");
    if (savedUsername) {
      setEmail(savedUsername);
      setRememberMe(true);
    }
  }, []);

  const handleRegister = async () => {
    try {
      const userCred = await createUserWithEmailAndPassword(email, password);
      if (userCred) {
        await sendEmailVerification(userCred.user);
        setSuccess("Registration successful! Check your email for verification.");
        setError("");
      }
    } catch (err) {
      setError(
        err && typeof err === "object" && "message" in err
          ? String((err as { message?: string }).message)
          : "Registration failed"
      );
    }
  };

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setSuccess("Login successful!");
      setError("");

      if (rememberMe) {
        localStorage.setItem("rememberedUsername", email);
      } else {
        localStorage.removeItem("rememberedUsername");
      }

      router.push("/");
    } catch (err) {
      setError(
        err && typeof err === "object" && "message" in err
          ? String((err as { message?: string }).message)
          : "Login failed"
      );
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br "style={{ backgroundImage: "url('https://pbs.twimg.com/media/EDyxVvhWsAMIbLx?format=png&name=small')", backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '100vh', boxShadow: 'inset 0 0 0 1000px rgba(33, 4, 64, 0.7)' }}>
      <div className="bg-[#e5bbfa] p-8 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">
          Login to NxtStep
        </h1>

        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        {success && <p className="text-green-500 mb-4 text-center">{success}</p>}

        <input
          type="email"
          placeholder="Email"
          className="border p-2 w-full mb-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full mb-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="flex items-center justify-between mt-2 mb-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="rememberMe" className="text-gray-600">
              Remember Me
            </label>
          </div>
          <Link href="/reset-password" className="text-blue-500 hover:underline">
            Forget Password?
          </Link>
        </div>

        <button
          onClick={handleLogin}
          className="bg-[#650b4b] text-white p-2 w-full rounded hover:bg-[#f9a8e1] transition"
        >
          Login
        </button>

        <p className="mt-4 text-center">
          Don’t have an account?{" "}
          <Link href="/signup" className="text-blue-500 hover:underline">
            
            Register
          </Link>
        </p>
      </div>
    </div>
    </div>
  );
}