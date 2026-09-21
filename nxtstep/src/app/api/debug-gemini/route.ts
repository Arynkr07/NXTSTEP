import { NextResponse } from 'next/server';
import { generateMilestoneCoachingAI } from '@/lib/gemini';
export const dynamic = 'force-dynamic';
export async function GET() {
  try {
    const stream = await generateMilestoneCoachingAI({ career: 'Test', steps: [], completedStepIndices: [] });
    return new Response(stream);
  } catch (err: any) {
    return NextResponse.json({ error: err.message, stack: err.stack });
  }
}
