// app/api/quiz/results/route.ts
// Optimized AI-Driven Career Assessment Matching
// Zero wasted embedding calls; single lean Gemini attempt with instant multi-factor offline fallback

import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { QuizState, AssessmentResponse } from "@/app/quiz/types";
import { generateOfflineAssessment } from "@/lib/offlineRecommender";

export const dynamic = "force-dynamic";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-3.6-flash";

export async function POST(req: NextRequest) {
  let answers: QuizState | null = null;
  try {
    answers = (await req.json()) as QuizState;

    // If no API key or if offline engine requested
    if (!GEMINI_API_KEY) {
      return NextResponse.json(generateOfflineAssessment(answers));
    }

    const skillsFormatted =
      (answers.skills || []).map((s) => `${s.name} (${s.proficiency})`).join(", ") ||
      "General analytical and digital skills";

    const workStyleFormatted = `${answers.workEnvironment?.location || "Flexible"}, ${
      answers.workEnvironment?.teamSize || "Any"
    }, ${answers.workEnvironment?.pace || "Fast-paced"}`;

    const activitiesFormatted = (answers.activities || []).join(", ");

    const prompt = `You are a Principal Career Architect at NxtStep. Diagnose and match the user to top 3 career paths for 2024-2026.

USER PROFILE:
- Passions: ${activitiesFormatted || "Problem solving"}
- Work Style: ${workStyleFormatted}
- Skills: ${skillsFormatted}
- Experience: ${answers.experience}
- Projects: "${answers.projects || "None specified"}"
- Education: ${answers.education}${answers.fieldOfStudy ? ` in ${answers.fieldOfStudy}` : ""}
- Target Salary: ${answers.salaryRange} (${answers.currency})
- Timeline: ${answers.timeline}
- Primary Concern: ${answers.concern}

OUTPUT FORMAT: Return ONLY valid raw JSON without codeblocks or markdown:
{
  "needsRefinement": false,
  "careers": [
    {
      "title": "Exact standard job title",
      "fitScore": 94,
      "whyItFits": "2-3 precise sentences grounded in their skills and interests.",
      "salaryMatch": true,
      "timelineRealistic": true,
      "skillGaps": ["Skill 1", "Skill 2"],
      "firstSteps": ["Action step 1", "Action step 2", "Action step 3"],
      "topCompaniesHiring": ["Company 1", "Company 2", "Company 3", "Company 4"]
    }
  ],
  "overallInsight": "High-level strategic summary of their professional archetype.",
  "biggestStrength": "Their single most distinct competitive advantage.",
  "watchOut": "One specific market plateau or trap to avoid."
}`;

    try {
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });

      // Race with a fast 3.5s timeout: if Gemini takes longer, instantly deliver
      // offline recommendations tallied directly from the 1,300+ career database
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Timeout")), 3500)
      );

      const geminiResult = await Promise.race([
        model.generateContent(prompt),
        timeoutPromise,
      ]) as Awaited<ReturnType<typeof model.generateContent>>;

      const rawText = geminiResult.response.text().trim();
      if (rawText) {
        const jsonMatch =
          rawText.match(/```(?:json)?\s*([\s\S]*?)```/) || rawText.match(/(\{[\s\S]*\})/);
        const cleanJson = jsonMatch ? jsonMatch[1].trim() : rawText;
        const parsedData = JSON.parse(cleanJson) as AssessmentResponse;
        if (parsedData.careers && parsedData.careers.length > 0) {
          return NextResponse.json(parsedData);
        }
      }
    } catch (aiErr: any) {
      console.warn("[quiz/results] Gemini API error or quota limit. Using instant offline recommender:", aiErr?.message);
    }

    // High quality offline fallback
    try {
      return NextResponse.json(generateOfflineAssessment(answers));
    } catch (offlineErr) {
      console.error("[quiz/results] Offline recommender error:", offlineErr);
    }
  } catch (error) {
    console.error("[quiz/results] Top-level error:", error);
  }

  // Guaranteed safe fallback if everything else failed
  const safeFallback: AssessmentResponse = {
    needsRefinement: false,
    careers: [
      {
        title: "Software Engineer / Architect",
        fitScore: 94,
        whyItFits: "Your technical aptitude and problem solving mindset match engineering workflows.",
        salaryMatch: true,
        timelineRealistic: true,
        skillGaps: ["System Architecture", "Cloud Infrastructure"],
        firstSteps: ["Build a full-stack project", "Contribute to open source", "Practice system design"],
        topCompaniesHiring: ["Google", "Microsoft", "Stripe", "Amazon"]
      },
      {
        title: "Product Manager",
        fitScore: 89,
        whyItFits: "Strategic execution skills and ability to connect vision with execution.",
        salaryMatch: true,
        timelineRealistic: true,
        skillGaps: ["Product Analytics", "Roadmap Strategy"],
        firstSteps: ["Design a feature spec", "Conduct user research", "Build portfolio cases"],
        topCompaniesHiring: ["Uber", "Notion", "Atlassian", "Airbnb"]
      },
      {
        title: "Data Scientist / Analyst",
        fitScore: 85,
        whyItFits: "Analytical problem-solving and structured data-driven decision making.",
        salaryMatch: true,
        timelineRealistic: true,
        skillGaps: ["Machine Learning Models", "Statistical Modeling"],
        firstSteps: ["Complete data analysis project", "Master SQL and Python", "Deploy predictive dashboard"],
        topCompaniesHiring: ["Spotify", "Snowflake", "Databricks", "Palantir"]
      }
    ],
    overallInsight: "Strong execution archetype with analytical and problem-solving velocity.",
    biggestStrength: "Quick adaptability and outcome-driven mindset.",
    watchOut: "Avoid spending too much time on theory—focus on shipping real-world outcomes."
  };

  return NextResponse.json(safeFallback);
}
