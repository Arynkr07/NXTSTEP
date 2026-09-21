'use client';

import React, { useState, useRef, useEffect } from 'react';

// --- Type Definitions (Kept here for completeness) ---
interface Message {
    id: number;
    type: 'bot' | 'user';
    text: string;
    userResponseText?: string | string[]; 
}
interface UserAnswers {
    interests: string[];
    workStyle: 'Hands-on' | 'Analytical' | null;
    educationLevel: string | null;
    skills: string[];
    salaryExpectation: string; // The value will now be in Rupees (₹)
}
interface ChatbotPanelProps {
    onChatComplete: (answers: UserAnswers) => void; 
}
// --- End Type Definitions ---


// --- Chat Script and Options (UPDATED for better engagement) ---
const CHAT_SCRIPT = [
    // Step 0: Initial Greeting
    "Welcome to NxtStep! I'm your dedicated AI mentor. Let's start mapping your future. 🚀",
    // Step 1: Interests (Start)
    "Let's dive into your passions! Select your **top 3 areas of interest** that truly excite you:",
    // Step 2: Work Style
    "Brilliant! Now, tell me about your work DNA. Do you thrive in **Hands-on/Practical** environments, or are you drawn to **Analytical/Abstract** challenges? 🧐",
    // Step 3: Education Level
    "Your work style is clear! To recommend the right entry-level, what is your current or highest **educational milestone**?",
    // Step 4: Skills
    "Perfect. Education logged! What superpowers do you bring? Select any **skills** you currently possess (up to 3):",
    // Step 5: Salary Expectation (CURRENCY FIXED HERE)
    "Almost there! Finally, to ensure your goals align with the path, what is your **annual salary expectation** (e.g., ₹ 8,00,000+)?",
    // Step 6: Finalization Message
    "Profile complete! Your unique career blueprint is being calculated right now... Give me a moment! 💡",
];

const INTEREST_OPTIONS = ['Technology', 'Science', 'Creative Arts', 'Finance', 'Social Impact', 'Healthcare'];
const EDUCATION_OPTIONS = ['High School', 'Bachelor\'s Degree', 'Master\'s Degree', 'PhD/Doctorate', 'Vocational Training'];
const SKILL_OPTIONS = ['Coding (Python/JS)', 'Data Analysis', 'Writing/Copywriting', 'Leadership', 'Communication', 'Design (UI/UX)'];


