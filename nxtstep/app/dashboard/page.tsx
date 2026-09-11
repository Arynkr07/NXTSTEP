"use client";

import Link from 'next/link';
import React, { useEffect, useState, useCallback } from "react";
import { Zap, Target, Heart, Award, ArrowRight, X, Play, CheckCircle2, Flame, Sparkles, Trash2 } from "lucide-react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { careerOptions } from '../components/data';
import { RevealOnScroll } from '../components/reveal';
import { TiltCard } from '../components/tilteffect';
import InteractiveRoadmap, { RoadmapStep } from '../components/InteractiveRoadmap';
import ConfirmModal from '../components/ConfirmModal';

export interface Career {
  id: number;
  title: string;
  description: string;
  salary: string;
  link: string;
  imageUrl: string;
}

interface SavedRoadmap {
  id: string;
  career_title: string;
  skills_input: string[];
  roadmap_content?: string;
  completed_steps?: number[];
  created_at: string;
}

interface SavedCareerRow {
  career_id: number;
  career_title: string;
}

function parseRoadmapSteps(rawContent?: string): { steps: RoadmapStep[]; motivation?: string; marketInsight?: string } {
  if (!rawContent) {
    return {
      steps: [
        { title: "Core Fundamentals & Theory", description: "Establish solid ground fundamentals in foundational concepts.", duration: "Months 1-3" },
        { title: "Hands-on Project Development", description: "Build 2-3 real projects implementing core industry workflows.", duration: "Months 4-6" },
        { title: "Portfolio & GitHub Deployment", description: "Document projects with live demos, clean READMEs, and case studies.", duration: "Months 7-9" },
        { title: "Industry Networking & Mock Interviews", description: "Engage with hiring managers and practice domain-specific technical challenges.", duration: "Months 10-12" }
      ],
      motivation: "Consistent execution across each milestone leads to mastery."
    };
  }

  try {
    const jsonMatch = rawContent.match(/```(?:json)?\s*([\s\S]*?)```/) || rawContent.match(/(\{[\s\S]*\})/);
    const jsonStr = jsonMatch ? jsonMatch[1] : rawContent;
    const parsed = JSON.parse(jsonStr.trim());
    if (parsed.steps && Array.isArray(parsed.steps)) {
      return {
        steps: parsed.steps,
        motivation: parsed.motivation,
        marketInsight: parsed.marketInsight
      };
    }
  } catch {}

  return {
    steps: [
      { title: "Milestone 1: Foundations", description: rawContent.slice(0, 180), duration: "0-3 mos" },
      { title: "Milestone 2: Practice & Execution", description: "Build and test projects grounded in real employer requirements.", duration: "3-6 mos" },
      { title: "Milestone 3: Advanced Specialization", description: "Master advanced tools and frameworks for maximum leverage.", duration: "6-9 mos" },
      { title: "Milestone 4: Career Launch", description: "Polish resume, portfolio, and apply for high-growth positions.", duration: "9-12 mos" }
    ],
    motivation: "Take each milestone one step at a time."
  };
}

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);
  const [savedCareerIds, setSavedCareerIds] = useState<number[]>([]);
  const [savedRoadmaps, setSavedRoadmaps] = useState<SavedRoadmap[]>([]);
  const [selectedRoadmap, setSelectedRoadmap] = useState<SavedRoadmap | null>(null);
  const [currentUser, setCurrentUser] = useState<{ uid: string; email: string | null } | null>(null);
  const router = useRouter();

  // ── Fetch user data from Supabase via API + localStorage backup ─────────
  const fetchUserData = useCallback(async (user: { uid: string; email: string | null; getIdToken: () => Promise<string> }) => {
    let serverRoadmaps: SavedRoadmap[] = [];
    let serverCareerIds: number[] = [];

    try {
      const token = await user.getIdToken();
      const res = await fetch('/api/user', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json() as {
          savedCareers: SavedCareerRow[];
          savedRoadmaps: SavedRoadmap[];
        };
        serverCareerIds = (data.savedCareers ?? []).map((c) => c.career_id);
        serverRoadmaps = data.savedRoadmaps ?? [];
      }
    } catch (err) {
      console.warn("Dashboard fetch warning:", err);
    }

    // Merge with localStorage roadmaps
    let combinedRoadmaps = [...serverRoadmaps];
    try {
      const local = localStorage.getItem('nxtstep_saved_roadmaps');
      if (local) {
        const parsedLocal = JSON.parse(local) as SavedRoadmap[];
        if (Array.isArray(parsedLocal)) {
          const titles = new Set(combinedRoadmaps.map((r) => r.career_title.toLowerCase()));
          for (const lr of parsedLocal) {
            if (lr?.career_title && !titles.has(lr.career_title.toLowerCase())) {
              combinedRoadmaps.push(lr);
              titles.add(lr.career_title.toLowerCase());
            }
          }
        }
      }
    } catch {}

    setSavedCareerIds(serverCareerIds);
    setSavedRoadmaps(combinedRoadmaps);
  }, []);

  // ── Auth listener ──────────────────────────────────────────────────────────
  useEffect(() => {
    setMounted(true);
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        fetchUserData(user);
        user.getIdToken().then((token) => {
          fetch('/api/user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ email: user.email }),
          }).catch(() => {});
        });
      } else {
        router.push("/login");
      }
    });
    return () => unsub();
  }, [router, fetchUserData]);

  // ── Toggle saved career ────────────────────────────────────────────────────
  const toggleSave = async (careerId: number) => {
    if (!currentUser) return;
    const isSaved = savedCareerIds.includes(careerId);
    const career = careerOptions.find((c) => c.id === careerId);

    // Optimistic UI update
    setSavedCareerIds((prev) =>
      isSaved ? prev.filter((id) => id !== careerId) : [...prev, careerId]
    );

    try {
      const token = await (currentUser as unknown as { getIdToken: () => Promise<string> }).getIdToken();
      await fetch('/api/user/career', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          careerId,
          careerTitle: career?.title ?? String(careerId),
          action: isSaved ? 'unsave' : 'save',
        }),
      });
    } catch (err) {
      console.error("Error toggling saved career:", err);
      setSavedCareerIds((prev) =>
        isSaved ? [...prev, careerId] : prev.filter((id) => id !== careerId)
      );
    }
  };

  const [deleteModalState, setDeleteModalState] = useState<{
    isOpen: boolean;
    type: 'single' | 'all';
    roadmap?: SavedRoadmap;
  }>({ isOpen: false, type: 'single' });

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/landing");
  };

  const promptClearAllRoadmaps = () => {
    setDeleteModalState({ isOpen: true, type: 'all' });
  };

  const promptDeleteSingleRoadmap = (e: React.MouseEvent, roadmap: SavedRoadmap) => {
    e.stopPropagation();
    setDeleteModalState({ isOpen: true, type: 'single', roadmap });
  };

  const handleConfirmDelete = async () => {
    if (deleteModalState.type === 'all') {
      try {
        localStorage.removeItem('nxtstep_saved_roadmaps');
      } catch {}

      if (currentUser) {
        try {
          const token = await (currentUser as unknown as { getIdToken: () => Promise<string> }).getIdToken();
          await Promise.all(
            savedRoadmaps.map((r) =>
              fetch(`/api/user?roadmapId=${r.id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
              })
            )
          );
        } catch {}
      }
      setSavedRoadmaps([]);
      setSelectedRoadmap(null);
    } else if (deleteModalState.type === 'single' && deleteModalState.roadmap) {
      const roadmap = deleteModalState.roadmap;
      setSavedRoadmaps((prev) => prev.filter((r) => r.id !== roadmap.id && r.career_title !== roadmap.career_title));
      if (selectedRoadmap?.id === roadmap.id) {
        setSelectedRoadmap(null);
      }

      try {
        const local = localStorage.getItem('nxtstep_saved_roadmaps');
        if (local) {
          const parsed = JSON.parse(local) as SavedRoadmap[];
          const filtered = parsed.filter((r) => r.id !== roadmap.id && r.career_title?.toLowerCase() !== roadmap.career_title?.toLowerCase());
          localStorage.setItem('nxtstep_saved_roadmaps', JSON.stringify(filtered));
        }
      } catch {}

      if (currentUser) {
        try {
          const token = await (currentUser as unknown as { getIdToken: () => Promise<string> }).getIdToken();
          await fetch(`/api/user?roadmapId=${roadmap.id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
          });
        } catch (err) {
          console.warn("Could not delete from Supabase:", err);
        }
      }
    }
    setDeleteModalState({ isOpen: false, type: 'single' });
  };

  const handleRoadmapProgressUpdate = (roadmapId: string, updatedIndices: number[]) => {
    setSavedRoadmaps((prev) => {
      const updated = prev.map((r) => (r.id === roadmapId ? { ...r, completed_steps: updatedIndices } : r));
      try {
        localStorage.setItem('nxtstep_saved_roadmaps', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  if (!mounted || !currentUser) return null;

  const savedCareers = careerOptions.filter((c) => savedCareerIds.includes(c.id));
  const recommendations = careerOptions
    .filter((c) => !savedCareerIds.includes(c.id))
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 font-sans">
      <RevealOnScroll>
      <div className="max-w-7xl mx-auto px-8 py-12">
        <header className="mb-12 flex justify-between items-start">
          <div>
            <TiltCard>
            <div className="flex items-center gap-2 text-orange-600 font-bold text-sm uppercase tracking-widest mb-2">
              <Zap size={16} fill="currentColor" />
              <span>Progress Command Center</span>
            </div>
            <h1 className="text-6xl font-black uppercase italic tracking-tighter">
              Student <span className="text-orange-600">Dashboard*</span>
            </h1>
            </TiltCard>
          </div>
          <button
            onClick={handleLogout}
            className="bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-xl text-xs font-black uppercase italic hover:bg-red-500 hover:text-white transition"
          >
            Logout
          </button>
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-12">

            {/* ── Saved Roadmaps Section (Interactive with Progress) ────────── */}
            <section>
              <TiltCard>
              <div className="flex justify-between items-end mb-6">
                <div>
                  <h2 className="text-2xl font-black uppercase italic flex items-center gap-3">
                    <Award size={24} className="text-orange-600" /> Active Career Roadmaps
                  </h2>
                  <p className="text-slate-400 text-xs font-bold mt-1">
                    Click any roadmap to track milestone progress or consult the AI Milestone Coach
                  </p>
                </div>
                {savedRoadmaps.length > 0 && (
                  <button
                    onClick={promptClearAllRoadmaps}
                    className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-700 underline decoration-2 underline-offset-4"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {savedRoadmaps.length === 0 ? (
                <div className="border-4 border-dashed border-slate-200 dark:border-slate-800 rounded-[32px] p-12 text-center bg-slate-50 dark:bg-slate-900">
                  <p className="font-bold text-slate-400 dark:text-slate-500 italic mb-4">
                    No active roadmaps generated yet.
                  </p>
                  <button
                    onClick={() => router.push("/quiz")}
                    className="bg-slate-900 dark:bg-orange-600 text-white px-6 py-3 rounded-full font-black uppercase italic text-xs hover:bg-orange-600 transition"
                  >
                    Take Career Assessment & Generate Roadmap
                  </button>
                </div>
              ) : (
                <div className="grid gap-4">
                  {savedRoadmaps.map((r) => {
                    const parsed = parseRoadmapSteps(r.roadmap_content);
                    const completed = r.completed_steps || [];
                    const percent = Math.round((completed.length / Math.max(parsed.steps.length, 1)) * 100);

                    return (
                      <div
                        key={r.id}
                        onClick={() => setSelectedRoadmap(r)}
                        className="group bg-white dark:bg-slate-900 border-4 border-slate-900 dark:border-slate-700 p-6 rounded-[28px] shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)] hover:shadow-[12px_12px_0px_0px_rgba(234,88,12,1)] transition-all cursor-pointer"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950/80 text-orange-700 dark:text-orange-300 border border-orange-200">
                                {percent}% Done
                              </span>
                              <h3 className="font-black text-2xl uppercase italic text-slate-900 dark:text-white group-hover:text-orange-600 transition">
                                {r.career_title}
                              </h3>
                            </div>
                            <p className="text-xs text-slate-400 font-bold mt-1">
                              {completed.length} of {parsed.steps.length} milestones achieved • Created {new Date(r.created_at).toLocaleDateString()}
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            <button className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-xs font-black uppercase tracking-wider group-hover:bg-orange-600 group-hover:text-white transition">
                              <Sparkles size={13} /> Open Interactive Plan <ArrowRight size={13} />
                            </button>
                            <button
                              onClick={(e) => promptDeleteSingleRoadmap(e, r)}
                              className="p-2 rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 text-slate-400 hover:text-red-600 transition"
                              title="Delete this roadmap"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>

                        {/* Visual Mini Progress Bar */}
                        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
                          <div
                            className="bg-orange-600 h-full rounded-full transition-all duration-500"
                            style={{ width: `${Math.max(percent, 4)}%` }}
                          />
                        </div>

                        {r.skills_input && r.skills_input.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {r.skills_input.slice(0, 4).map((skill, sIdx) => (
                              <span key={sIdx} className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-md text-slate-600 dark:text-slate-300">
                                {skill}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
              </TiltCard>
            </section>

            {/* ── Favourites Section ────────────────────────────────────────── */}
            <section>
              <TiltCard>
              <h2 className="text-2xl font-black uppercase italic mb-6 flex items-center gap-3">
                <Heart size={24} className="text-orange-600" fill="currentColor" /> My Favourites ({savedCareers.length})
              </h2>
              {savedCareers.length === 0 ? (
                <div className="border-4 border-dashed border-slate-200 dark:border-slate-700 rounded-3xl p-12 text-center">
                  <p className="text-slate-400 dark:text-slate-500 font-bold italic">No careers liked yet.</p>
                  <Link href="/options">
                    <button className="mt-4 bg-slate-900 dark:bg-orange-600 text-white px-6 py-2 rounded-full font-bold">
                      Explore Careers
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {savedCareers.map((career) => (
                    <div
                      key={career.id}
                      className="group relative bg-white dark:bg-slate-900 border-4 border-slate-900 dark:border-slate-700 p-6 rounded-3xl shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.2)] hover:shadow-[12px_12px_0px_0px_rgba(234,88,12,1)] transition-all"
                    >
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
                          View Details <ArrowRight size={14} />
                        </span>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
              </TiltCard>
            </section>
          </div>

          {/* ── Sidebar Stats ─────────────────────────────────────────────── */}
          <div className="space-y-12">
            <TiltCard>
            <section className="bg-orange-600 dark:bg-orange-700 text-white p-8 rounded-[40px] shadow-xl relative overflow-hidden">
              <Target className="absolute -right-4 -bottom-4 opacity-20 w-32 h-32" />
              <h3 className="text-2xl font-black uppercase italic mb-4">AI Recommendations</h3>
              <p className="text-orange-100 dark:text-orange-200 text-sm mb-6 font-medium">Careers you haven't explored:</p>
              <div className="space-y-4">
                {recommendations.map((career) => (
                  <div
                    key={career.id}
                    className="bg-white/10 dark:bg-white/20 backdrop-blur-md p-4 rounded-2xl flex justify-between items-center group cursor-pointer hover:bg-white/20 dark:hover:bg-white/30 transition"
                  >
                    <span className="font-bold">{career.title}</span>
                    <button onClick={() => toggleSave(career.id)} className="text-white opacity-40 group-hover:opacity-100 transition">
                      <Heart size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </section>
            </TiltCard>

            <TiltCard>
            <section className="border-4 border-slate-900 dark:border-slate-700 p-8 rounded-[40px]">
              <h3 className="text-xl font-black uppercase italic mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b-2 border-slate-100 dark:border-slate-700">
                  <span className="text-slate-500 dark:text-slate-400 font-bold uppercase text-xs tracking-widest">Saved Careers</span>
                  <span className="text-2xl font-black">{savedCareers.length}</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b-2 border-slate-100 dark:border-slate-700">
                  <span className="text-slate-500 dark:text-slate-400 font-bold uppercase text-xs tracking-widest">Saved Roadmaps</span>
                  <span className="text-2xl font-black">{savedRoadmaps.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400 font-bold uppercase text-xs tracking-widest">Achieved Milestones</span>
                  <span className="text-2xl font-black text-orange-600">
                    {savedRoadmaps.reduce((acc, curr) => acc + (curr.completed_steps?.length || 0), 0)}
                  </span>
                </div>
              </div>
            </section>
            </TiltCard>
          </div>
        </div>
      </div>
      </RevealOnScroll>

      {/* ── Modal for Selected Interactive Roadmap ───────────────────────── */}
      {selectedRoadmap && (() => {
        const parsed = parseRoadmapSteps(selectedRoadmap.roadmap_content);
        return (
          <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/90 backdrop-blur-md p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-950 border-4 border-slate-900 dark:border-orange-500 rounded-[40px] shadow-[20px_20px_0px_0px_rgba(234,88,12,1)] w-full h-[90vh] max-w-5xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
              {/* Header */}
              <div className="p-6 border-b-4 border-slate-900 dark:border-slate-800 flex justify-between items-center bg-orange-600 text-white">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-orange-200">Interactive Career Blueprint</span>
                  <h2 className="text-3xl font-black uppercase italic tracking-tighter">{selectedRoadmap.career_title}</h2>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => promptDeleteSingleRoadmap(e, selectedRoadmap)}
                    className="flex items-center gap-1.5 bg-slate-900/90 hover:bg-red-700 text-white px-3.5 py-2.5 rounded-2xl border-2 border-white/20 text-xs font-black uppercase tracking-wider transition"
                    title="Delete this roadmap"
                  >
                    <Trash2 size={14} /> Remove Roadmap
                  </button>
                  <button
                    onClick={() => setSelectedRoadmap(null)}
                    className="bg-slate-900 text-white p-3 rounded-2xl border-2 border-slate-900 hover:bg-white hover:text-slate-900 transition shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] active:translate-y-0.5"
                  >
                    <X size={20} strokeWidth={3} />
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                <InteractiveRoadmap
                  roadmapId={selectedRoadmap.id}
                  careerTitle={selectedRoadmap.career_title}
                  steps={parsed.steps}
                  motivation={parsed.motivation}
                  marketInsight={parsed.marketInsight}
                  initialCompletedSteps={selectedRoadmap.completed_steps || []}
                  onProgressChange={(updated) => handleRoadmapProgressUpdate(selectedRoadmap.id, updated)}
                  showCoachButton={true}
                />
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── Custom UI Confirmation Modal for Deletions ──────────────────────── */}
      <ConfirmModal
        isOpen={deleteModalState.isOpen}
        type="danger"
        title={deleteModalState.type === 'all' ? "Clear All Roadmaps?" : "Delete Career Roadmap?"}
        description={
          deleteModalState.type === 'all'
            ? "Are you sure you want to clear all active roadmaps? Your milestone progress will be reset."
            : `Are you sure you want to remove the roadmap for "${deleteModalState.roadmap?.career_title}"? Your milestone progress will be removed.`
        }
        confirmText={deleteModalState.type === 'all' ? "Yes, Clear All" : "Yes, Delete Roadmap"}
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteModalState({ isOpen: false, type: 'single' })}
      />
    </div>
  );
}