'use client';

import React, { useState } from 'react';

// Imports (Make sure these files exist in the same folder)
import ChatbotPanel from './ChatbotPanel'; 
import RecommendationsModal from './RecommendationsModal'; 
import { MOCK_CAREERS, Career } from './mockData'; 

// Helper function to check for array intersection
const arrayIntersects = (arr1: string[], arr2: string[]): boolean => {
    return arr1.some(item => arr2.includes(item));
};

export default function GuidancePage() {
    
    const [recommendedCareers, setRecommendedCareers] = useState<Career[]>([]);
    const [selectedCareer, setSelectedCareer] = useState<Career | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false); 

    // 🌟 CORE LOGIC: Filter MOCK_CAREERS based on user answers
    const handleChatCompletion = (userAnswers: any) => { 
        
        const userInterests: string[] = userAnswers.interests || [];
        const userSkills: string[] = userAnswers.skills || [];
        const userWorkStyle: string = userAnswers.workStyle || '';
        
        const filteredCareers = MOCK_CAREERS.filter((career) => {
            
            // --- FILTER 1: Match Interests (Required Match) ---
            const interestMatch = arrayIntersects(
                userInterests, 
                career.relatedInterests || [] 
            );
            
            // --- FILTER 2: Match Skills (Required Match) ---
            const skillMatch = arrayIntersects(
                userSkills, 
                career.skills || [] 
            );

            // --- FILTER 3: Match Work Style (Soft Match) ---
            const styleMatch = userWorkStyle === '' || 
                               (userWorkStyle === 'Hands-on/Practical' && career.description.toLowerCase().includes('build')) ||
                               (userWorkStyle === 'Analytical/Abstract' && career.description.toLowerCase().includes('analyze'));

            return interestMatch && skillMatch && styleMatch;
        });

        // Fallback: If no careers match the strict filter, show a diverse set
        const finalRecommendations = filteredCareers.length > 0 
            ? filteredCareers.slice(0, 10) 
            : MOCK_CAREERS.slice(0, 5); 
            
        setRecommendedCareers(finalRecommendations); 
        setIsModalOpen(true); 
        setSelectedCareer(null); 

        // ⬇️⬇️ AI MEMORY LOGIC ⬇️⬇️
        // This saves the result so the Chatbot knows what to talk about!
        if (typeof window !== "undefined") {
            const profileData = {
                topRecommended: finalRecommendations.slice(0, 3).map(c => c.title),
                userInterests: userInterests,
                userSkills: userSkills,
                date: new Date().toDateString()
            };
            localStorage.setItem("userCareerProfile", JSON.stringify(profileData));
            console.log("✅ Career Profile saved for AI:", profileData);
        }
    };
    
    const closeModal = () => {
        setIsModalOpen(false); 
    };

    return (
        // Apply engaging background gradient
        <div className="flex flex-col h-screen overflow-hidden text-white bg-gradient-to-br from-gray-900 via-purple-900 to-gray-800"> 
            
            {/* Header */}
            <header className="p-4 bg-purple-900 flex justify-between items-center shadow-lg flex-shrink-0">
                <h1 className="text-xl font-bold text-white">NxtStep</h1>
                <nav className="space-x-4">
                    <a href="#" className="hover:text-orange-400 font-medium">Dashboard</a>
                    <a href="#" className="hover:text-orange-400 font-medium">Assessments</a>
                    <a href="#" className="hover:text-orange-400 font-medium">Roadmap</a>
                </nav>
            </header>

            {/* Main Content Area */}
            <main className="flex flex-1 p-6 justify-center items-center"> 
                {/* Chatbot Container */}
                <div className="w-1/3 min-w-[350px]">
                    <ChatbotPanel onChatComplete={handleChatCompletion} />
                </div>
            </main>

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