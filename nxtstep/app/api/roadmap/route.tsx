// app/api/roadmap/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: NextRequest) {
  // 1. Log to server console so we can see if it's running
  console.log("🚀 Roadmap API Triggered");

  try {
    const body = await req.json();
    const { career, interests } = body; 

    console.log("📥 Received:", { career, interests });

    // Safety Check: API Key
    if (!process.env.GEMINI_API_KEY) {
      console.error("❌ Error: GEMINI_API_KEY is missing in .env.local");
      return NextResponse.json({ error: "API Key missing" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // ⚡️ UPGRADE: Force JSON mode
    const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash",
        generationConfig: { responseMimeType: "application/json" } // <--- This fixes the parsing error
    });

    const prompt = `
      You are an expert Career Counselor.
      
      Task: Create a detailed, step-by-step roadmap for a student to become a "${career}".
      Context: User interests: ${interests && interests.length > 0 ? interests.join(', ') : "General Technology"}.
      
      Output Schema (JSON):
      {
        "steps": [
          {
            "title": "String",
            "description": "String",
            "duration": "String"
          }
        ],
        "motivation": "String"
      }
      
      Requirements:
      - Provide exactly 5 distinct steps.
      - Ensure 'motivation' is warm and empowering.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log("🤖 AI Response:", text.substring(0, 50) + "..."); // Log first 50 chars

    // No need for regex cleanup anymore because we forced JSON mode!
    return NextResponse.json(JSON.parse(text));

  } catch (error: any) {
    console.error("❌ AI Roadmap Error:", error);
    return NextResponse.json({ error: error.message || "Failed to generate roadmap" }, { status: 500 });
  }
}