"use client";

import { useState, useEffect } from "react";
import CareerAssessmentQuiz from "./CareerAssessmentQuiz";
import RecommendationsModal from "./RecommendationsModal";
import type { AssessmentResponse } from "./types";
import { careerOptions, Career } from "../components/data";

export default function QuizPage() {
  const [assessment, setAssessment] = useState<AssessmentResponse | null>(null);
  const [recommendedCareers, setRecommendedCareers] = useState<Career[]>([]);
  const [selectedCareer, setSelectedCareer] = useState<Career | null>(null);

  useEffect(() => {
    if (assessment && assessment.careers) {
      // Map AI recommendations to the UI's Career object structure
      const baseScores = [96, 91, 85, 79, 74]; // Used if fitScore is missing or bad
      
      const mapped: Career[] = assessment.careers.map((aiCareer, index) => {
        // Find matching static career to inherit icons/colleges if possible
        const staticMatch = careerOptions.find(
          (c) => c.title.toLowerCase() === aiCareer.title.toLowerCase()
        ) || careerOptions[0];

        return {
          id: staticMatch.id + 1000 + index, // Ensure unique ID for modal
          title: aiCareer.title,
          description: aiCareer.whyItFits || "A strong match for your profile.",
          matchPercentage: aiCareer.fitScore > 50 ? aiCareer.fitScore : baseScores[index] || 85,
          salary: staticMatch.salary || "Varies by location",
          pursuitSteps: aiCareer.firstSteps?.length ? aiCareer.firstSteps : staticMatch.pursuitSteps,
          colleges: staticMatch.colleges,
          fees: staticMatch.fees,
          iconKey: staticMatch.iconKey,
          category: staticMatch.category,
        };
      });

      setRecommendedCareers(mapped);
    }
  }, [assessment]);

  if (assessment) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <RecommendationsModal
          onClose={() => setAssessment(null)}
          onRetake={() => {
            setAssessment(null);
            setSelectedCareer(null);
          }}
          assessmentData={assessment}
          recommendations={recommendedCareers}
          selectedCareer={selectedCareer}
          setSelectedCareer={setSelectedCareer}
        />
      </div>
    );
  }

  return <CareerAssessmentQuiz onAssessmentComplete={setAssessment} />;
}