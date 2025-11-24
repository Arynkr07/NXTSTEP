import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: NextRequest) {
  console.log("--- 1. API Route hit ---"); // Log start

  try {
    // Check if body is readable
    const body = await req.json();
    console.log("--- 2. Body parsed:", body); 

    const { userMessage, quizResults } = body;

    // Check API Key
    const apiKey = process.env.GEMINI_API_KEY;
    console.log("--- 3. API Key status:", apiKey ? "Found key starting with " + apiKey.substring(0,5) : "MISSING");

    if (!apiKey) {
      throw new Error("API Key is missing from .env.local");
    }

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Generate
    console.log("--- 4. Sending to Gemini... ---");
    const result = await model.generateContent(`User says: ${userMessage}`);
    const response = await result.response;
    const text = response.text();
    console.log("--- 5. Gemini responded! ---");

    return NextResponse.json({ reply: text });

  } catch (error: any) {
    // THIS IS THE IMPORTANT PART: It prints the real error to your terminal
    console.error("\n❌ CRITICAL ERROR DETAILS ❌\n", error);
    
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}