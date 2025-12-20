"use client";

import React, { useState } from 'react';
import { Zap, MessageSquare, Sparkles } from 'lucide-react';
import ChatbotPanel from './ChatbotPanel'; 
import RecommendationsModal from './RecommendationsModal'; 
import { careerOptions, Career } from '../components/data'; // Ensure path is correct
import { auth, db } from "@/lib/firebase"; 
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import Navbar from '../components/navbar';

export default function GuidancePage() {
    const [recommendedCareers, setRecommendedCareers] = useState<Career[]>([]);
    const [selectedCareer, setSelectedCareer] = useState<Career | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false); 
    const [isProcessing, setIsProcessing] = useState(false);

    // --- REFINED ALGORITHM & FIREBASE SYNC ---
    const handleChatCompletion = async (userAnswers: any) => { 
        setIsProcessing(true);

        // Simulate AI processing time
        setTimeout(async () => {
            const userInterests: string[] = userAnswers.interests || [];
            const userSkills: string[] = userAnswers.skills || [];
            
            // 1. Scoring Logic
            const scoredCareers = careerOptions.map((career) => {
                let score = 0;
                const matchingInterests = career.relatedInterests?.filter(i => userInterests.includes(i)).length || 0;
                score += (matchingInterests * 3);
                const matchingSkills = career.skills?.filter(s => userSkills.includes(s)).length || 0;
                score += (matchingSkills * 2);
                return { ...career, score };
            });

            const sortedCareers = scoredCareers
                .filter(c => c.score > 0)
                .sort((a, b) => b.score - a.score);

            const finalRecommendations = sortedCareers.length > 0 
                ? sortedCareers.slice(0, 6) 
                : careerOptions.slice(0, 5);
                
            // 2. Sync to Firebase
            const currentUser = auth.currentUser;
            if (currentUser) {
                const userRef = doc(db, "users", currentUser.uid);
                const topCareerMatch = finalRecommendations[0]?.title || "General Analysis";
                const finalScore = Math.min((sortedCareers[0]?.score || 15) * 4, 100);

                try {
                    await updateDoc(userRef, {
                        vibe: userInterests[0] || "Exploring",
                        // One single update for the Dashboard Table
                        quizResults: arrayUnion({
                            id: Date.now(),
                            quizName: topCareerMatch, // Uses the actual career name!
                            score: finalScore,
                            createdAt: new Date().toISOString()
                        }),
                        userSkills: userSkills
                    });
                    console.log("Success: Mission Data Synced!");
                } catch (error) {
                    console.error("Firebase Sync Error:", error);
                }
            }

            // 3. Update UI
            setRecommendedCareers(finalRecommendations); 
            setIsProcessing(false);
            setIsModalOpen(true); 
        }, 2500);
    };

    return (
        <div className="min-h-screen bg-white font-sans text-slate-900 relative">
            <Navbar />

            <div className="grid lg:grid-cols-2 min-h-[calc(100vh-88px)]">
                {/* LEFT SIDE: Hero Content */}
                <div className="bg-slate-50 p-12 flex flex-col justify-center relative overflow-hidden">
                    <div className="z-10 max-w-xl">
                        <div className="flex items-center gap-2 text-orange-600 font-bold text-sm uppercase tracking-widest mb-4">
                            <Sparkles size={18} fill="currentColor" />
                            <span>AI Career Mentor</span>
                        </div>
                        <h1 className="text-7xl md:text-8xl font-black leading-[0.9] mb-8 tracking-tighter uppercase italic text-slate-900">
                            Map Your <br /> 
                            <span className="text-orange-600">Potential*</span>
                        </h1>
                        <p className="text-lg text-slate-500 font-medium leading-relaxed italic border-l-4 border-slate-900 pl-6 mb-8">
                            "Answer a few questions and let our neural engine build a custom roadmap for your future."
                        </p>
                    </div>
                </div>

                {/* RIGHT SIDE: Chat Panel */}
                <div className="flex items-center justify-center p-8 bg-white border-l border-slate-100">
                    <div className="w-full max-w-lg">
                        <div className="relative border-4 border-slate-900 rounded-[40px] shadow-[16px_16px_0px_0px_rgba(15,23,42,1)] bg-white overflow-hidden min-h-[600px] flex flex-col">
                            <div className="bg-slate-900 p-6 flex items-center justify-between text-white">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center animate-pulse">
                                        <MessageSquare size={20} fill="white" />
                                    </div>
                                    <div>
                                        <h3 className="font-black uppercase italic tracking-tighter text-lg leading-none">NxtStep AI</h3>
                                        <span className="text-[10px] uppercase font-bold text-orange-400 tracking-widest">Active Intelligence</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-grow overflow-y-auto p-4 custom-chatbot-scrollbar">
                                <ChatbotPanel onChatComplete={handleChatCompletion} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* OVERLAYS & MODALS */}
            {isProcessing && (
                <div className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-slate-900/95 backdrop-blur-md text-white">
                    <Zap size={64} className="text-orange-500 mb-6 animate-bounce" />
                    <h2 className="text-4xl font-black italic tracking-tighter uppercase">Analyzing Profile</h2>
                </div>
            )}

            {isModalOpen && (
                <RecommendationsModal 
                    onClose={() => setIsModalOpen(false)}
                    recommendations={recommendedCareers}
                    selectedCareer={selectedCareer}
                    setSelectedCareer={setSelectedCareer}
                />
            )}
        </div>
    );
}