'use client';

import React, { useEffect, useState } from 'react';
import { auth, db } from "@/lib/firebase"; 
import { doc, updateDoc, arrayUnion, arrayRemove, onSnapshot } from "firebase/firestore";
import { Heart, CheckCircle, ArrowRight, X } from 'lucide-react';
import CareerCard from './CareerCard';
import HowToPursueDetail from './HowToPursueDetail';
import { Career } from '../components/data';

interface RecommendationsModalProps {
    onClose: () => void;
    recommendations: Career[];
    selectedCareer: Career | null;
    setSelectedCareer: (career: Career | null) => void;
}

export default function RecommendationsModal({ 
    onClose, 
    recommendations,
    selectedCareer,
    setSelectedCareer,
}: RecommendationsModalProps) {
    
    const [savedIds, setSavedIds] = useState<number[]>([]);
    const user = auth.currentUser;

    // 1. Listen for saved careers in Real-time
    useEffect(() => {
        if (!user) return;
        const userRef = doc(db, "users", user.uid);
        const unsubscribe = onSnapshot(userRef, (docSnap) => {
            if (docSnap.exists()) {
                setSavedIds(docSnap.data().likedCareers || []);
            }
        });
        return () => unsubscribe();
    }, [user]);

    // 2. Firebase Toggle Function
    const handleToggleFavorite = async (id: number) => {
        if (!user) return;
        const userRef = doc(db, "users", user.uid);
        const isSaved = savedIds.includes(id);

        try {
            await updateDoc(userRef, {
                likedCareers: isSaved ? arrayRemove(id) : arrayUnion(id)
            });
        } catch (err) {
            console.error("Error saving career from modal:", err);
        }
    };

    // ESC key listener
    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [onClose]);

    const isCurrentCareerSaved = selectedCareer ? savedIds.includes(selectedCareer.id) : false;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/90 backdrop-blur-md p-4 animate-in fade-in duration-300">
            <div className="bg-white border-4 border-slate-900 rounded-[40px] shadow-[20px_20px_0px_0px_rgba(234,88,12,1)] w-full h-[90vh] max-w-7xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
                
                {/* Header */}
                <div className="p-6 border-b-4 border-slate-900 flex justify-between items-center bg-orange-600 text-white">
                    <div className="flex items-center gap-4">
                        <div className="bg-slate-900 p-2 rounded-xl border-2 border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
                            <CheckCircle size={24} />
                        </div>
                        <h2 className="text-3xl font-black uppercase italic tracking-tighter">AI Career Blueprint*</h2>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="bg-slate-900 text-white p-3 rounded-2xl border-2 border-slate-900 hover:bg-white hover:text-slate-900 transition shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] active:translate-y-1 active:shadow-none"
                    >
                        <X size={24} strokeWidth={3} />
                    </button>
                </div>

                <div className="flex flex-1 overflow-hidden">
                    {/* LEFT SECTION: Recommendations */}
                    <div className="w-1/3 p-6 border-r-4 border-slate-900 overflow-y-auto space-y-4 bg-slate-50 custom-scrollbar">
                        <p className="text-slate-500 font-black text-[10px] uppercase tracking-[0.2em] mb-4">Top Matches Based on Your Vibe</p>
                        
                        {recommendations.map((career) => (
                            <div key={career.id} className="relative group">
                                <CareerCard 
                                    career={career} 
                                    // FIXED: Changed 'Career' to 'career'
                                    onSelect={() => setSelectedCareer(career)} 
                                    isSelected={selectedCareer?.id === career.id}
                                />
                                {savedIds.includes(career.id) && (
                                    <div className="absolute top-4 right-4 bg-green-500 text-white p-1 rounded-full border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] z-10">
                                        <CheckCircle size={14} strokeWidth={3} />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* RIGHT SECTION: Detailed Roadmap */}
                    <div className="w-2/3 p-10 overflow-y-auto bg-white flex flex-col custom-scrollbar">
                        {selectedCareer ? (
                            <div className="flex-1 animate-in slide-in-from-right-4 duration-500">
                                <div className="flex justify-between items-start mb-8">
                                    <div className="max-w-[60%]">
                                        <h3 className="text-5xl font-black uppercase italic tracking-tighter text-slate-900 leading-[0.9] mb-4">{selectedCareer.title}</h3>
                                        <div className="inline-block bg-orange-100 text-orange-600 px-4 py-1 rounded-full font-black text-xs uppercase tracking-widest border-2 border-orange-200">
                                            98% Vibe Match
                                        </div>
                                    </div>
                                    
                                    <button 
                                        onClick={() => handleToggleFavorite(selectedCareer.id)}
                                        className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black uppercase italic tracking-widest text-sm transition-all border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] active:translate-y-1 active:shadow-none ${
                                            isCurrentCareerSaved 
                                            ? 'bg-orange-600 text-white' 
                                            : 'bg-white text-slate-900 hover:bg-orange-50'
                                        }`}
                                    >
                                        <Heart size={20} fill={isCurrentCareerSaved ? "white" : "none"} strokeWidth={3} />
                                        {isCurrentCareerSaved ? "Path Locked" : "Save this Path"}
                                    </button>
                                </div>
                                
                                <HowToPursueDetail career={selectedCareer} />
                            </div>
                        ) : (
                            <div className="h-full flex flex-col justify-center items-center text-center p-12">
                                <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mb-6 animate-bounce border-4 border-orange-600">
                                    <ArrowRight size={48} className="text-orange-600 -rotate-90" />
                                </div>
                                <h3 className="text-4xl font-black uppercase italic tracking-tighter">Choose Your Path</h3>
                                <p className="text-slate-400 mt-4 max-w-sm font-bold italic text-lg leading-relaxed">Select a career on the left to unlock your customized 4-year roadmap, fee estimates, and recommended colleges.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}