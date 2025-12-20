"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { auth, db } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

import {
  LogOut,
  User,
  LayoutDashboard,
  Menu,
  X,
  Sun,
  Moon,
} from "lucide-react";
import { useTheme } from "next-themes";

export default function Navbar() {
  const [userData, setUserData] = useState<{ username: string } | null>(null);
  const [initial, setInitial] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  
  const { theme, setTheme } = useTheme();

  // --- DEFINING THE LINKS MANUALLY TO ENSURE CORRECT PATHS ---
  const navLinks = [
    { name: "Home", href: "/landing" },
    { name: "Careers", href: "/options" }, // RESTORED THIS LINK
    { name: "Dashboard", href: "/dashboard" },
    { name: "Contact", href: "/contact" },
  ];

  useEffect(() => {
    setMounted(true);

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const unsubscribeDoc = onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) {
            const name = docSnap.data().username || "User";
            setUserData({ username: name });
            setInitial(name.charAt(0).toUpperCase());
          }
        });
        return () => unsubscribeDoc();
      } else {
        setUserData(null);
      }
    });

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      unsubscribeAuth();
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setIsMenuOpen(false);
    setIsMobileNavOpen(false);
    router.push("/landing");
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  if (!mounted) return null;

  return (
    <nav className="border-b-4 border-slate-900 dark:border-slate-800 sticky top-0 bg-white dark:bg-slate-950 z-[100] transition-colors duration-300">
      <div className="flex items-center justify-between px-4 md:px-8 py-4 md:py-6">
        {/* LOGO */}
        <div className="flex items-center gap-2">
          <Link href="/landing" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center text-white font-black italic border-2 border-slate-900 dark:border-white shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] group-hover:scale-105 transition-transform duration-200">
              N
            </div>
            <span className="text-2xl font-black tracking-tighter uppercase italic text-slate-900 dark:text-white">
              NXTSTEP
            </span>
          </Link>
        </div>

        {/* DESKTOP NAV LINKS */}
        <div className="hidden lg:flex gap-8 text-sm font-black uppercase tracking-widest italic text-slate-600 dark:text-slate-400">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="relative hover:text-orange-600 dark:hover:text-orange-400 transition-colors after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-orange-600 after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* RIGHT SECTION */}
        <div className="flex items-center gap-3 md:gap-5">
          
          {/* THEME TOGGLE BUTTON */}
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-xl border-2 border-slate-900 dark:border-slate-600 bg-white dark:bg-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.5)] hover:translate-y-[1px] hover:translate-x-[1px] hover:shadow-none transition-all duration-200 group"
          >
            <Sun className="h-5 w-5 text-slate-900 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90 dark:hidden" />
            <Moon className="h-5 w-5 text-white hidden dark:block scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
            <span className="sr-only">Toggle theme</span>
          </button>

          {/* USER AUTH SECTION */}
          {userData ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="w-11 h-11 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-lg flex items-center justify-center border-2 border-slate-900 dark:border-slate-400 hover:scale-105 transition shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.8)]"
              >
                {initial}
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 mt-4 w-60 bg-white dark:bg-slate-950 border-4 border-slate-900 dark:border-slate-700 rounded-2xl shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.2)] overflow-hidden hidden md:block z-50 animate-in fade-in zoom-in-95 duration-200">
                   <div className="bg-slate-100 dark:bg-slate-900 p-3 border-b-2 border-slate-200 dark:border-slate-800">
                      <p className="text-xs font-black uppercase tracking-widest text-slate-500">Signed in as</p>
                      <p className="font-bold text-slate-900 dark:text-white truncate">{userData.username}</p>
                   </div>
                  <div className="p-2 space-y-1">
                    <Link
                      href="/dashboard"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-orange-50 dark:hover:bg-slate-900 hover:text-orange-600 dark:hover:text-orange-400 rounded-xl transition"
                    >
                      <LayoutDashboard size={18} /> Dashboard
                    </Link>
                    <Link
                      href="/profile"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-orange-50 dark:hover:bg-slate-900 hover:text-orange-600 dark:hover:text-orange-400 rounded-xl transition"
                    >
                      <User size={18} /> Profile Settings
                    </Link>
                    <hr className="border-2 border-slate-100 dark:border-slate-800 my-1" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-black uppercase italic text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition"
                    >
                      <LogOut size={18} /> Log Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link href="/signup" className="hidden sm:block">
              <button className="bg-orange-600 text-white px-8 py-3 rounded-xl font-black uppercase italic tracking-widest text-sm border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all duration-200 dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
                Join Now
              </button>
            </Link>
          )}

          <button
            onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
            className="lg:hidden p-2 border-2 border-slate-900 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white transition shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] active:translate-y-0.5"
          >
            {isMobileNavOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {isMobileNavOpen && (
        <div className="lg:hidden bg-white dark:bg-slate-950 border-t-4 border-slate-900 dark:border-slate-800 animate-in slide-in-from-top duration-300 absolute w-full left-0 z-40 shadow-2xl">
          <div className="p-6 flex flex-col gap-4">
            {navLinks.map((link) => (
                <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileNavOpen(false)}
                className="text-2xl font-black uppercase italic text-slate-900 dark:text-white hover:text-orange-600 transition-colors"
              >
                {link.name}
              </Link>
            ))}
            
            <hr className="border-2 border-slate-100 dark:border-slate-800 my-2" />
            
            {userData ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 text-red-500 font-black uppercase italic text-xl"
              >
                <LogOut size={24} /> Log Out
              </button>
            ) : (
              <Link
                href="/signup"
                onClick={() => setIsMobileNavOpen(false)}
                className="bg-orange-600 text-white p-4 rounded-xl text-center font-black uppercase italic tracking-widest border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] active:translate-y-1 active:shadow-none transition-all"
              >
                Get Started
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}