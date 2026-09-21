"use client";

import { Heart } from 'lucide-react';
import React, { useState } from 'react';
import { auth, db } from "@/lib/firebase"; 
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";

interface Career {
    id: number;
    title: string;
    description: string;
    pursuitSteps: string[];
    colleges: string;
    fees: string;
    iconKey: 'brain' | 'laptop' | 'leaf' | 'default'; 
}

interface CareerCardProps {
    career: Career;
    isSelected: boolean;
    onSelect: () => void;
}

export default function CareerCard({ career, isSelected, onSelect }: CareerCardProps) {  
    const { title, description, pursuitSteps } = career;
    const [isLiked, setIsLiked] = useState(false);

    // --- FIREBASE LOGIC ---
    const handleLikeFromQuiz = async (e: React.MouseEvent, id: number) => {
        // 1. Prevent the card's 'onSelect' from firing when clicking the heart
        e.stopPropagation();

        const user = auth.currentUser;
        if (!user) {
            alert("Please log in to save careers!");
            return;
        }

        const userRef = doc(db, "users", user.uid);

        try {
            // 2. Toggle the state locally for instant feedback
            setIsLiked(!isLiked);

            // 3. Update Firestore (Syncs with Dashboard instantly)
            await updateDoc(userRef, {
                likedCareers: isLiked ? arrayRemove(id) : arrayUnion(id)
            });
        } catch (error) {
            console.error("Error updating favourites:", error);
            setIsLiked(isLiked); // Revert if error
        }
    };

    return (
        <div 
            className={`relative rounded-[32px] overflow-hidden border-4 border-slate-900 bg-white cursor-pointer transition-all duration-300 
                ${isSelected 
                    ? 'translate-x-1 -translate-y-1 shadow-[12px_12px_0px_0px_rgba(234,88,12,1)] bg-orange-50' 
                    : 'hover:-translate-y-1 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]'}`}
            onClick={onSelect}
        >
            {/* Heart Button: Absolute positioned to the top-right */}
            <button 
                onClick={(e) => handleLikeFromQuiz(e, career.id)}
                className={`absolute top-4 right-4 z-20 p-2 border-2 border-slate-900 rounded-full transition shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] active:translate-y-0.5
                    ${isLiked ? 'bg-orange-600 text-white' : 'bg-white text-slate-900 hover:bg-orange-100'}`}
            >
                <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
            </button>
            
            <div className={`p-6 border-b-4 border-slate-900 ${isSelected ? 'bg-orange-600' : 'bg-slate-900'} text-white`}>
                <h3 className="text-2xl font-black uppercase italic tracking-tighter leading-none mb-1">{title}</h3>
                <p className="text-xs font-bold uppercase tracking-widest opacity-80">{description}</p>
            </div>
            
            <div className="p-5">
                <span className="text-[10px] font-black uppercase tracking-widest text-orange-600 mb-2 block">AI Analysis Preview:</span>
                <ul className="space-y-2">
                    {pursuitSteps.slice(0, 2).map((step, index) => (
                        <li key={index} className="flex items-start gap-2 text-xs font-bold text-slate-600 italic">
                            <span className="text-orange-600">•</span> {step}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}