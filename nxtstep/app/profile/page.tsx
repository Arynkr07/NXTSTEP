"use client";
import React, { useEffect, useState } from 'react';
import { auth, db } from "@/lib/firebase";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { User, ShieldCheck, Edit3, Save } from "lucide-react";
import Navbar from "../components/navbar";

export default function ProfileSettings() {
  const [userData, setUserData] = useState<any>(null);
  const [newUsername, setNewUsername] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const unsubscribeDoc = onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            setUserData(data);
            setNewUsername(data.username || "");
          }
        });
        return () => unsubscribeDoc();
      }
    });
    return () => unsubscribeAuth();
  }, []);

  const handleUpdateProfile = async () => {
    if (!auth.currentUser) return;
    const userRef = doc(db, "users", auth.currentUser.uid);

    try {
      await updateDoc(userRef, {
        username: newUsername
      });
      setMessage("Profile updated successfully!");
      setIsEditing(false);
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Update failed:", err);
      setMessage("Failed to update profile.");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-2xl mx-auto p-8 mt-12">
        <header className="mb-12 border-b-4 border-slate-900 pb-6">
          <h1 className="text-5xl font-black uppercase italic tracking-tighter">Account <span className="text-orange-600">Settings*</span></h1>
        </header>

        <div className="space-y-10">
          {/* USERNAME SECTION */}
          <section className="border-4 border-slate-900 p-8 rounded-[40px] bg-slate-50 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black uppercase italic flex items-center gap-2">
                <User className="text-orange-600" /> Identity
              </h2>
              <button 
                onClick={() => setIsEditing(!isEditing)}
                className="text-slate-400 hover:text-slate-900 transition flex items-center gap-1 font-bold text-xs uppercase"
              >
                <Edit3 size={14} /> {isEditing ? "Cancel" : "Edit"}
              </button>
            </div>

            {isEditing ? (
              <div className="space-y-4">
                <input 
                  type="text" 
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="w-full border-4 border-slate-900 p-4 rounded-2xl font-black italic focus:ring-4 focus:ring-orange-200 outline-none"
                />
                <button 
                  onClick={handleUpdateProfile}
                  className="w-full bg-slate-900 text-white p-4 rounded-2xl font-black uppercase italic flex items-center justify-center gap-2 hover:bg-orange-600 transition"
                >
                  <Save size={18} /> Save Changes
                </button>
              </div>
            ) : (
              <div>
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Display Name</span>
                <p className="text-3xl font-black italic text-slate-900">{userData?.username || "Anonymous Student"}</p>
              </div>
            )}
            {message && <p className="mt-4 text-sm font-bold text-orange-600 italic">{message}</p>}
          </section>

          {/* SECURITY STATUS */}
          <section className="p-8 border-4 border-slate-900 rounded-[40px] flex items-center justify-between">
             <div>
                <h3 className="text-lg font-black uppercase italic">Security Status</h3>
                <p className="text-slate-500 font-medium text-sm">Account connected via Firebase Auth</p>
             </div>
             <ShieldCheck size={40} className="text-green-500" />
          </section>
        </div>
      </div>
    </div>
  );
}