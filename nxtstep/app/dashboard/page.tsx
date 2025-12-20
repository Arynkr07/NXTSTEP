"use client";

import Link from 'next/link';
import React, { useEffect, useState } from "react";
import { Zap, Target, Heart, Award, ArrowRight } from "lucide-react";
import { auth, db } from "@/lib/firebase"; 
import { doc, updateDoc, arrayUnion, arrayRemove, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth"; 
import { useRouter } from "next/navigation";
import { careerOptions, type Career } from '../components/data';

interface QuizResult {
  id: number;
  quizName: string;
  score: number;
  createdAt: string;
}

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);
  const [savedCareers, setSavedCareers] = useState<Career[]>([]);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [recommendations, setRecommendations] = useState<Career[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const router = useRouter();

  // Auth and Firestore listener
  useEffect(() => {
    setMounted(true);

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        const userRef = doc(db, "users", user.uid);
        const unsubscribeData = onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            const likedIds = data.likedCareers || [];
            setSavedCareers(careerOptions.filter(c => likedIds.includes(c.id)));
            setQuizResults(data.quizResults || []);
            setRecommendations(careerOptions.filter(c => !likedIds.includes(c.id)).slice(0, 3));
          }
        });
        return () => unsubscribeData();
      } else {
        router.push("/login");
      }
    });

    return () => unsubscribeAuth();
  }, [router]);

  const handleClearHistory = async () => {
    if (!window.confirm("Are you sure? This will wipe your entire mission history!")) return;
    if (!currentUser) return;
    const userRef = doc(db, "users", currentUser.uid);
    try { await updateDoc(userRef, { quizResults: [] }); } 
    catch (error) { console.error(error); }
  };

  const handleRetake = () => router.push("/quiz");
  const toggleSave = async (careerId: number) => {
    if (!currentUser) return;
    const userRef = doc(db, "users", currentUser.uid);
    const isSaved = savedCareers.some(c => c.id === careerId);
    try {
      await updateDoc(userRef, {
        likedCareers: isSaved ? arrayRemove(careerId) : arrayUnion(careerId)
      });
    } catch (err) { console.error(err); }
  };

  if (!mounted || !currentUser) return null;

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 font-sans">
      

      <div className="max-w-7xl mx-auto px-8 py-12">
        <header className="mb-12">
          <div className="flex items-center gap-2 text-orange-600 font-bold text-sm uppercase tracking-widest mb-2">
            <Zap size={16} fill="currentColor" />
            <span>Progress Overview</span>
          </div>
          <h1 className="text-6xl font-black uppercase italic tracking-tighter">
            Student <span className="text-orange-600">Command Center*</span>
          </h1>
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-12">
            {/* Favourites Section */}
            <section>
              <h2 className="text-2xl font-black uppercase italic mb-6 flex items-center gap-3">
                <Heart size={24} className="text-orange-600" fill="currentColor" /> My Favourites
              </h2>
              {savedCareers.length === 0 ? (
                <div className="border-4 border-dashed border-slate-200 dark:border-slate-700 rounded-3xl p-12 text-center">
                  <p className="text-slate-400 dark:text-slate-500 font-bold italic">No careers liked yet.</p>
                  <Link href="/options">
                    <button className="mt-4 bg-slate-900 dark:bg-orange-600 text-white px-6 py-2 rounded-full font-bold">Explore Now</button>
                  </Link>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {savedCareers.map(career => (
                    <div key={career.id} className="group relative bg-white dark:bg-slate-900 border-4 border-slate-900 dark:border-slate-700 p-6 rounded-3xl shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.2)] hover:shadow-[12px_12px_0px_0px_rgba(234,88,12,1)] transition-all">
                      <button 
                        onClick={() => toggleSave(career.id)}
                        className="absolute top-4 right-4 text-orange-600 hover:scale-125 transition"
                      >
                        <Heart size={20} fill="currentColor" />
                      </button>
                      <h3 className="font-black text-xl uppercase italic mb-1 text-slate-900 dark:text-slate-100">{career.title}</h3>
                      <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-4 line-clamp-2">{career.description}</p>
                      <Link href={career.link} target="_blank">
                        <span className="text-xs font-black uppercase tracking-widest flex items-center gap-1 hover:text-orange-600">
                          View Roadmap <ArrowRight size={14} />
                        </span>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Quiz Results Section */}
            <section>
              <div className="flex justify-between items-end mb-6">
                <h2 className="text-2xl font-black uppercase italic flex items-center gap-3">
                  <Award size={24} className="text-orange-600" /> Recent Quiz Results
                </h2>
                {quizResults.length > 0 && (
                  <button onClick={handleClearHistory} className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-700 underline decoration-2 underline-offset-4">
                    Wipe Mission History
                  </button>
                )}
              </div>

              <div className="bg-slate-50 dark:bg-slate-800 border-4 border-slate-900 dark:border-slate-700 rounded-[32px] overflow-hidden shadow-[12px_12px_0px_0px_rgba(15,23,42,1)] dark:shadow-[12px_12px_0px_0px_rgba(255,255,255,0.2)]">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-900 text-white uppercase text-xs tracking-widest">
                    <tr>
                      <th className="px-6 py-4">Target Career</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y-2 divide-slate-200 dark:divide-slate-700">
                    {quizResults.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-16 text-center">
                          <p className="font-bold text-slate-400 dark:text-slate-500 italic mb-4">No missions completed yet.</p>
                          <button onClick={handleRetake} className="bg-slate-900 dark:bg-orange-600 text-white px-6 py-2 rounded-full font-black uppercase italic text-xs">Start First Mission</button>
                        </td>
                      </tr>
                    ) : (
                      quizResults.map((q) => (
                        <tr key={q.id} className="hover:bg-white dark:hover:bg-slate-700 transition group">
                          <td className="px-6 py-4 font-black italic text-slate-900 dark:text-slate-100">{careerOptions.find(c => c.id === q.id)?.title || q.quizName}</td>
                          <td className="px-6 py-4 text-slate-500 dark:text-slate-400 font-bold text-sm">
                            {new Date(q.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button onClick={handleRetake} className="bg-white dark:bg-slate-900 border-2 border-slate-900 dark:border-slate-700 text-slate-900 dark:text-slate-100 px-4 py-2 rounded-xl text-[10px] font-black uppercase italic hover:bg-orange-600 hover:text-white transition shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] active:translate-y-1 active:shadow-none">
                              Retake
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-12">
            <section className="bg-orange-600 dark:bg-orange-700 text-white p-8 rounded-[40px] shadow-xl relative overflow-hidden">
              <Target className="absolute -right-4 -bottom-4 opacity-20 w-32 h-32" />
              <h3 className="text-2xl font-black uppercase italic mb-4">AI Recommendations</h3>
              <p className="text-orange-100 dark:text-orange-200 text-sm mb-6 font-medium">Based on your interests:</p>
              <div className="space-y-4">
                {recommendations.map(career => (
                  <div key={career.id} className="bg-white/10 dark:bg-white/20 backdrop-blur-md p-4 rounded-2xl flex justify-between items-center group cursor-pointer hover:bg-white/20 dark:hover:bg-white/30 transition">
                    <span className="font-bold">{career.title}</span>
                    <button onClick={() => toggleSave(career.id)} className="text-white opacity-40 group-hover:opacity-100 transition">
                      <Heart size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </section>

            <section className="border-4 border-slate-900 dark:border-slate-700 p-8 rounded-[40px]">
              <h3 className="text-xl font-black uppercase italic mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b-2 border-slate-100 dark:border-slate-700">
                  <span className="text-slate-500 dark:text-slate-400 font-bold uppercase text-xs tracking-widest">Saved Careers</span>
                  <span className="text-2xl font-black">{savedCareers.length}</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b-2 border-slate-100 dark:border-slate-700">
                  <span className="text-slate-500 dark:text-slate-400 font-bold uppercase text-xs tracking-widest">Quizzes Done</span>
                  <span className="text-2xl font-black">{quizResults.length}</span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
