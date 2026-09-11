'use client';

import React, { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import {
  CheckCircle2,
  Circle,
  Clock,
  Sparkles,
  Trophy,
  Loader2,
  Send,
  HelpCircle,
  Flame,
  ArrowRight,
  BookOpen,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export interface RoadmapStep {
  title: string;
  description: string;
  duration?: string;
}

export interface InteractiveRoadmapProps {
  roadmapId?: string;
  careerTitle: string;
  steps: RoadmapStep[];
  motivation?: string;
  marketInsight?: string;
  initialCompletedSteps?: number[];
  onProgressChange?: (completedIndices: number[]) => void;
  showCoachButton?: boolean;
}

export default function InteractiveRoadmap({
  roadmapId,
  careerTitle,
  steps,
  motivation,
  marketInsight,
  initialCompletedSteps = [],
  onProgressChange,
  showCoachButton = true,
}: InteractiveRoadmapProps) {
  const [completedSteps, setCompletedSteps] = useState<number[]>(initialCompletedSteps);
  const [isCoachOpen, setIsCoachOpen] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState<number | null>(null);
  const [userChallengeInput, setUserChallengeInput] = useState('');
  const [coachResponse, setCoachResponse] = useState('');
  const [isCoaching, setIsCoaching] = useState(false);
  const [isSavingProgress, setIsSavingProgress] = useState(false);

  useEffect(() => {
    setCompletedSteps(initialCompletedSteps);
  }, [initialCompletedSteps]);

  const totalSteps = steps.length;
  const progressPercent = totalSteps > 0 ? Math.round((completedSteps.length / totalSteps) * 100) : 0;

  // ── Toggle Step Completion ────────────────────────────────────────────────
  const toggleStep = async (stepIndex: number) => {
    const isCompleted = completedSteps.includes(stepIndex);
    const updated = isCompleted
      ? completedSteps.filter((i) => i !== stepIndex)
      : [...completedSteps, stepIndex].sort((a, b) => a - b);

    setCompletedSteps(updated);
    if (onProgressChange) onProgressChange(updated);

    // Save locally
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(`roadmap_progress_${careerTitle}`, JSON.stringify(updated));
      } catch {}
    }

    // Save to Supabase if roadmapId exists
    if (roadmapId && auth.currentUser) {
      setIsSavingProgress(true);
      try {
        const token = await auth.currentUser.getIdToken();
        await fetch('/api/user', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            roadmapId,
            completedSteps: updated,
          }),
        });
      } catch (err) {
        console.warn('Could not save roadmap progress:', err);
      } finally {
        setIsSavingProgress(false);
      }
    }
  };

  // ── Ask AI Milestone Coach ───────────────────────────────────────────────
  const askCoach = async (customPrompt?: string) => {
    const challenge = customPrompt || userChallengeInput.trim();
    setIsCoaching(true);
    setCoachResponse('');
    setIsCoachOpen(true);

    try {
      let token: string | null = null;
      try {
        token = await auth.currentUser?.getIdToken() ?? null;
      } catch {}

      const headers: HeadersInit = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/roadmap/coach', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          career: careerTitle,
          steps,
          completedStepIndices: completedSteps,
          userChallenge: challenge || undefined,
        }),
      });

      if (!res.ok || !res.body) {
        throw new Error('Coach request failed');
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let streamed = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        streamed += decoder.decode(value);
        setCoachResponse(streamed);
      }
    } catch (err) {
      setCoachResponse('Could not connect with your AI Milestone Coach. Please check your connection and try again.');
    } finally {
      setIsCoaching(false);
    }
  };

  const quickPrompts = [
    `What project should I build for the next pending milestone?`,
    `Give me a 2-week daily study plan for this path.`,
    `What are the most common interview questions for ${careerTitle}?`,
    `How can I speed up and complete the remaining milestones faster?`
  ];

  return (
    <div className="space-y-6">
      {/* ── Progress Header Bar ─────────────────────────────────────────── */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 border-2 border-slate-900 shadow-[6px_6px_0px_0px_rgba(234,88,12,1)]">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center font-black text-lg">
              <Flame size={22} className="text-white fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-black text-lg uppercase italic tracking-tight">{careerTitle} Progress</h4>
                {isSavingProgress && <span className="text-[10px] text-orange-400 font-bold animate-pulse">Saving...</span>}
              </div>
              <p className="text-xs text-slate-400 font-bold">
                {completedSteps.length} of {totalSteps} milestones conquered ({progressPercent}%)
              </p>
            </div>
          </div>

          {showCoachButton && (
            <button
              onClick={() => {
                if (!coachResponse) askCoach();
                else setIsCoachOpen(!isCoachOpen);
              }}
              className="flex items-center gap-2 px-4 py-2.5 bg-orange-600 text-white rounded-xl text-xs font-black uppercase tracking-wider hover:bg-orange-500 transition shadow-[3px_3px_0px_0px_rgba(255,255,255,0.2)] active:translate-y-0.5"
            >
              <Sparkles size={14} className="animate-spin text-yellow-300" />
              {isCoachOpen ? 'Hide AI Coach' : 'Ask AI Milestone Coach'}
            </button>
          )}
        </div>

        {/* Progress Bar Track */}
        <div className="w-full bg-slate-800 rounded-full h-3.5 p-0.5 overflow-hidden border border-slate-700">
          <div
            className="bg-gradient-to-r from-orange-600 via-amber-500 to-green-500 h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${Math.max(progressPercent, 4)}%` }}
          />
        </div>

        {progressPercent === 100 && (
          <div className="mt-3 flex items-center gap-2 text-green-400 text-xs font-black uppercase tracking-wider bg-green-950/60 p-2 rounded-xl border border-green-800">
            <Trophy size={16} /> All milestones completed! You are industry-ready for {careerTitle}.
          </div>
        )}
      </div>

      {/* ── Motivation & Market Insight ──────────────────────────────────── */}
      {motivation && (
        <div className="bg-orange-50 dark:bg-slate-900 border-2 border-orange-200 dark:border-orange-500/30 rounded-2xl p-4 text-orange-900 dark:text-orange-300 font-bold italic text-sm leading-relaxed">
          ✦ {motivation}
        </div>
      )}

      {marketInsight && (
        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-600 dark:text-slate-300 text-xs font-medium flex items-center gap-2">
          <span>📊</span>
          <span>{marketInsight}</span>
        </div>
      )}

      {/* ── Interactive Step Milestones ───────────────────────────────────── */}
      <div className="space-y-3">
        <p className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
          Interactive Milestones — Check off what you have achieved:
        </p>

        <div className="space-y-3">
          {steps.map((step, idx) => {
            const isDone = completedSteps.includes(idx);
            const isCurrent = !isDone && (idx === 0 || completedSteps.includes(idx - 1));

            return (
              <div
                key={idx}
                className={`group relative rounded-2xl border-2 transition-all p-5 ${
                  isDone
                    ? 'bg-green-50/70 dark:bg-green-950/20 border-green-300 dark:border-green-800 text-slate-700 dark:text-slate-200'
                    : isCurrent
                    ? 'bg-white dark:bg-slate-900 border-orange-500 shadow-[6px_6px_0px_0px_rgba(234,88,12,0.3)]'
                    : 'bg-slate-50/80 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 opacity-80'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Checkbox Button */}
                  <button
                    onClick={() => toggleStep(idx)}
                    className="mt-0.5 flex-shrink-0 transition-transform hover:scale-110 active:scale-95"
                    aria-label={isDone ? `Mark milestone ${idx + 1} as pending` : `Mark milestone ${idx + 1} as completed`}
                  >
                    {isDone ? (
                      <CheckCircle2 size={24} className="text-green-600 dark:text-green-400 fill-green-100 dark:fill-green-950" />
                    ) : (
                      <Circle size={24} className={isCurrent ? "text-orange-500 stroke-[2.5]" : "text-slate-400"} />
                    )}
                  </button>

                  {/* Step Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                          isDone
                            ? 'bg-green-200 dark:bg-green-900 text-green-800 dark:text-green-200'
                            : isCurrent
                            ? 'bg-orange-600 text-white'
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}>
                          {isDone ? 'Completed' : isCurrent ? 'Next Up' : `Milestone ${idx + 1}`}
                        </span>
                        <h4 className={`font-black text-base ${isDone ? 'line-through opacity-75' : 'text-slate-900 dark:text-white'}`}>
                          {step.title}
                        </h4>
                      </div>

                      {step.duration && (
                        <span className="text-[11px] font-mono text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-950/60 px-2 py-0.5 rounded-md font-bold flex items-center gap-1">
                          <Clock size={11} /> {step.duration}
                        </span>
                      )}
                    </div>

                    <p className={`text-sm leading-relaxed ${isDone ? 'text-slate-500 dark:text-slate-400' : 'text-slate-700 dark:text-slate-300'}`}>
                      {step.description}
                    </p>

                    {/* Quick Step AI Advice trigger */}
                    {!isDone && (
                      <button
                        onClick={() => {
                          askCoach(`Give me specific tactical steps and a project idea to finish Milestone ${idx + 1}: "${step.title}"`);
                        }}
                        className="mt-3 inline-flex items-center gap-1.5 text-xs font-black text-orange-600 dark:text-orange-400 hover:text-orange-700 uppercase tracking-wider hover:underline"
                      >
                        <Sparkles size={12} /> Get AI Guidance for this step <ArrowRight size={11} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── AI Milestone Coach Drawer ────────────────────────────────────── */}
      {isCoachOpen && (
        <div className="border-4 border-slate-900 dark:border-orange-500 rounded-[32px] p-6 bg-white dark:bg-slate-900 shadow-[12px_12px_0px_0px_rgba(15,23,42,1)] dark:shadow-[12px_12px_0px_0px_rgba(234,88,12,0.4)] animate-in slide-in-from-top-4 duration-300 space-y-5">
          <div className="flex items-center justify-between border-b-2 border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-orange-600 rounded-xl flex items-center justify-center text-white font-black">
                <Sparkles size={16} />
              </div>
              <div>
                <h3 className="font-black text-lg uppercase italic tracking-tight text-slate-900 dark:text-white">
                  AI Milestone Coach
                </h3>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  Tailored guidance on what you achieved vs. what is still pending
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsCoachOpen(false)}
              className="text-xs font-black uppercase text-slate-400 hover:text-slate-900 dark:hover:text-white px-2 py-1"
            >
              Close
            </button>
          </div>

          {/* Quick Prompts */}
          <div className="space-y-2">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Recommended Topics:</p>
            <div className="flex flex-wrap gap-2">
              {quickPrompts.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => askCoach(prompt)}
                  disabled={isCoaching}
                  className="text-left text-xs bg-slate-100 dark:bg-slate-800 hover:bg-orange-100 dark:hover:bg-orange-950/60 hover:text-orange-700 dark:hover:text-orange-300 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-xl font-medium border border-slate-200 dark:border-slate-700 transition disabled:opacity-50"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Coach Advice Content Box */}
          {(coachResponse || isCoaching) && (
            <div className="bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border-2 border-slate-200 dark:border-slate-800 min-h-[140px] text-sm leading-relaxed text-slate-800 dark:text-slate-200 font-sans whitespace-pre-wrap">
              {coachResponse}
              {isCoaching && (
                <div className="flex items-center gap-2 text-xs font-black uppercase text-orange-600 animate-pulse mt-3">
                  <Loader2 size={14} className="animate-spin" /> Coach is drafting your custom game plan...
                </div>
              )}
            </div>
          )}

          {/* Custom Question Input Form */}
          <div className="flex gap-2">
            <input
              type="text"
              value={userChallengeInput}
              onChange={(e) => setUserChallengeInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && askCoach()}
              placeholder="Ask anything: 'How to build portfolio?', 'What should I study next?', etc."
              disabled={isCoaching}
              className="flex-1 bg-slate-100 dark:bg-slate-800 border-2 border-slate-900 dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50"
            />
            <button
              onClick={() => askCoach()}
              disabled={isCoaching || !userChallengeInput.trim()}
              className="px-5 py-3 bg-slate-900 dark:bg-orange-600 text-white rounded-xl text-xs font-black uppercase tracking-wider hover:bg-orange-600 transition flex items-center gap-1.5 disabled:opacity-40"
            >
              <Send size={14} /> Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
