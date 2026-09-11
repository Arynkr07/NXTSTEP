"use client";

import { useState } from "react";
import CareerAssessmentQuiz from "./CareerAssessmentQuiz";
import type { AssessmentResponse } from "./types";

export default function QuizPage() {
  const [assessment, setAssessment] = useState<AssessmentResponse | null>(null);

  if (assessment) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8 text-slate-900 dark:text-white">
        <div className="mx-auto max-w-4xl rounded-[32px] border-4 border-slate-900 bg-white p-8 shadow-[12px_12px_0_rgba(15,23,42,1)] dark:border-slate-700 dark:bg-slate-900">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-orange-600">Assessment complete</p>
          <h1 className="mt-3 text-3xl font-black uppercase italic tracking-tight">Your Career Direction</h1>

          <div className="mt-6 space-y-4 rounded-2xl border-2 border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-800">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Primary match</p>
              <p className="mt-2 text-2xl font-black text-orange-600">{assessment.primaryCareer}</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Confidence</p>
                <p className="mt-2 text-xl font-bold">{assessment.confidenceScore}%</p>
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Recommended path</p>
                <p className="mt-2 text-xl font-bold">{assessment.recommendedPath}</p>
              </div>
            </div>

            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Why this fits</p>
              <p className="mt-2 text-base leading-relaxed text-slate-700 dark:text-slate-200">{assessment.summary}</p>
            </div>
          </div>

          <button
            onClick={() => setAssessment(null)}
            className="mt-8 rounded-xl bg-slate-900 px-6 py-3 text-sm font-black uppercase tracking-[0.2em] text-white transition hover:bg-orange-600"
          >
            Retake Quiz
          </button>
        </div>
      </div>
    );
  }

  return <CareerAssessmentQuiz onAssessmentComplete={setAssessment} />;
}