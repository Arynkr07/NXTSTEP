// app/api/roadmap/coach/route.ts
// Interactive AI Milestone Coach for Roadmap Progress Tracking.

import { NextRequest, NextResponse } from "next/server";
import { verifyAuthHeader } from "@/lib/firebase-admin";
import { generateMilestoneCoachingAI } from "@/lib/gemini";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    await verifyAuthHeader(authHeader); // optional authentication

    const body = (await req.json()) as {
      career: string;
      steps: Array<{ title: string; description: string; duration?: string }>;
      completedStepIndices: number[];
      userChallenge?: string;
    };

    const { career, steps, completedStepIndices = [], userChallenge } = body;

    if (!career || !Array.isArray(steps)) {
      return NextResponse.json(
        { error: "career and steps array are required" },
        { status: 400 }
      );
    }

    const stream = await generateMilestoneCoachingAI({
      career,
      steps,
      completedStepIndices,
      userChallenge,
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (err) {
    console.error("[roadmap/coach] error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