export default function ChatbotPanel({ onChatComplete }: ChatbotPanelProps) {
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, type: 'bot', text: CHAT_SCRIPT[0] },
        { id: 2, type: 'bot', text: CHAT_SCRIPT[1] } // Start with the first question
    ]);
    const [step, setStep] = useState(1);
    const [currentAnswers, setCurrentAnswers] = useState<UserAnswers>({ 
        interests: [], workStyle: null, educationLevel: null, skills: [], salaryExpectation: '' 
    });
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // --- Personalized Bot Response Generator ---
    const getBotFeedback = (key: keyof UserAnswers, answer: string | string[]) => {
        let text = Array.isArray(answer) ? answer.join(', ') : answer;
        
        switch (key) {
            case 'interests':
                return `**${text}**... that's an insightful starting point! We're building your profile based on these passions.`;
            case 'workStyle':
                return `A clear preference for **${text}** environments. We'll prioritize roles where you naturally excel!`;
            case 'educationLevel':
                return `A strong foundation with **${text}**. Excellent! Let's utilize that knowledge.`;
            case 'skills':
                return `**${text}**—these are valuable assets! Almost done.`;
            case 'salaryExpectation':
                return `Noted! An expectation of **${text}**. I’ll ensure our recommendations meet your financial ambition.`;
            default:
                return 'Acknowledged! Moving to the next step.';
        }
    }

    // --- Core Logic to Advance Chat (No changes to logic, just references) ---
    const advanceChat = (answer: string | string[], key: keyof UserAnswers, nextStep: number) => {
        
        let newAnswers = { ...currentAnswers };
        newAnswers[key] = answer as any;

        const userResponseText = Array.isArray(answer) ? answer.join(', ') : answer;
        const userMsg: Message = { id: Date.now(), type: 'user', text: userResponseText, userResponseText: userResponseText };
        setMessages(prev => [...prev, userMsg]);
        
        // Bot feedback
        setTimeout(() => {
            const feedbackText = getBotFeedback(key, answer);
            const feedbackMsg: Message = { id: Date.now() + 0.5, type: 'bot', text: feedbackText };
            setMessages(prev => [...prev, feedbackMsg]);
        }, 500);

        // Next bot question/completion
        setTimeout(() => {
            if (nextStep < CHAT_SCRIPT.length) {
                const botMsg: Message = { id: Date.now() + 1, type: 'bot', text: CHAT_SCRIPT[nextStep] };
                setMessages(prev => [...prev, botMsg]);
                setStep(nextStep);
            } else {
                 // Final Completion Step
                onChatComplete(newAnswers); 
            }
        }, 1200);

        setCurrentAnswers(newAnswers);
    };
    
    // --- Handlers for Interactive Inputs (Logic kept the same) ---
    const handlePillSelect = (key: keyof UserAnswers, option: string, maxSelection: number = 1) => {
        let currentSelections = currentAnswers[key] as string[];
        
        if (currentSelections.includes(option)) {
            currentSelections = currentSelections.filter(i => i !== option);
        } else if (currentSelections.length < maxSelection) {
            currentSelections = [...currentSelections, option];
        }

        setCurrentAnswers(prev => ({ ...prev, [key]: currentSelections as any }));
    };
    
    const handleSingleConfirm = (key: keyof UserAnswers, answer: string) => {
        advanceChat(answer, key, step + 1);
    };

    const handleMultiConfirm = (key: keyof UserAnswers) => {
        const answer = currentAnswers[key];
        if (Array.isArray(answer) && answer.length >= 1) { 
            advanceChat(answer, key, step + 1);
        }
    }

    const handleSalarySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim()) {
            advanceChat(input.trim(), 'salaryExpectation', step + 1);
            setInput('');
        }
    }
    
    // --- Render Functions for Different Steps ---
    const renderInputArea = () => {
        switch (step) {
            case 1: // Interests
                return (
                    <div>
                        <div className="flex flex-wrap gap-2 mb-3">
                            {INTEREST_OPTIONS.map(option => (
                                <PillButton 
                                    key={option}
                                    label={option}
                                    isSelected={currentAnswers.interests.includes(option)}
                                    onClick={() => handlePillSelect('interests', option, 3)}
                                    disabled={!currentAnswers.interests.includes(option) && currentAnswers.interests.length >= 3}
                                />
                            ))}
                        </div>
                        <button 
                            onClick={() => handleMultiConfirm('interests')}
                            disabled={currentAnswers.interests.length === 0}
                            className="w-full p-2 bg-purple-600 text-white rounded-lg disabled:bg-gray-400 hover:bg-purple-700 font-medium transition-colors"
                        >
                            Confirm Interests ({currentAnswers.interests.length}/3)
                        </button>
                    </div>
                );

            case 2: // Work Style
                return (
                    <div className="space-y-3">
                        <button 
                            onClick={() => handleSingleConfirm('workStyle', 'Hands-on/Practical')}
                            className="w-full p-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-bold shadow-md"
                        >
                            Hands-on/Practical
                        </button>
                         <button 
                            onClick={() => handleSingleConfirm('workStyle', 'Analytical/Abstract')}
                            className="w-full p-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 font-bold shadow-md"
                        >
                            Analytical/Abstract
                        </button>
                    </div>
                );
            
            case 3: // Education Level
                 return (
                    <div className="flex flex-wrap gap-2 justify-center">
                        {EDUCATION_OPTIONS.map(option => (
                            <button 
                                key={option}
                                onClick={() => handleSingleConfirm('educationLevel', option)}
                                className={`p-2 rounded-full text-sm font-medium transition-colors border ${
                                    currentAnswers.educationLevel === option 
                                        ? 'bg-purple-600 text-white border-purple-800' 
                                        : 'bg-gray-100 text-gray-800 border-gray-300 hover:bg-purple-100'
                                }`}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                );

            case 4: // Skills
                return (
                    <div>
                        <div className="flex flex-wrap gap-2 mb-3">
                            {SKILL_OPTIONS.map(option => (
                                <PillButton 
                                    key={option}
                                    label={option}
                                    isSelected={currentAnswers.skills.includes(option)}
                                    onClick={() => handlePillSelect('skills', option, 3)}
                                    disabled={!currentAnswers.skills.includes(option) && currentAnswers.skills.length >= 3}
                                />
                            ))}
                        </div>
                        <button 
                            onClick={() => handleMultiConfirm('skills')}
                            disabled={currentAnswers.skills.length === 0}
                            className="w-full p-2 bg-purple-600 text-white rounded-lg disabled:bg-gray-400 hover:bg-purple-700 font-medium transition-colors"
                        >
                            Confirm Skills ({currentAnswers.skills.length}/3)
                        </button>
                    </div>
                );

            case 5: // Salary Expectation
                return (
                    <form onSubmit={handleSalarySubmit} className="flex space-x-3">
                        <input 
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            // Placeholder is now localized to Rupees (₹)
                            placeholder="e.g., ₹ 8,00,000+" 
                            className="flex-1 p-3 border border-gray-300 rounded-lg text-gray-800 focus:ring-purple-500 focus:border-purple-500"
                        />
                        <button
                            type="submit"
                            className="p-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition duration-150 disabled:bg-gray-400"
                            disabled={!input.trim()}
                        >
                            {/* Simple Send Icon */}
                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                        </button>
                    </form>
                );

            default: // Step 6 or higher (Completion)
                return (
                    <button
                        onClick={() => onChatComplete(currentAnswers)} 
                        className="w-full p-3 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 shadow-md transition-colors"
                    >
                        See My NxtStep Results
                    </button>
                );
        }
    };
    
    // --- Utility Components ---
    const BotIcon = () => (
        <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-4H8v-2h3V8l4 4-4 4z"/>
        </svg>
    );

    const PillButton = ({ label, isSelected, onClick, disabled }: { label: string, isSelected: boolean, onClick: () => void, disabled?: boolean }) => (
        <button 
            onClick={onClick}
            disabled={disabled}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors border ${
                isSelected 
                    ? 'bg-orange-500 text-white border-orange-700' // Highlighted Pill
                    : 'bg-gray-100 text-gray-800 border-gray-300 hover:bg-purple-100' // Default Pill
            } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
            {label}
        </button>
    );

    return (
        <div className="bg-white rounded-xl shadow-2xl h-full flex flex-col p-4 border border-purple-200">
            
            {/* Header / Title */}
            <div className="flex items-center space-x-3 mb-4 pb-2 border-b border-gray-100">
                <BotIcon />
                <h3 className="text-xl font-bold text-gray-800">NxtStep AI Guide</h3>
            </div>
            
            {/* 1. Chat History Area (Scrollable) */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                {messages.map((msg) => (
                    <div 
                        key={msg.id} 
                        className={`flex ${msg.type === 'bot' ? 'justify-start' : 'justify-end'}`}
                    >
                        <div 
                            // Using dangerouslySetInnerHTML for rendering **bold** text from the bot feedback
                            className={`max-w-[85%] px-4 py-2 rounded-xl shadow-md text-sm whitespace-pre-wrap ${
                                msg.type === 'bot' 
                                    ? 'bg-purple-100 text-gray-800 rounded-bl-none' 
                                    : 'bg-orange-500 text-white rounded-br-none'
                            }`}
                            dangerouslySetInnerHTML={{ __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}
                        >
                            
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} /> {/* Auto-scroll target */}
            </div>
            
            {/* 2. Input and Action Area (Fixed) */}
            <div className="mt-4 pt-4 border-t border-gray-100">
                {renderInputArea()}
            </div>
        </div>
    );
}