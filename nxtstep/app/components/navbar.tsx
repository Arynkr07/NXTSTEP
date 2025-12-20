"use client";
import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { auth, db } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from 'next/navigation';
import { LogOut, User, LayoutDashboard, ChevronDown } from 'lucide-react';

export default function Navbar() {
  const [userData, setUserData] = useState<{username: string} | null>(null);
  const [initial, setInitial] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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

    // Close dropdown when clicking anywhere else on the screen
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
    router.push("/landing");
  };

  return (
    <nav className="flex items-center justify-between px-8 py-6 border-b-4 border-slate-900 sticky top-0 bg-white z-50">
      {/* --- LOGO --- */}
      <div className="flex items-center gap-2">
        <Link href="/landing" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center text-white font-black italic border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">N</div>
          <span className="text-2xl font-black tracking-tighter uppercase italic text-slate-900">NXTSTEP</span>
        </Link>
      </div>

      {/* --- NAV LINKS --- */}
      <div className="hidden md:flex gap-10 text-sm font-black uppercase tracking-widest italic text-slate-600">
        <Link href="/landing" className="hover:text-orange-600 transition">Home</Link>
        <Link href="/options" className="hover:text-orange-600 transition">Careers</Link>
        <Link href="/dashboard" className="hover:text-orange-600 transition">Dashboard</Link>
        <Link href="/contact" className="hover:text-orange-600 transition">Contact</Link>
      </div>

      {/* --- AUTH / PROFILE SECTION --- */}
      <div className="flex items-center gap-4">
        {userData ? (
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center gap-3 group focus:outline-none"
            >
              <div className="text-right hidden sm:block">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none">Logged in as</p>
                <p className="font-black italic uppercase text-slate-900 leading-tight group-hover:text-orange-600 transition">
                  {userData.username}
                </p>
              </div>
              
              <div className="w-12 h-12 bg-orange-600 rounded-full border-4 border-slate-900 flex items-center justify-center text-white font-black text-xl hover:scale-105 transition cursor-pointer shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] group-active:translate-y-1 group-active:shadow-none">
                {initial}
              </div>
              <ChevronDown className={`transition-transform duration-300 text-slate-900 ${isMenuOpen ? 'rotate-180' : ''}`} size={18} />
            </button>

            {/* --- DROPDOWN BOX --- */}
            {isMenuOpen && (
              <div className="absolute right-0 mt-4 w-56 bg-white border-4 border-slate-900 rounded-2xl shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] overflow-hidden">
                <div className="p-2 space-y-1">
                  <Link 
                    href="/dashboard" 
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-orange-50 hover:text-orange-600 rounded-xl transition"
                  >
                    <LayoutDashboard size={18} /> Dashboard
                  </Link>
                  <Link 
                    href="/profile" 
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-orange-50 hover:text-orange-600 rounded-xl transition"
                  >
                    <User size={18} /> Profile Settings
                  </Link>
                  <hr className="border-2 border-slate-100 my-1" />
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-black uppercase italic text-red-500 hover:bg-red-50 rounded-xl transition"
                  >
                    <LogOut size={18} /> Log Out
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Link href="/signup">
            <button className="bg-slate-900 text-white px-8 py-3 rounded-full font-black uppercase italic text-sm hover:bg-orange-600 transition shadow-[4px_4px_0px_0px_rgba(234,88,12,1)]">
              Join Now
            </button>
          </Link>
        )}
      </div>
    </nav>
  );
}