import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: NextRequest) {
  // 1. LOOK FOR THIS NEW LOG IN YOUR TERMINAL
  console.log("--- 🔒 STRICT GUARDRAILS ACTIVE ---"); 

  try {
    const body = await req.json();
    const { userMessage, quizResults } = body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("API Key is missing");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // ✅ USING THE STABLE MODEL (2.5 does not exist publicly yet!)
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      SYSTEM INSTRUCTION:
      You are "NxtStep AI", a specialized Career Counselor.
      
      ⛔️ YOUR RULES:
      1. IF the user asks about Careers, Skills, Jobs, or Resumes -> Answer Helpfully.
      2. IF the user asks about General Knowledge (e.g., "States in India", "Capitals", "Movies") -> REFUSE.
         - Say: "I can only help with career-related questions. Do you have a question about your job path?"

      CONTEXT:
      ${quizResults ? JSON.stringify(quizResults) : "No profile."}

      USER QUESTION:
      "${userMessage}"
    `;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log("--- AI Responded ---");

    return NextResponse.json({ reply: text });

  } catch (error: any) {
    console.error("Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}