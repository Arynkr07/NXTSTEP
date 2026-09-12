'use client';

import React, { useEffect, useState } from 'react';
import { auth } from "@/lib/firebase";
import {
  Heart,
  CheckCircle,
  ArrowRight,
  X,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Building2,
  CheckCircle2,
  Layers,
  Award
} from 'lucide-react';
import HowToPursueDetail from './HowToPursueDetail';
import { Career, careerOptions } from '../components/data';
import { AssessmentResponse, CareerRecommendationResult } from './types';

interface RecommendationsModalProps {
  onClose: () => void;
  onRetake: () => void;
  assessmentData?: AssessmentResponse | null;
  recommendations: Career[];
  selectedCareer: Career | null;
  setSelectedCareer: (career: Career | null) => void;
}

export default function RecommendationsModal({
  onClose,
  onRetake,
  assessmentData,
  recommendations,
  selectedCareer,
  setSelectedCareer,
}: RecommendationsModalProps) {
  const [savedIds, setSavedIds] = useState<number[]>([]);

  // ── Load saved careers from Supabase API ─────────────────────────────────
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    user.getIdToken().then((token) => {
      fetch('/api/user/career', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((r) => r.json() as Promise<{ savedCareers: Array<{ career_id: number }> }>)
        .then((data) => {
          setSavedIds((data.savedCareers ?? []).map((c) => c.career_id));
        })
        .catch(() => {});
    });
  }, []);

  // ── Toggle favourite ─────────────────────────────────────────────────────
  const handleToggleFavorite = async (id: number) => {
    const user = auth.currentUser;
    if (!user) return;

    const isSaved = savedIds.includes(id);
    const career = recommendations.find((c) => c.id === id);

    setSavedIds((prev) => (isSaved ? prev.filter((i) => i !== id) : [...prev, id]));

    try {
      const token = await user.getIdToken();
      const res = await fetch('/api/user/career', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          careerId: id,
          careerTitle: career?.title ?? String(id),
          action: isSaved ? 'unsave' : 'save',
        }),
      });
      if (!res.ok) {
        throw new Error('Failed to save to database');
      }
    } catch (err) {
      console.error('Error saving career from modal:', err);
      setSavedIds((prev) => (isSaved ? [...prev, id] : prev.filter((i) => i !== id)));
    }
  };

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const isCurrentCareerSaved = selectedCareer ? savedIds.includes(selectedCareer.id) : false;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/90 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-950 border-4 border-slate-900 dark:border-orange-500 rounded-[40px] shadow-[20px_20px_0px_0px_rgba(234,88,12,1)] w-full h-[92vh] max-w-7xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* ── Top Header ─────────────────────────────────────────────────── */}
        <div className="p-6 border-b-4 border-slate-900 dark:border-slate-800 flex justify-between items-center bg-orange-600 text-white">
          <div className="flex items-center gap-4">
            <div className="bg-slate-900 p-2.5 rounded-2xl border-2 border-white shadow-[3px_3px_0px_0px_rgba(255,255,255,1)]">
              <Sparkles size={22} className="text-yellow-300" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-orange-200">
                AI Career Matching Engine
              </span>
              <h2 className="text-3xl font-black uppercase italic tracking-tighter">AI Career Blueprint*</h2>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={onRetake}
              className="bg-orange-700 text-white px-4 py-2 rounded-2xl border-2 border-orange-400 hover:bg-orange-500 transition shadow-[3px_3px_0px_0px_rgba(251,146,60,1)] active:translate-y-1 font-black uppercase text-xs"
            >
              Retake Quiz
            </button>
            <button
              onClick={onClose}
              className="bg-slate-900 text-white p-3 rounded-2xl border-2 border-slate-900 hover:bg-white hover:text-slate-900 transition shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] active:translate-y-1"
            >
              <X size={22} strokeWidth={3} />
            </button>
          </div>
        </div>

        {/* ── AI Executive Synthesis Banner (if assessmentData exists) ───── */}
        {assessmentData && (
          <div className="bg-slate-900 text-white px-8 py-4 border-b-2 border-slate-800 grid md:grid-cols-3 gap-4 text-xs font-medium">
            <div className="flex items-start gap-2.5">
              <Sparkles size={16} className="text-orange-400 mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-black uppercase tracking-wider text-orange-400 block text-[10px]">Strategic Summary</span>
                <p className="text-slate-300 line-clamp-2">{assessmentData.overallInsight}</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <TrendingUp size={16} className="text-green-400 mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-black uppercase tracking-wider text-green-400 block text-[10px]">Competitive Edge</span>
                <p className="text-slate-300 line-clamp-2">{assessmentData.biggestStrength}</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <AlertTriangle size={16} className="text-amber-400 mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-black uppercase tracking-wider text-amber-400 block text-[10px]">Strategic Watch-out</span>
                <p className="text-slate-300 line-clamp-2">{assessmentData.watchOut}</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-1 overflow-hidden">
          {/* ── LEFT: Career Matches List ─────────────────────────────────── */}
          <div className="w-1/3 p-6 border-r-4 border-slate-900 dark:border-slate-800 overflow-y-auto space-y-4 bg-slate-50 dark:bg-slate-900 custom-scrollbar">
            <p className="text-slate-500 dark:text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] mb-2">
              Top Matched Career Paths ({recommendations.length})
            </p>

            {recommendations.map((career) => {
              const isSelected = selectedCareer?.id === career.id;
              const isSaved = savedIds.includes(career.id);

              return (
                <div
                  key={career.id}
                  onClick={() => setSelectedCareer(career)}
                  className={`p-5 rounded-2xl border-4 transition-all cursor-pointer relative ${
                    isSelected
                      ? 'bg-orange-50 dark:bg-slate-800 border-orange-600 shadow-[6px_6px_0px_0px_rgba(234,88,12,1)] -translate-y-0.5'
                      : 'bg-white dark:bg-slate-950 border-slate-900 dark:border-slate-700 hover:border-orange-400 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-slate-900 text-white">
                      {career.matchPercentage || 92}% Match
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleFavorite(career.id);
                      }}
                      className="text-slate-400 hover:text-orange-600 transition"
                    >
                      <Heart size={18} fill={isSaved ? '#ea580c' : 'none'} color={isSaved ? '#ea580c' : 'currentColor'} />
                    </button>
                  </div>

                  <h3 className="font-black text-xl uppercase italic tracking-tight text-slate-900 dark:text-white leading-none mb-2">
                    {career.title}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">
                    {career.description}
                  </p>

                  <div className="flex items-center justify-between text-[10px] font-black uppercase text-orange-600 dark:text-orange-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span>{career.salary}</span>
                    <span className="flex items-center gap-1">
                      View Roadmap <ArrowRight size={11} />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── RIGHT: Detailed Roadmap & Blueprint ──────────────────────── */}
          <div className="w-2/3 p-8 md:p-10 overflow-y-auto bg-white dark:bg-slate-950 flex flex-col custom-scrollbar">
            {selectedCareer ? (
              <div className="flex-1 flex flex-col min-h-0 animate-in slide-in-from-right-4 duration-300">
                <div className="flex justify-between items-start mb-8 pb-6 border-b-2 border-slate-100 dark:border-slate-800 flex-shrink-0">
                  <div className="max-w-[65%]">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-orange-100 dark:bg-orange-950/80 text-orange-600 px-3 py-0.5 rounded-full font-black text-xs uppercase tracking-widest border border-orange-200">
                        {selectedCareer.matchPercentage || 94}% Compatibility
                      </span>
                    </div>
                    <h3 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter text-slate-900 dark:text-white leading-[0.95]">
                      {selectedCareer.title}
                    </h3>
                  </div>

                  <button
                    onClick={() => handleToggleFavorite(selectedCareer.id)}
                    className={`flex items-center gap-2.5 px-6 py-3.5 rounded-2xl font-black uppercase italic tracking-wider text-xs transition-all border-4 border-slate-900 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] active:translate-y-0.5 ${
                      isCurrentCareerSaved
                        ? 'bg-orange-600 text-white'
                        : 'bg-white text-slate-900 hover:bg-orange-50'
                    }`}
                  >
                    <Heart size={16} fill={isCurrentCareerSaved ? 'white' : 'none'} strokeWidth={3} />
                    {isCurrentCareerSaved ? 'Saved to Dashboard' : 'Bookmark Career'}
                  </button>
                </div>

                <HowToPursueDetail career={selectedCareer} />
              </div>
            ) : (
              <div className="h-full flex flex-col justify-center items-center text-center p-12">
                <div className="w-20 h-20 bg-orange-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6 border-4 border-orange-600">
                  <ArrowRight size={36} className="text-orange-600 -rotate-90" />
                </div>
                <h3 className="text-3xl font-black uppercase italic tracking-tighter text-slate-900 dark:text-white">
                  Select a Matched Career
                </h3>
                <p className="text-slate-400 mt-2 max-w-sm font-bold italic text-sm">
                  Click any career blueprint on the left to launch your live streaming roadmap and milestone coach.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}