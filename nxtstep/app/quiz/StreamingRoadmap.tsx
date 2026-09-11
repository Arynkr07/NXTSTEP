'use client';

import React, { useState, useRef, useCallback } from 'react';
import { auth } from '@/lib/firebase';
import { Sparkles, Loader2, Save, CheckCircle, AlertCircle } from 'lucide-react';
import SkillInput from './SkillInput';
import InteractiveRoadmap from '@/app/components/InteractiveRoadmap';

interface RoadmapStep {
  title: string;
  description: string;
  duration: string;
}

interface ParsedRoadmap {
  steps: RoadmapStep[];
  motivation: string;
  marketInsight?: string;
  courses?: Array<{ title: string; url: string; platform: string }>;
}

interface StreamingRoadmapProps {
  career: string;
  userInterests?: string[];
}

type Phase = 'idle' | 'skill-input' | 'loading' | 'streaming' | 'done' | 'error';

export default function StreamingRoadmap({ career, userInterests = [] }: StreamingRoadmapProps) {
  const [phase, setPhase] = useState<Phase>('idle');
  const [userSkills, setUserSkills] = useState<string[]>([]);
  const [rawText, setRawText] = useState('');
  const [parsed, setParsed] = useState<ParsedRoadmap | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  const rawTextRef = useRef('');

  const tryParseRoadmap = (text: string): ParsedRoadmap | null => {
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/) || text.match(/(\{[\s\S]*\})/);
      const jsonStr = jsonMatch ? jsonMatch[1] : text;
      return JSON.parse(jsonStr.trim());
    } catch {
      return null;
    }
  };

  const generateRoadmap = useCallback(async () => {
    setPhase('loading');
    setRawText('');
    setParsed(null);
    rawTextRef.current = '';

    try {
      let token: string | null = null;
      try {
        token = await auth.currentUser?.getIdToken() ?? null;
      } catch {
        // Unauthenticated — still works in preview mode
      }

      const headers: HeadersInit = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/roadmap', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          career,
          userInterests,
          userSkills,
          save: !!token,
        }),
      });

      if (!res.ok || !res.body) {
        throw new Error(`Server returned ${res.status}`);
      }

      setPhase('streaming');
      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        rawTextRef.current += chunk;
        setRawText((prev) => prev + chunk);
      }

      // Try to parse the complete response as JSON
      const roadmap = tryParseRoadmap(rawTextRef.current);
      if (roadmap?.steps?.length) {
        setParsed(roadmap);
      }

      setPhase('done');

      // Backup to localStorage immediately
      const contentToSave = rawTextRef.current || (roadmap ? JSON.stringify(roadmap) : '');
      if (contentToSave) {
        try {
          const existing = localStorage.getItem('nxtstep_saved_roadmaps');
          const existingArr = existing ? JSON.parse(existing) : [];
          const newEntry = {
            id: `rm-${Date.now()}`,
            career_title: career,
            skills_input: userSkills,
            roadmap_content: contentToSave,
            completed_steps: [],
            created_at: new Date().toISOString(),
          };
          const filtered = existingArr.filter((r: any) => r?.career_title?.toLowerCase() !== career.toLowerCase());
          localStorage.setItem('nxtstep_saved_roadmaps', JSON.stringify([newEntry, ...filtered]));
        } catch {}
      }

      // Auto-save to Supabase if logged in
      if (token && contentToSave) {
        try {
          await fetch('/api/roadmap/save', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              careerTitle: career,
              roadmapContent: contentToSave,
              skillsInput: userSkills,
            }),
          });
          setSaveStatus('saved');
        } catch (saveErr) {
          console.warn('[StreamingRoadmap] Auto-save error:', saveErr);
        }
      }
    } catch (err) {
      console.error('[StreamingRoadmap]', err);
      setErrorMsg('Failed to generate roadmap. Please try again.');
      setPhase('error');
    }
  }, [career, userInterests, userSkills]);

  const handleSaveManually = async () => {
    const user = auth.currentUser;
    const contentToSave = rawTextRef.current || (parsed ? JSON.stringify(parsed) : '');
    if (!contentToSave) return;

    // Save to localStorage
    try {
      const existing = localStorage.getItem('nxtstep_saved_roadmaps');
      const existingArr = existing ? JSON.parse(existing) : [];
      const newEntry = {
        id: `rm-${Date.now()}`,
        career_title: career,
        skills_input: userSkills,
        roadmap_content: contentToSave,
        completed_steps: [],
        created_at: new Date().toISOString(),
      };
      const filtered = existingArr.filter((r: any) => r?.career_title?.toLowerCase() !== career.toLowerCase());
      localStorage.setItem('nxtstep_saved_roadmaps', JSON.stringify([newEntry, ...filtered]));
    } catch {}

    if (!user) {
      setSaveStatus('saved');
      return;
    }

    setSaveStatus('saving');
    try {
      const token = await user.getIdToken();
      const res = await fetch('/api/roadmap/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          careerTitle: career,
          roadmapContent: contentToSave,
          skillsInput: userSkills,
        }),
      });

      if (res.ok) {
        setSaveStatus('saved');
      } else {
        setSaveStatus('idle');
      }
    } catch {
      setSaveStatus('idle');
    }
  };

  // ── Idle: show "Generate Roadmap" button ─────────────────────────────────
  if (phase === 'idle') {
    return (
      <div className="space-y-6">
        <div className="border-2 border-slate-200 rounded-2xl p-5 bg-slate-50 space-y-5">
          <SkillInput skills={userSkills} onChange={setUserSkills} />
        </div>
        <button
          onClick={generateRoadmap}
          className="w-full flex items-center justify-center gap-3 px-8 py-5 bg-slate-900 text-white rounded-2xl font-black uppercase italic tracking-widest hover:bg-orange-600 transition shadow-[6px_6px_0px_0px_rgba(234,88,12,0.3)] active:translate-y-1 active:shadow-none"
        >
          <Sparkles size={20} />
          Generate My AI Roadmap
        </button>
      </div>
    );
  }

  // ── Loading skeleton ───────────────────────────────────────────────────────
  if (phase === 'loading') {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-5 bg-slate-200 rounded-full w-3/4" />
        <div className="h-4 bg-slate-100 rounded-full w-full" />
        <div className="h-4 bg-slate-100 rounded-full w-5/6" />
        <div className="space-y-3 mt-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="border-2 border-slate-100 rounded-xl p-4 space-y-2">
              <div className="h-4 bg-slate-200 rounded w-1/3" />
              <div className="h-3 bg-slate-100 rounded w-full" />
              <div className="h-3 bg-slate-100 rounded w-2/3" />
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-400 font-medium flex items-center gap-2 mt-4">
          <Loader2 size={12} className="animate-spin" />
          Searching LinkedIn data and generating your roadmap...
        </p>
      </div>
    );
  }

  // ── Error state ────────────────────────────────────────────────────────────
  if (phase === 'error') {
    return (
      <div className="border-2 border-red-200 rounded-2xl p-6 bg-red-50 text-center space-y-4">
        <AlertCircle className="text-red-500 mx-auto" size={32} />
        <p className="font-bold text-red-700">{errorMsg}</p>
        <button
          onClick={() => setPhase('idle')}
          className="px-6 py-3 bg-slate-900 text-white rounded-xl font-black uppercase text-sm hover:bg-orange-600 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  // ── Streaming / Done: show parsed roadmap or raw text ─────────────────────
  const isStreaming = phase === 'streaming';

  return (
    <div className="space-y-6">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center border-2 border-orange-300">
            {isStreaming ? (
              <Loader2 size={14} className="animate-spin text-orange-600" />
            ) : (
              <CheckCircle size={14} className="text-green-600" />
            )}
          </div>
          <span className="text-xs font-black uppercase tracking-widest text-slate-500">
            {isStreaming ? 'Generating roadmap...' : 'Your AI Roadmap'}
          </span>
        </div>
        {phase === 'done' && saveStatus !== 'saved' && auth.currentUser && (
          <button
            onClick={handleSaveManually}
            disabled={saveStatus === 'saving'}
            className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-slate-900 rounded-xl text-xs font-black uppercase hover:bg-slate-900 hover:text-white transition"
          >
            {saveStatus === 'saving' ? (
              <Loader2 size={12} className="animate-spin" />
            ) : (
              <Save size={12} />
            )}
            Save Roadmap
          </button>
        )}
        {saveStatus === 'saved' && (
          <span className="flex items-center gap-1.5 text-xs font-black text-green-600">
            <CheckCircle size={12} /> Saved
          </span>
        )}
      </div>

      {/* Parsed JSON view */}
      {parsed ? (
        <div className="space-y-6">
          <InteractiveRoadmap
            careerTitle={career}
            steps={parsed.steps}
            motivation={parsed.motivation}
            marketInsight={parsed.marketInsight}
            showCoachButton={true}
          />

          {/* Courses */}
          {parsed.courses && parsed.courses.length > 0 && (
            <div className="space-y-2 pt-4 border-t border-slate-100">
              <p className="text-xs font-black uppercase tracking-widest text-slate-400">Recommended Courses</p>
              {parsed.courses.map((c, i) => (
                <a
                  key={i}
                  href={c.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 border-2 border-slate-100 rounded-xl hover:border-orange-200 hover:bg-orange-50 transition group"
                >
                  <span className="text-sm font-bold text-slate-800 group-hover:text-orange-700">{c.title}</span>
                  <span className="text-[10px] px-2 py-0.5 bg-slate-100 rounded-full font-black text-slate-500">{c.platform}</span>
                </a>
              ))}
            </div>
          )}

          {/* Regenerate */}
          <button
            onClick={() => { setPhase('idle'); setParsed(null); setRawText(''); }}
            className="text-xs text-slate-400 hover:text-orange-600 font-bold underline transition"
          >
            ↩ Regenerate with different skills
          </button>
        </div>
      ) : (
        /* Raw streaming text (while streaming or if JSON parse fails) */
        <div className="bg-slate-50 rounded-2xl p-5 text-sm text-slate-700 font-mono leading-relaxed whitespace-pre-wrap min-h-[120px] border-2 border-slate-100">
          {rawText}
          {isStreaming && (
            <span className="inline-block w-1.5 h-4 bg-orange-500 ml-1 animate-pulse rounded-sm" />
          )}
        </div>
      )}
    </div>
  );
}
