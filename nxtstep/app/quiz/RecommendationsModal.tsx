'use client';

import React, { useEffect } from 'react';
// Imports (assuming correct paths relative to this modal file)
import CareerCard from './CareerCard';
import HowToPursueDetail from './HowToPursueDetail';
// NOTE: Assuming Career interface is correctly exported from mockData
import { Career } from './mockData'; 

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
    
    // 1. Accessibility & UX Improvement: Close modal on ESC key press
    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [onClose]);


    return (
        // 1. Full-screen Modal Overlay (Fixed position, dark, blurred background)
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/90 backdrop-blur-sm p-4"
            // Optional: Click outside the modal content to close (needs event handling)
            // onClick={onClose} 
        >
            
            {/* 2. Modal Content Box (Internal Scrollable Workspace) */}
            {/* Added shadow, background color, and ensured the content doesn't click through the backdrop */}
            <div 
                className="bg-gray-800 rounded-xl shadow-2xl w-[95%] h-[95%] max-w-7xl flex flex-col overflow-hidden transform transition-all duration-300 scale-100"
                // onClick={(e) => e.stopPropagation()} // Prevents closing when clicking inside the content
            >
                
                {/* Modal Header */}
                <div className="p-5 border-b border-gray-700 flex justify-between items-center bg-purple-700 text-white flex-shrink-0">
                    <h2 className="text-2xl font-bold">Your NxtStep Career Blueprint 🗺️</h2>
                    <button 
                        onClick={onClose} 
                        className="text-orange-300 hover:text-orange-100 transition-colors p-1"
                        aria-label="Close recommendations"
                    >
                        {/* Close Icon (Simple X) */}
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>

                {/* 3. Modal Body: The Internal Two-Column Split (flex-1 ensures it fills remaining vertical space) */}
                <div className="flex flex-1 overflow-hidden">
                    
                    {/* LEFT SECTION (w-1/3): Career Cards List (Vertically scrollable) */}
                    {/* Reduced width to 1/3 to give more space for the detailed roadmap */}
                    <div className="w-1/3 p-6 pr-4 border-r border-gray-700 overflow-y-auto space-y-4 bg-gray-900/50">
                        
                        <p className="text-purple-300 font-medium text-sm mb-4">Select a path below to view the detailed roadmap immediately on the right.</p>
                        
                        {recommendations.map((career) => (
                            <CareerCard 
                                key={career.id} 
                                career={career} 
                                onSelect={() => setSelectedCareer(career)} 
                                isSelected={selectedCareer?.id === career.id}
                            />
                        ))}
                    </div>

                    {/* RIGHT SECTION (w-2/3): Detailed Roadmap Panel (Updates on click) */}
                    <div className="w-2/3 p-6 overflow-y-auto bg-gray-800 text-gray-100">
                        {selectedCareer ? (
                            // Display the detailed roadmap
                            <HowToPursueDetail career={selectedCareer} />
                        ) : (
                            // Default message when no card is selected
                            <div className="h-full flex flex-col justify-center items-center text-center p-8">
                                <h3 className="text-3xl font-bold text-orange-400">Unlock Your Roadmap</h3>
                                <p className="text-gray-400 mt-4 text-lg">Click any recommended career on the left to instantly see the step-by-step pursuit guide, suggested colleges, and fee details here.</p>
                                <p className="text-sm mt-8 text-gray-600">— NxtStep AI Mentor</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}