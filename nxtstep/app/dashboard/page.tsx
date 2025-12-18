"use client";

import Link from 'next/link';
import React, { useEffect, useState } from "react";
import { Zap, Target, Heart, Award, ArrowRight, User, Settings, LogOut } from "lucide-react";

export interface Career {
  id: number;
  title: string;
  description: string;
  howTo: string;
  salary: string;
  link: string;
  imageUrl: string;
}

const careerOptions: Career[] = [
  {
    id: 1,
    title: 'Doctor',
    description: 'Diagnoses and treats medical conditions.',
    howTo: 'Pass NEET, pursue MBBS/MD.',
    salary: '₹5-30 LPA',
    link: 'https://www.google.com/search?q=doctor+career',
    imageUrl: 'https://www.future-doctor.de/wp-content/uploads/2024/08/shutterstock_2480850611.jpg',
  },
  // ... (keeping your full list from the previous pages)
];

interface QuizResult {
  id: number;
  quizName: string;
  score: number;
  createdAt: string;
}

// ===== Local Storage Helpers =====
const getSavedCareers = (): number[] => {
  if (typeof window === 'undefined') return [];
  return JSON.parse(localStorage.getItem("saved_careers") || "[]");
};

const saveCareer = (careerId: number) => {
  const saved = getSavedCareers();
  if (!saved.includes(careerId)) saved.push(careerId);
  localStorage.setItem("saved_careers", JSON.stringify(saved));
};

const removeCareer = (careerId: number) => {
  const saved = getSavedCareers().filter(id => id !== careerId);
  localStorage.setItem("saved_careers", JSON.stringify(saved));
};

