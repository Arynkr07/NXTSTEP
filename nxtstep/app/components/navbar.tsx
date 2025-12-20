"use client";
import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { auth, db } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from 'next/navigation';
import { LogOut, User, LayoutDashboard, ChevronDown, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [userData, setUserData] = useState<{username: string} | null>(null);
  const [initial, setInitial] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
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
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
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

  return (
    <nav className="border-b-4 border-slate-900 sticky top-0 bg-white z-[100]">
      <div className="flex items-center justify-between px-4 md:px-8 py-4 md:py-6">
        {/* --- LOGO --- */}
        <div className="flex items-center gap-2">
          <Link href="/landing" className="flex items-center gap-2">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-orange-600 rounded-lg md:rounded-xl flex items-center justify-center text-white font-black italic border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">N</div>
            <span className="text-xl md:text-2xl font-black tracking-tighter uppercase italic text-slate-900">NXTSTEP</span>
          </Link>
        </div>

        {/* --- DESKTOP NAV LINKS --- */}
        <div className="hidden lg:flex gap-8 text-sm font-black uppercase tracking-widest italic text-slate-600">
          <Link href="/landing" className="hover:text-orange-600 transition">Home</Link>
          <Link href="/options" className="hover:text-orange-600 transition">Careers</Link>
          <Link href="/dashboard" className="hover:text-orange-600 transition">Dashboard</Link>
          <Link href="/contact" className="hover:text-orange-600 transition">Contact</Link>
        </div>

        {/* --- RIGHT SECTION --- */}
        <div className="flex items-center gap-2 md:gap-4">
          {userData ? (
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-2 md:gap-3 group focus:outline-none"
              >
                <div className="text-right hidden sm:block">
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 leading-none">Logged in</p>
                  <p className="font-black italic uppercase text-slate-900 text-sm leading-tight group-hover:text-orange-600 transition">
                    {userData.username}
                  </p>
                </div>
                
                <div className="w-10 h-10 md:w-12 md:h-12 bg-orange-600 rounded-full border-2 md:border-4 border-slate-900 flex items-center justify-center text-white font-black text-lg md:text-xl hover:scale-105 transition cursor-pointer shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] group-active:translate-y-0.5">
                  {initial}
                </div>
              </button>

              {/* --- DESKTOP/TABLET DROPDOWN --- */}
              {isMenuOpen && (
                <div className="absolute right-0 mt-4 w-56 bg-white border-4 border-slate-900 rounded-2xl shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] overflow-hidden hidden md:block">
                  <div className="p-2 space-y-1">
                    <Link href="/dashboard" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-orange-50 hover:text-orange-600 rounded-xl transition">
                      <LayoutDashboard size={18} /> Dashboard
                    </Link>
                    <Link href="/profile" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-orange-50 hover:text-orange-600 rounded-xl transition">
                      <User size={18} /> Profile Settings
                    </Link>
                    <hr className="border-2 border-slate-100 my-1" />
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-black uppercase italic text-red-500 hover:bg-red-50 rounded-xl transition">
                      <LogOut size={18} /> Log Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link href="/signup" className="hidden sm:block">
              <button className="bg-slate-900 text-white px-6 md:px-8 py-2 md:py-3 rounded-full font-black uppercase italic text-xs md:text-sm hover:bg-orange-600 transition shadow-[3px_3px_0px_0px_rgba(234,88,12,1)]">
                Join Now
              </button>
            </Link>
          )}

          {/* --- MOBILE HAMBURGER TOGGLE --- */}
          <button 
            onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
            className="lg:hidden p-2 border-2 border-slate-900 rounded-xl bg-white active:bg-slate-100 transition shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]"
          >
            {isMobileNavOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* --- MOBILE MENU DRAWER --- */}
      {isMobileNavOpen && (
        <div className="lg:hidden bg-white border-t-4 border-slate-900 animate-in slide-in-from-top duration-300">
          <div className="p-6 flex flex-col gap-4">
            <Link href="/landing" onClick={() => setIsMobileNavOpen(false)} className="text-xl font-black uppercase italic text-slate-900 hover:text-orange-600">Home</Link>
            <Link href="/options" onClick={() => setIsMobileNavOpen(false)} className="text-xl font-black uppercase italic text-slate-900 hover:text-orange-600">Careers</Link>
            <Link href="/dashboard" onClick={() => setIsMobileNavOpen(false)} className="text-xl font-black uppercase italic text-slate-900 hover:text-orange-600">Dashboard</Link>
            <Link href="/contact" onClick={() => setIsMobileNavOpen(false)} className="text-xl font-black uppercase italic text-slate-900 hover:text-orange-600">Contact</Link>
            <hr className="border-2 border-slate-100" />
            {userData ? (
               <button onClick={handleLogout} className="flex items-center gap-3 text-red-500 font-black uppercase italic">
                 <LogOut size={20} /> Log Out
               </button>
            ) : (
              <Link href="/signup" onClick={() => setIsMobileNavOpen(false)} className="bg-orange-600 text-white p-4 rounded-2xl text-center font-black uppercase italic border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
                Get Started
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}