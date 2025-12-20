'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Loader2, GraduationCap, DollarSign, Clock, CheckCircle, Trophy } from 'lucide-react';
import { Career } from '../components/data'; 

// Define the shape of our new AI response
interface RoadmapStep {
    title: string;
    description: string;
    duration: string;
}

interface RoadmapData {
    steps: RoadmapStep[];
    motivation: string;
}

export default function HowToPursueDetail({ career }: { career: Career }) {
    
    const [roadmapData, setRoadmapData] = useState<RoadmapData | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchRoadmap = async () => {
            setIsLoading(true);
            setRoadmapData(null); 

            let userInterests: string[] = [];
            if (typeof window !== "undefined") {
                const stored = localStorage.getItem("userCareerProfile");
                if (stored) {
                    const parsed = JSON.parse(stored);
                    userInterests = parsed.userInterests || [];
                }
            }

            try {
                const response = await fetch('/api/roadmap', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        career: career.title,
                        interests: userInterests
                    })
                });
                
                const data = await response.json();
                // Ensure we actually got the data structure we expect
                if (data.steps && data.motivation) {
                    setRoadmapData(data);
                }
            } catch (error) {
                console.error("Failed to fetch roadmap", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRoadmap();
    }, [career]); 

    return (
        <div className="h-full text-gray-100 flex flex-col">
            {/* Header */}
            <div className="mb-6 flex-shrink-0">
                <h3 className="font-bold text-3xl text-orange-400 mb-2 flex items-center gap-2">
                    {career.title}
                </h3>
                <p className="text-purple-300 italic text-lg">{career.description}</p>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-8">
                
                {/* 🤖 AI ROADMAP TREE SECTION */}
                <div className="bg-slate-900/50 p-6 rounded-xl border border-purple-500/30 shadow-lg">
                    <h4 className="font-bold text-xl text-white mb-6 flex items-center gap-2">
                        <Sparkles className="text-yellow-400" size={20} />
                        Your Personalized Roadmap
                    </h4>

                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-12 text-purple-300">
                            <Loader2 className="animate-spin mb-4" size={40} />
                            <p className="text-lg font-medium animate-pulse">Designing your path to success...</p>
                            <p className="text-sm text-gray-500 mt-2">Analyzing requirements & skills</p>
                        </div>
                    ) : roadmapData ? (
                        <div className="relative pl-4">
                            {/* The Vertical Tree Line */}
                            <div className="absolute left-4 top-2 bottom-4 w-0.5 bg-gradient-to-b from-purple-500 to-transparent"></div>

                            {/* Render Steps */}
                            <div className="space-y-8">
                                {roadmapData.steps.map((step, index) => (
                                    <div key={index} className="relative flex gap-6 group">
                                        
                                        {/* The Node (Circle) */}
                                        <div className="absolute left-[-5px] bg-slate-900 z-10 p-1">
                                            <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-[0_0_10px_rgba(147,51,234,0.5)] group-hover:scale-110 transition-transform">
                                                {index + 1}
                                            </div>
                                        </div>

                                        {/* The Card Content */}
                                        <div className="ml-8 bg-gray-800/80 p-4 rounded-lg border border-gray-700 hover:border-purple-500 transition-colors w-full">
                                            <div className="flex justify-between items-start mb-2">
                                                <h5 className="font-bold text-lg text-white group-hover:text-purple-300 transition-colors">
                                                    {step.title}
                                                </h5>
                                                <span className="text-xs font-mono text-orange-400 bg-orange-400/10 px-2 py-1 rounded flex items-center gap-1">
                                                    <Clock size={12} /> {step.duration}
                                                </span>
                                            </div>
                                            <p className="text-gray-300 text-sm leading-relaxed">
                                                {step.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* 🏆 THE MOTIVATION FINALE */}
                            <div className="mt-12 ml-8 bg-gradient-to-r from-purple-900/50 to-blue-900/50 p-6 rounded-xl border border-purple-500/50 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <Trophy size={100} />
                                </div>
                                <h5 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                                    <CheckCircle className="text-green-400" /> 
                                    AI Mentor's Note
                                </h5>
                                <p className="text-purple-100 italic font-medium leading-relaxed">
                                    "{roadmapData.motivation}"
                                </p>
                            </div>

                        </div>
                    ) : (
                        // Fallback Logic
                        <div className="text-gray-400 text-center py-4">
                            Could not generate roadmap. Please check your connection.
                        </div>
                    )}
                </div>
                
                {/* Static Data (Colleges & Fees) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-700/50 p-4 rounded-lg border-l-4 border-blue-500">
                        <h4 className="font-semibold text-white mb-1 flex items-center gap-2">
                            <GraduationCap size={18} /> Top Colleges
                        </h4>
                        <p className="text-sm text-gray-300">{career.colleges}</p>
                    </div>
                    <div className="bg-gray-700/50 p-4 rounded-lg border-l-4 border-green-500">
                        <h4 className="font-semibold text-white mb-1 flex items-center gap-2">
                            <DollarSign size={18} /> Avg. Investment
                        </h4>
                        <p className="text-sm text-gray-300">{career.fees}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}