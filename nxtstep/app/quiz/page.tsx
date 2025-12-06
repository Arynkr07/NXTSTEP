'use client';


import { getAuth } from "firebase/auth";
import { app } from "@/lib/firebase";
import React, { useState } from 'react';

// Imports (Make sure these files exist in the same folder)
import ChatbotPanel from './ChatbotPanel'; 
import RecommendationsModal from './RecommendationsModal'; 
import { MOCK_CAREERS, Career } from './mockData'; 
import { Link } from 'lucide-react';

// Helper function to check for array intersection
const arrayIntersects = (arr1: string[], arr2: string[]): boolean => {
    return arr1.some(item => arr2.includes(item));
};

export default function GuidancePage() {
    
    const [recommendedCareers, setRecommendedCareers] = useState<Career[]>([]);
    const [selectedCareer, setSelectedCareer] = useState<Career | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false); 
    const [searchQuery, setSearchQuery] = useState<string>('');

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

        <div className="text-white bg-gradient-to-br from-gray-900 via-purple-900 to-gray-800 font-inter min-h-screen relative"style={{ backgroundImage: "url('https://pbs.twimg.com/media/EDyxVvhWsAMIbLx?format=png&name=small')", backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '100vh', boxShadow: 'inset 0 0 0 1000px rgba(33, 4, 64, 0.7)' }}>
      {/* Navbar */}
      
      
      <nav className="bg-[#210440] relative z-10 flex justify-between items-center p-4 md:p-8 max-w-7xl mx-auto">
                    <div className="flex items-center space-x-2">
                        <img src="https://placehold.co/40x40/F1AA9B/white?text=N" alt="Foody Logo" className="rounded-full"/>
                        <span className="text-2xl font-bold text-[#fdfdfd]">NXTSTEP</span>
                    </div>
                    <div className="hidden md:flex items-center space-x-6">
                        <a href="/home" className="font-medium text-[#fcfcfb] hover:text-[#650b4b] transition-colors">Home</a>
                        <a href="/about" className="font-medium text-[#fffefe] hover:text-[#650b4b] transition-colors">About</a>
                        <a href="/form" className="font-medium text-[#fdfcfb] hover:text-[#650b4b] transition-colors">Form</a>
                        <a href="/options" className="font-medium text-[#fdfbfb] hover:text-[#650b4b] transition-colors">Options</a>
                        <a href="/quiz" className="font-medium text-[#fefdfd] hover:text-[#650b4b] transition-colors">Quiz</a>
                        <a href="/dashboard" className="font-medium text-[#fefbfb] hover:text-[#650b4b] transition-colors">Dashboard</a>
                    </div>
                    <div className="flex items-center space-x-4">
                        {/* <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white cursor-pointer hover:text-gray-300 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg> */}
                        {/* <input
                        type="text"
                        id="searchBar"
                        placeholder="Search career options..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full sm:w-auto p-2 text-base rounded-l-md focus:outline-none focus:ring-2 focus:[#310E10] text-[#F5EFEB]"
                        /> */}
                        <Link href="/signup">

                        <button className="px-4 py-2 border border-white text-white text-sm font-semibold rounded-full hover:bg-[#650b4b] transition-colors hidden sm:block">Sign in</button>
                        </Link>
                    
                    </div>
                </nav>
            
            {/* Main Content Area */}
            <main className="flex flex-1 p-6 justify-center items-center">
                {/* Chatbot Container */}
                <div className="w-1/3 min-w-[350px]">
                    <ChatbotPanel onChatComplete={handleChatCompletion} />
                </div>
            </main>
            

            {/* Recommendations Modal */}
            <div>
                {isModalOpen && (
                <RecommendationsModal 
                    onClose={closeModal}
                    recommendations={recommendedCareers}
                    selectedCareer={selectedCareer}
                    setSelectedCareer={setSelectedCareer}
                />
            )}
            </div>
            
        </div>
       
    );
}