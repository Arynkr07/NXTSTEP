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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 via-indigo-300 to-purple-400">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
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
          className="bg-blue-500 text-white p-2 w-full rounded hover:bg-blue-600 transition"
        >
          Login
        </button>

        <p className="mt-4 text-center">
          Don’t have an account?{" "}
          <button
            onClick={handleRegister}
            className="text-blue-500 hover:underline"
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
}