const getQuizResults = (): QuizResult[] => {
  if (typeof window === 'undefined') return [];
  return JSON.parse(localStorage.getItem("quiz_results") || "[]");
};

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);
  const [savedCareers, setSavedCareers] = useState<Career[]>([]);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [recommendations, setRecommendations] = useState<Career[]>([]);

  useEffect(() => {
    setMounted(true);
    const savedIds = getSavedCareers();
    setSavedCareers(careerOptions.filter(c => savedIds.includes(c.id)));
    setQuizResults(getQuizResults());
    setRecommendations(careerOptions.filter(c => !savedIds.includes(c.id)).slice(0, 3));
  }, []);

  const toggleSave = (careerId: number) => {
    const saved = getSavedCareers();
    if (saved.includes(careerId)) {
      removeCareer(careerId);
    } else {
      saveCareer(careerId);
    }
    const updatedSavedIds = getSavedCareers();
    setSavedCareers(careerOptions.filter(c => updatedSavedIds.includes(c.id)));
    setRecommendations(careerOptions.filter(c => !updatedSavedIds.includes(c.id)).slice(0, 3));
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* --- NAVIGATION --- */}
      <nav className="flex items-center justify-between px-8 py-6 border-b border-slate-100 sticky top-0 bg-white z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center text-white font-bold italic">N</div>
          <span className="text-xl font-bold tracking-tight uppercase tracking-tighter">NXTSTEP</span>
        </div>
        <div className="hidden md:flex gap-8 text-sm font-medium text-slate-600">
          <Link href="/home" className="hover:text-orange-600 transition">Home</Link>
          <Link href="/options" className="hover:text-orange-600 transition">Options</Link>
          <Link href="/form" className="hover:text-orange-600 transition">AI Guide</Link>
          <Link href="/dashboard" className="text-orange-600 font-bold">Dashboard</Link>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 text-slate-400 hover:text-slate-900"><Settings size={20} /></button>
          <div className="w-10 h-10 bg-slate-100 rounded-full border-2 border-slate-900 flex items-center justify-center font-bold">JD</div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* --- DASHBOARD HEADER --- */}
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
          
          {/* --- MAIN COLUMN --- */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Favourites Section */}
            <section>
              <h2 className="text-2xl font-black uppercase italic mb-6 flex items-center gap-3">
                <Heart size={24} className="text-orange-600" fill="currentColor" /> My Favourites
              </h2>
              {savedCareers.length === 0 ? (
                <div className="border-4 border-dashed border-slate-200 rounded-3xl p-12 text-center">
                  <p className="text-slate-400 font-bold italic">No careers liked yet. Catch some waves in the Options page!</p>
                  <Link href="/options">
                    <button className="mt-4 bg-slate-900 text-white px-6 py-2 rounded-full font-bold">Explore Now</button>
                  </Link>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {savedCareers.map(career => (
                    <div key={career.id} className="group relative bg-white border-4 border-slate-900 p-6 rounded-3xl shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] hover:shadow-[12px_12px_0px_0px_rgba(234,88,12,1)] transition-all">
                      <button 
                        onClick={() => toggleSave(career.id)}
                        className="absolute top-4 right-4 text-orange-600 hover:scale-125 transition"
                      >
                        <Heart size={20} fill="currentColor" />
                      </button>
                      <h3 className="font-black text-xl uppercase italic mb-1">{career.title}</h3>
                      <p className="text-slate-500 text-sm font-medium mb-4 line-clamp-2">{career.description}</p>
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

            {/* Quiz Section */}
            <section>
              <h2 className="text-2xl font-black uppercase italic mb-6 flex items-center gap-3">
                <Award size={24} className="text-orange-600" /> Recent Quiz Results
              </h2>
              <div className="bg-slate-50 border-4 border-slate-900 rounded-[32px] overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-900 text-white uppercase text-xs tracking-widest">
                    <tr>
                      <th className="px-6 py-4">Quiz Name</th>
                      <th className="px-6 py-4">Score</th>
                      <th className="px-6 py-4 text-right">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y-2 divide-slate-200">
                    {quizResults.length === 0 ? (
                      <tr><td colSpan={3} className="px-6 py-10 text-center font-bold text-slate-400 italic">No missions completed yet.</td></tr>
                    ) : (
                      quizResults.map(q => (
                        <tr key={q.id} className="hover:bg-white transition">
                          <td className="px-6 py-4 font-black italic">{q.quizName}</td>
                          <td className="px-6 py-4">
                            <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full font-black">{q.score}%</span>
                          </td>
                          <td className="px-6 py-4 text-right text-slate-500 font-medium">
                            {new Date(q.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          {/* --- SIDEBAR COLUMN --- */}
          <div className="space-y-12">
            <section className="bg-orange-600 text-white p-8 rounded-[40px] shadow-xl relative overflow-hidden">
              <Target className="absolute -right-4 -bottom-4 opacity-20 w-32 h-32" />
              <h3 className="text-2xl font-black uppercase italic mb-4">AI Recommendations</h3>
              <p className="text-orange-100 text-sm mb-6 font-medium">Based on your interests, we think you'd kill it in these fields:</p>
              <div className="space-y-4">
                {recommendations.map(career => (
                  <div key={career.id} className="bg-white/10 backdrop-blur-md p-4 rounded-2xl flex justify-between items-center group cursor-pointer hover:bg-white/20 transition">
                    <span className="font-bold">{career.title}</span>
                    <button onClick={() => toggleSave(career.id)} className="text-white opacity-40 group-hover:opacity-100 transition">
                      <Heart size={18} />
                    </button>
                  </div>
                ))}
              </div>
              <button className="w-full mt-8 bg-white text-orange-600 py-3 rounded-2xl font-black uppercase italic tracking-widest text-sm hover:scale-[1.02] transition">
                Take New Quiz
              </button>
            </section>

            <section className="border-4 border-slate-900 p-8 rounded-[40px]">
              <h3 className="text-xl font-black uppercase italic mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b-2 border-slate-100">
                  <span className="text-slate-500 font-bold uppercase text-xs tracking-widest">Saved Careers</span>
                  <span className="text-2xl font-black">{savedCareers.length}</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b-2 border-slate-100">
                  <span className="text-slate-500 font-bold uppercase text-xs tracking-widest">Skill Mastery</span>
                  <span className="text-2xl font-black">12%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-bold uppercase text-xs tracking-widest">AI Accuracy</span>
                  <span className="text-2xl font-black text-orange-600">High</span>
                </div>
              </div>
            </section>
          </div>
          
        </div>
      </div>
    </div>
  );
}