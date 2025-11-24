// HowToPursueDetail.tsx

import React from 'react';
// Assuming the Career interface is available via import or defined locally
interface Career { 
    id: number; title: string; description: string; pursuitSteps: string[]; 
    colleges: string; fees: string; iconKey: string; 
} 

export default function HowToPursueDetail({ career }: { career: Career }) {
    
    // Ensure the content fits well into the new dedicated panel
    return (
        <div className="h-full text-gray-100">
            <h3 className="font-bold text-3xl text-orange-400 mb-2">{career.title}</h3>
            <p className="text-purple-300 mb-6 italic">{career.description}</p>
            
            <div className="space-y-6">
                
                {/* How to Pursue Section */}
                <div>
                    <h4 className="font-semibold text-xl text-white border-b border-purple-500 pb-1 mb-3">
                        🎓 Step-by-Step Pursuit Guide
                    </h4>
                    <ol className="list-decimal list-inside text-sm space-y-2 pl-4">
                        {career.pursuitSteps.map((step, i) => (
                            <li key={i} className="text-gray-300">{step}</li>
                        ))}
                    </ol>
                </div>
                
                {/* Educational Details Section */}
                <div className="grid grid-cols-2 gap-4 bg-gray-700 p-4 rounded-lg">
                    <div>
                        <h4 className="font-semibold text-lg text-white mb-1">Suggested Institutions</h4>
                        <p className="text-sm text-purple-300">{career.colleges}</p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-lg text-white mb-1">Average Annual Fees</h4>
                        <p className="text-sm text-orange-400 font-bold">{career.fees}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}