import React from 'react';

// Define the required structure for the career data and interaction props
// NOTE: You should move this interface to a central types/index.ts file later!
interface Career {
    id: number;
    title: string;
    description: string;
    pursuitSteps: string[];
    colleges: string;
    fees: string;
    // We'll add an iconKey to make the icon dynamic
    iconKey: 'brain' | 'laptop' | 'leaf' | 'default'; 
}

interface CareerCardProps {
    career: Career; // The full career data object
    isSelected: boolean; // State to show if this card is currently selected
    onSelect: () => void; // Function to call when the card is clicked
}

// Map the icon key to an SVG path (Using simple paths for demonstration)
const iconMap: { [key in Career['iconKey']]: string } = {
    brain: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-4H8v-2h3V8l4 4-4 4z",
    laptop: "M20 18H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2h16c1.1 0 2 .9 2 2v10c0 1.1-.9 2-2 2zm0-12H4v10h16V6z",
    leaf: "M17 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm-7.92 7.08c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z",
    default: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z",
};

export default function CareerCard({ career, isSelected, onSelect }: CareerCardProps) {
    
    const { title, description, pursuitSteps, iconKey } = career;

    const gradientClass = "bg-gradient-to-br from-purple-600 to-orange-500";
    
    // Conditional styling to highlight the selected card
    const selectedClass = isSelected 
        ? 'ring-4 ring-offset-2 ring-orange-500 scale-[1.05] shadow-2xl' // Highlight when selected
        : 'hover:scale-[1.02] shadow-xl'; // Subtle scale on hover when not selected
        
    const iconPath = iconMap[iconKey] || iconMap['default'];

    return (
        <div 
            className={`rounded-xl overflow-hidden bg-white cursor-pointer transition-all duration-300 ${selectedClass}`}
            onClick={onSelect} // Trigger selection on click
        >
            
            {/* Top Section: The Gradient Header with Icon */}
            <div className={`p-6 text-white ${gradientClass} flex flex-col items-center justify-center text-center h-48`}>
                <div className="p-4 bg-white bg-opacity-20 rounded-full mb-3">
                    {/* Dynamic Icon */}
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                        <path d={iconPath} />
                    </svg>
                </div>
                <div>
                    <h3 className="text-xl font-semibold mb-1">{title}</h3>
                    <p className="text-sm opacity-90">{description}</p>
                </div>
            </div>
            
            {/* Bottom Section: Pursuit Steps Preview (Less detailed, to be expanded in the detail panel) */}
            <div className="p-4 text-gray-700 h-28 flex flex-col justify-center">
                <h4 className="font-semibold text-purple-700 mb-2">How to Pursue (Preview)</h4>
                <ul className="list-disc list-inside text-xs mt-1 space-y-1">
                    {/* Show only the first 2 steps for a cleaner preview */}
                    {pursuitSteps.slice(0, 2).map((step, index) => (
                        <li key={index} className="text-gray-600 truncate">{step}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}