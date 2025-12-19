'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Zap, MessageSquare, Sparkles } from 'lucide-react';

import ChatbotPanel from './ChatbotPanel'; 
import RecommendationsModal from './RecommendationsModal'; 
import { MOCK_CAREERS, Career } from './mockData'; 

export default function GuidancePage() {
    // --- STATE MANAGEMENT ---
    const [recommendedCareers, setRecommendedCareers] = useState<Career[]>([]);
    const [selectedCareer, setSelectedCareer] = useState<Career | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false); 
    const [isProcessing, setIsProcessing] = useState(false);

    // 🧠 IMPROVED ALGORITHM: Weighted Scoring System
    const handleChatCompletion = (userAnswers: any) => { 
        setIsProcessing(true);

        setTimeout(() => {
            const userInterests: string[] = userAnswers.interests || [];
            const userSkills: string[] = userAnswers.skills || [];
            const userWorkStyle: string = userAnswers.workStyle || '';
            
            // 1. Map through ALL careers and assign a score
            const scoredCareers = MOCK_CAREERS.map((career) => {
                let score = 0;

                // A. Interest Match (High Weight: +3 points per match)
                // We check if the career's interests overlap with user's interests
                const matchingInterests = career.relatedInterests?.filter(i => 
                    userInterests.includes(i)
                ).length || 0;
                score += (matchingInterests * 3);

                // B. Skill Match (Medium Weight: +2 points per match)
                const matchingSkills = career.skills?.filter(s => 
                    userSkills.includes(s)
                ).length || 0;
                score += (matchingSkills * 2);

                // C. Work Style Match (Low Weight: +1 point)
                // Loose matching on description
                if (userWorkStyle === 'Hands-on/Practical' && career.description.toLowerCase().includes('build')) score += 1;
                if (userWorkStyle === 'Analytical/Abstract' && career.description.toLowerCase().includes('analyze')) score += 1;
                if (userWorkStyle === 'Hands-on/Practical' && career.title.includes('Engineer')) score += 1; // Extra boost for engineers if hands-on

                return { ...career, score };
            });

            // 2. Sort by Score (Highest first) and Filter out zero scores
            const sortedCareers = scoredCareers
                .filter(c => c.score > 0) // Only keep relevant ones
                .sort((a, b) => b.score - a.score); // Highest score at the top

            // 3. Fallback Logic (Only if genuinely no matches found)
            const finalRecommendations = sortedCareers.length > 0 
                ? sortedCareers.slice(0, 6) // Take top 6 scorers
                : MOCK_CAREERS.slice(0, 5); // Fallback to defaults
                
            // Update Data States
            setRecommendedCareers(finalRecommendations); 
            setSelectedCareer(null); 
            
            // Save to Local Storage
            if (typeof window !== "undefined") {
                const profileData = {
                    topRecommended: finalRecommendations.slice(0, 3).map(c => c.title),
                    userInterests: userInterests,
                    userSkills: userSkills,
                    date: new Date().toDateString()
                };
                localStorage.setItem("userCareerProfile", JSON.stringify(profileData));
            }

            // Stop loading and Open
            setIsProcessing(false);
            setIsModalOpen(true); 

        }, 2500); 
    };
    
    const closeModal = () => setIsModalOpen(false); 

    return (
        <div className="min-h-screen bg-white font-sans text-slate-900 relative">
            {/* --- NAVIGATION --- */}
            <nav className="flex items-center justify-between px-8 py-6 border-b border-slate-100 sticky top-0 bg-white z-50">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center text-white font-bold italic">N</div>
                    <span className="text-xl font-bold tracking-tight uppercase tracking-tighter">NXTSTEP</span>
                </div>
                <div className="hidden md:flex gap-8 text-sm font-medium text-slate-600">
                    <Link href="/home" className="hover:text-orange-600 transition">Home</Link>
                    <Link href="/options" className="hover:text-orange-600 transition">Options</Link>
                    <Link href="/form" className="text-orange-600 font-bold">AI Guide</Link>
                    <Link href="/dashboard" className="hover:text-orange-600 transition">Dashboard</Link>
                </div>
                <Link href="/signup">
                    <button className="bg-slate-900 text-white px-6 py-2 rounded-full font-bold text-sm hover:bg-orange-600 transition shadow-lg">
                        Sign In
                    </button>
                </Link>
            </nav>

            <div className="grid lg:grid-cols-2 min-h-[calc(100vh-88px)]">
                
                {/* --- LEFT SIDE: THE VIBE --- */}
                <div className="bg-slate-50 p-12 flex flex-col justify-center relative overflow-hidden">
                    <div className="z-10 max-w-xl">
                        <div className="flex items-center gap-2 text-orange-600 font-bold text-sm uppercase tracking-widest mb-4">
                            <Sparkles size={18} fill="currentColor" />
                            <span>AI Career Mentor</span>
                        </div>
                        <h1 className="text-7xl md:text-8xl font-black leading-[0.9] mb-8 tracking-tighter uppercase italic">
                            Map Your <br /> 
                            <span className="text-orange-600">Potential*</span>
                        </h1>
                        <p className="text-lg text-slate-500 font-medium leading-relaxed italic border-l-4 border-slate-900 pl-6 mb-8">
                            "Answer a few questions and let our neural engine build a custom roadmap for your future."
                        </p>
                        
                        <div className="flex items-center gap-6 mt-12">
                            <div className="flex -space-x-3">
                                {[1,2,3,4].map(i => (
                                    <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-slate-200 overflow-hidden shadow-sm">
                                        <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="user" />
                                    </div>
                                ))}
                            </div>
                            <p className="text-sm font-bold text-slate-400">Trusted by 12,000+ students</p>
                        </div>
                    </div>

                    {/* Background Decorative Text */}
                    <div className="absolute -bottom-10 left-0 opacity-[0.03] select-none pointer-events-none">
                        <h2 className="text-[250px] font-black italic whitespace-nowrap leading-none">GUIDANCE</h2>
                    </div>
                </div>

                {/* --- RIGHT SIDE: THE CHATBOT PANEL --- */}
                <div className="flex items-center justify-center p-8 bg-white border-l border-slate-100">
                    <div className="w-full max-w-lg">
                        <div className="relative border-4 border-slate-900 rounded-[40px] shadow-[16px_16px_0px_0px_rgba(15,23,42,1)] bg-white overflow-hidden min-h-[600px] flex flex-col">
                            
                            {/* Chat Header */}
                            <div className="bg-slate-900 p-6 flex items-center justify-between text-white">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center animate-pulse">
                                        <MessageSquare size={20} fill="white" />
                                    </div>
                                    <div>
                                        <h3 className="font-black uppercase italic tracking-tighter text-lg leading-none">NxtStep AI</h3>
                                        <span className="text-[10px] uppercase font-bold text-orange-400 tracking-widest">Online & Processing</span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <div className="w-2 h-2 rounded-full bg-green-400"></div>
                                    <div className="w-2 h-2 rounded-full bg-slate-700"></div>
                                </div>
                            </div>

                            {/* Actual Chat Component */}
                            <div className="flex-grow overflow-y-auto p-4 custom-chatbot-scrollbar">
                                <ChatbotPanel onChatComplete={handleChatCompletion} />
                            </div>

                            {/* Interactive Footer */}
                            <div className="p-4 bg-slate-50 border-t-2 border-slate-100 text-center">
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                    Your data is encrypted and used only for career matching.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* PROCESSING OVERLAY */}
            {isProcessing && (
                <div className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-slate-900/95 backdrop-blur-md text-white">
                    <div className="flex flex-col items-center animate-pulse">
                        <Zap size={64} className="text-orange-500 mb-6 animate-bounce" />
                        <h2 className="text-4xl font-black italic tracking-tighter uppercase mb-2">Analyzing Profile</h2>
                        <p className="text-slate-400 font-mono text-sm">Mapping your skills to 50+ career paths...</p>
                    </div>
                </div>
            )}

            {/* Recommendations Modal */}
            {isModalOpen && (
                <RecommendationsModal 
                    onClose={closeModal}
                    recommendations={recommendedCareers}
                    selectedCareer={selectedCareer}
                    setSelectedCareer={setSelectedCareer}
                />
            )}
        </div>
    );
}