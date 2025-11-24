// guidance.tsx (or page.tsx)
'use client';
import React, { useState } from 'react';

// Imports (assuming all paths are correct)
import ChatbotPanel from './ChatbotPanel'; 
import RecommendationsModal from './RecommendationsModal'; 
import { MOCK_CAREERS, Career } from './mockData'; 

// NOTE: The 'interface Career' is now correctly assumed to be imported from './mockData'

// Helper function to check for array intersection
const arrayIntersects = (arr1: string[], arr2: string[]): boolean => {
    return arr1.some(item => arr2.includes(item));
};

export default function GuidancePage() {
    
    const [recommendedCareers, setRecommendedCareers] = useState<Career[]>([]);
    const [selectedCareer, setSelectedCareer] = useState<Career | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false); 

    // 🌟 CORE LOGIC FIX: Filter MOCK_CAREERS based on user answers
    const handleChatCompletion = (userAnswers: any) => { 
        
        const userInterests: string[] = userAnswers.interests || [];
        const userSkills: string[] = userAnswers.skills || [];
        const userWorkStyle: string = userAnswers.workStyle || '';
        
        const filteredCareers = MOCK_CAREERS.filter((career) => {
            
            // --- FILTER 1: Match Interests (Required Match) ---
            // Career's interests must overlap with user's selected interests
            const interestMatch = arrayIntersects(
                userInterests, 
                career.relatedInterests || [] // Assuming career has this field now
            );
            
            // --- FILTER 2: Match Skills (Required Match) ---
            // Career's required skills must overlap with user's possessed skills
            const skillMatch = arrayIntersects(
                userSkills, 
                career.skills || [] // Assuming career has this field now
            );

            // --- FILTER 3: Match Work Style (Soft Match) ---
            // This is a more complex soft filter, simplified here:
            // Check if the career's description aligns with the preferred work style
            const styleMatch = userWorkStyle === '' || 
                               (userWorkStyle === 'Hands-on/Practical' && career.description.toLowerCase().includes('build')) ||
                               (userWorkStyle === 'Analytical/Abstract' && career.description.toLowerCase().includes('analyze'));

            // Final recommendation logic: Must match at least one Interest AND one Skill (AND soft match style)
            return interestMatch && skillMatch && styleMatch;
        });

        // Fallback: If no careers match the strict filter, show a diverse set of 10 careers.
        const finalRecommendations = filteredCareers.length > 0 
            ? filteredCareers.slice(0, 10) 
            : MOCK_CAREERS.slice(0, 5); 
            
        setRecommendedCareers(finalRecommendations); 
        setIsModalOpen(true); 
        setSelectedCareer(null); 
    };
    
    const closeModal = () => {
        setIsModalOpen(false); 
    };

    return (
        // Apply engaging background gradient and ensure fixed height/no scroll
        <div className="flex flex-col h-screen overflow-hidden text-white 
                        bg-gradient-to-br from-gray-900 via-purple-900 to-gray-800"> 
            
            {/* Header remains the same */}
            <header className="p-4 bg-purple-900 flex justify-between items-center shadow-lg flex-shrink-0">
                <h1 className="text-xl font-bold text-white">NxtStep</h1>
                <nav className="space-x-4">
                    <a href="#" className="hover:text-orange-400 font-medium">Dashboard</a>
                    <a href="#" className="hover:text-orange-400 font-medium">Assessments</a>
                    <a href="#" className="hover:text-orange-400 font-medium">Roadmap</a>
                </nav>
            </header>

            {/* Main Content Area: Use flex and justify/align to perfectly center the Chatbot */}
            <main className="flex flex-1 p-6 justify-center items-center"> 
                
                {/* 3. Chatbot Container: The component naturally fills this centered box */}
                <div className="w-1/3 min-w-[350px]">
                    <ChatbotPanel onChatComplete={handleChatCompletion} />
                </div>
                
            </main>

            {/* Conditional Rendering of the Modal (Popup) */}
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