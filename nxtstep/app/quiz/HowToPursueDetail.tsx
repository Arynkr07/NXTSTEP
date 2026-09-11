'use client';

import React from 'react';
import { GraduationCap, DollarSign, BookOpen, ExternalLink, Star, Sparkles } from 'lucide-react';
import { Career, getCoursesForCareer } from '../components/data';
import StreamingRoadmap from './StreamingRoadmap';

export default function HowToPursueDetail({ career }: { career: Career }) {
    // Load user interests from localStorage for roadmap personalization
    let userInterests: string[] = [];
    if (typeof window !== 'undefined') {
        try {
            const stored = localStorage.getItem('userCareerProfile');
            if (stored) {
                const parsed = JSON.parse(stored);
                userInterests = parsed.userInterests || [];
            }
        } catch {
            // Ignore
        }
    }

    const courses = getCoursesForCareer(career);

    return (
        <div className="h-full text-gray-100 flex flex-col">
            {/* ── Career Header ────────────────────────────────────────────── */}
            <div className="mb-5 flex-shrink-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="bg-orange-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                        {career.marketInsights?.demandLevel || 'High'} Demand
                    </span>
                    {career.marketInsights?.growthRate && (
                        <span className="bg-slate-800 text-orange-400 border border-orange-500/30 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                            {career.marketInsights.growthRate}
                        </span>
                    )}
                </div>
                <h3 className="font-bold text-2xl text-orange-400 mb-1">{career.title}</h3>
                <p className="text-slate-300 text-sm leading-relaxed line-clamp-3">{career.description}</p>
            </div>

            <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar space-y-6">

                {/* ── AI Roadmap Section ────────────────────────────────────── */}
                <div className="rounded-2xl overflow-hidden border-2 border-orange-500/40">
                    {/* Section header */}
                    <div className="bg-slate-900 border-b-2 border-orange-500/30 px-4 py-3 flex items-center gap-2">
                        <Sparkles size={14} className="text-orange-400" />
                        <span className="text-xs font-black uppercase tracking-widest text-orange-400">
                            AI Career Roadmap
                        </span>
                        <span className="ml-auto text-[10px] text-slate-500 font-medium">
                            Personalized to your profile
                        </span>
                    </div>
                    {/* White card for roadmap content */}
                    <div className="bg-white p-5">
                        <StreamingRoadmap
                            career={career.title}
                            userInterests={userInterests}
                        />
                    </div>
                </div>

                {/* ── Recommended Courses ────────────────────────────────────── */}
                {courses.length > 0 && (
                    <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-800 shadow-md">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="font-black uppercase italic tracking-wider text-base text-white flex items-center gap-2">
                                <BookOpen className="text-orange-500" size={18} />
                                Recommended Courses
                            </h4>
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                Coursera • edX • Udemy
                            </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {courses.map((course, idx) => (
                                <a
                                    key={idx}
                                    href={course.link}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="bg-slate-800/80 hover:bg-slate-800 p-4 rounded-xl border border-slate-700 hover:border-orange-500 transition group flex flex-col justify-between"
                                >
                                    <div>
                                        <div className="flex justify-between items-start mb-2">
                                            <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${
                                                course.platform === 'Coursera'
                                                    ? 'bg-blue-600/30 text-blue-300 border border-blue-500/40'
                                                    : course.platform === 'edX'
                                                    ? 'bg-red-600/30 text-red-300 border border-red-500/40'
                                                    : 'bg-purple-600/30 text-purple-300 border border-purple-500/40'
                                            }`}>
                                                {course.platform}
                                            </span>
                                            <div className="flex items-center gap-1 text-yellow-400 text-xs font-bold">
                                                <Star size={12} fill="currentColor" /> {course.rating}
                                            </div>
                                        </div>
                                        <h5 className="font-bold text-sm text-white group-hover:text-orange-400 transition mb-1">
                                            {course.title}
                                        </h5>
                                        <p className="text-slate-400 text-xs mb-3">{course.provider}</p>
                                    </div>
                                    <div className="flex items-center justify-between text-[11px] text-slate-300 pt-2 border-t border-slate-700/60 font-medium">
                                        <span>{course.difficulty} • {course.duration}</span>
                                        <span className="text-orange-400 font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                                            Enroll <ExternalLink size={12} />
                                        </span>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                )}

                {/* ── Colleges & Fees ──────────────────────────────────────── */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
                    <div className="bg-gray-800/60 p-4 rounded-xl border-l-4 border-blue-500">
                        <h4 className="font-semibold text-white mb-1 flex items-center gap-2">
                            <GraduationCap size={18} className="text-blue-400" /> Top Institutes
                        </h4>
                        <p className="text-sm text-gray-300">
                            {career.colleges || 'Top Technical & Design Universities'}
                        </p>
                    </div>
                    <div className="bg-gray-800/60 p-4 rounded-xl border-l-4 border-green-500">
                        <h4 className="font-semibold text-white mb-1 flex items-center gap-2">
                            <DollarSign size={18} className="text-green-400" /> Estimated Investment
                        </h4>
                        <p className="text-sm text-gray-300">{career.fees || '₹ 3 - 8 Lakhs'}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
