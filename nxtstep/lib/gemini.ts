// lib/gemini.ts
// Centralized Gemini AI client for NxtStep
// – generateEmbedding()    → text-embedding-004 (768 dims)
// – generateRoadmapAI()    → streamed career roadmap with RAG context
// – generateChatAI()       → streamed career chat with RAG context + history

import { GoogleGenerativeAI } from "@google/generative-ai";
import { getCareerByTitle, getCoursesForCareer } from "@/lib/data/careers";
import { findGuidanceInsight } from "@/lib/data/careerIntelligence";
import type { CareerEmbedding, ChatMessage } from "@/lib/supabase";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const CHAT_MODEL = process.env.GEMINI_MODEL || "gemini-1.5-flash";
const EMBED_MODEL = "text-embedding-004";

// ── Gemini Client ─────────────────────────────────────────────────────────────

function getClient(): GoogleGenerativeAI {
  if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not set in environment variables.");
  }
  return new GoogleGenerativeAI(GEMINI_API_KEY);
}

// ── Embedding ─────────────────────────────────────────────────────────────────

/**
 * Generates a 768-dimensional embedding vector for the given text.
 * Uses Gemini text-embedding-004.
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  const client = getClient();
  const model = client.getGenerativeModel({ model: EMBED_MODEL });
  const result = await model.embedContent(text);
  return result.embedding.values;
}

// ── Roadmap Generation ────────────────────────────────────────────────────────

export interface RoadmapOptions {
  career: string;
  userInterests?: string[];
  userSkills?: string[];
  ragContext?: CareerEmbedding[];
}

/**
 * Streams a personalized career roadmap.
 * Returns a ReadableStream of text chunks.
 * Falls back to dataset-driven roadmap if the API key is missing.
 */
export async function generateRoadmapAI(
  options: RoadmapOptions
): Promise<ReadableStream<Uint8Array>> {
  const { career, userInterests = [], userSkills = [], ragContext = [] } = options;

  if (!GEMINI_API_KEY) {
    return generateDatasetFallbackRoadmap(career);
  }

  const careerData = getCareerByTitle(career);
  const courses = careerData ? getCoursesForCareer(careerData) : [];

  // Build RAG context block from pgvector results
  const contextBlock =
    ragContext.length > 0
      ? ragContext
          .map(
            (c) =>
              `Career: ${c.career_title}\nContext: ${c.content}\nSkills: ${
                Array.isArray((c.metadata as Record<string, unknown>)?.skills)
                  ? ((c.metadata as Record<string, unknown>).skills as string[]).join(", ")
                  : ""
              }`
          )
          .join("\n\n---\n\n")
      : "No RAG context available — rely on general knowledge.";

  const courseBlock =
    courses.length > 0
      ? courses
          .slice(0, 4)
          .map((c) => `- ${c.title} (${c.platform}) — ${c.level}`)
          .join("\n")
      : "";

  const systemPrompt = `You are an expert career mentor at NxtStep — an AI career guidance platform.
Your role is to generate practical, specific, and motivating career roadmaps.

REAL-WORLD CONTEXT FROM LINKEDIN JOB DATA:
${contextBlock}

AVAILABLE COURSES:
${courseBlock || "Not available"}

USER PROFILE:
- Interests: ${userInterests.join(", ") || "Not specified"}
- Current Skills: ${userSkills.join(", ") || "Not specified"}
- Target Career: ${career}

INSTRUCTIONS:
Generate a structured 5-step career roadmap in this exact JSON format:
{
  "steps": [
    {
      "title": "Step title",
      "description": "2-3 sentence practical description grounded in real LinkedIn job requirements",
      "duration": "e.g. 3-6 months"
    }
  ],
  "motivation": "One powerful motivational sentence personalized to the user's interests",
  "marketInsight": "One sentence about real demand/salary based on LinkedIn data"
}

Base recommendations on the LinkedIn data provided. Be specific about tools, technologies, and skills that employers actually hire for.`;

  try {
    const client = getClient();
    const model = client.getGenerativeModel({ model: CHAT_MODEL });

    const encoder = new TextEncoder();
    const stream = await model.generateContentStream(systemPrompt);

    return new ReadableStream<Uint8Array>({
      async start(controller) {
        try {
          for await (const chunk of stream.stream) {
            const text = chunk.text();
            if (text) controller.enqueue(encoder.encode(text));
          }
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });
  } catch {
    // Model fallback
    try {
      const client = getClient();
      const model = client.getGenerativeModel({ model: "gemini-1.5-flash" });
      const encoder = new TextEncoder();
      const stream = await model.generateContentStream(systemPrompt);

      return new ReadableStream<Uint8Array>({
        async start(controller) {
          try {
            for await (const chunk of stream.stream) {
              const text = chunk.text();
              if (text) controller.enqueue(encoder.encode(text));
            }
            controller.close();
          } catch (err) {
            controller.error(err);
          }
        },
      });
    } catch {
      return generateDatasetFallbackRoadmap(career);
    }
  }
}

/**
 * Generates a roadmap from the local dataset (no API key needed).
 */
export function generateDatasetFallbackRoadmap(
  career: string
): ReadableStream<Uint8Array> {
  const careerData = getCareerByTitle(career);
  const courses = careerData ? getCoursesForCareer(careerData) : [];

  const steps = [
    {
      title: "Foundation & Learning",
      description: `Build core knowledge in ${career}. Focus on fundamentals through structured courses and self-study.`,
      duration: "0-6 months",
    },
    {
      title: "Skill Building",
      description: careerData?.howTo?.[0] || `Practice hands-on projects relevant to ${career}.`,
      duration: "6-12 months",
    },
    {
      title: "Portfolio Development",
      description: `Create 2-3 real projects that demonstrate ${career} skills. Publish on GitHub.`,
      duration: "12-18 months",
    },
    {
      title: "Industry Exposure",
      description: careerData?.howTo?.[1] || `Network with professionals, attend events, and target internships.`,
      duration: "18-24 months",
    },
    {
      title: "Land Your Role",
      description: `Apply to ${career} positions. Target companies that match your work style and salary goals.`,
      duration: "24-30 months",
    },
  ];

  const payload = JSON.stringify({
    steps,
    motivation: `Your journey to become a ${career} starts with a single step — and you've already taken it.`,
    marketInsight: careerData?.marketInsights
      ? `Demand: ${careerData.marketInsights.demandLevel}, Growth: ${careerData.marketInsights.growthRate}`
      : `${career} is a growing field with strong market demand.`,
    courses: courses.slice(0, 3).map((c) => ({ title: c.title, url: c.url, platform: c.platform })),
  });

  const encoder = new TextEncoder();
  return new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(encoder.encode(payload));
      controller.close();
    },
  });
}

// ── Chat Generation ───────────────────────────────────────────────────────────

export interface ChatOptions {
  message: string;
  history?: ChatMessage[];
  ragContext?: CareerEmbedding[];
  quizResults?: Record<string, unknown>;
}

/**
 * Streams a career-focused chat response.
 * Injects RAG context and conversation history.
 */
export async function generateChatAI(
  options: ChatOptions
): Promise<ReadableStream<Uint8Array>> {
  const { message, history = [], ragContext = [], quizResults } = options;

  const insight = findGuidanceInsight(message);

  const contextBlock =
    ragContext.length > 0
      ? ragContext
          .map((c) => `Career: ${c.career_title}\nInfo: ${c.content}`)
          .join("\n\n")
      : "";

  const systemInstruction = `You are Nova, an elite AI career counselor for NxtStep.

Your personality: Direct, honest, energizing, and deeply knowledgeable about career paths.
Your focus: ONLY career-related topics — paths, skills, salaries, study plans, industries.

${contextBlock ? `CAREER KNOWLEDGE BASE:\n${contextBlock}\n\n` : ""}
${insight ? `CAREER GUIDANCE INSIGHT:\n${insight}\n\n` : ""}
${quizResults ? `USER CAREER PROFILE:\n${JSON.stringify(quizResults, null, 2)}\n\n` : ""}

RULES:
- If asked about non-career topics, redirect: "I'm built to talk careers — let's focus there!"
- Always be specific — mention real tools, technologies, salaries, job titles
- Keep responses under 200 words unless the user asks for detail
- Use bullet points for lists
- Reference the user's quiz profile when relevant`;

  if (!GEMINI_API_KEY) {
    const fallback =
      "I need a Gemini API key to give you personalized advice. " +
      "For now: focus on building strong fundamentals in your chosen field, " +
      "create portfolio projects, and start networking on LinkedIn!";
    const encoder = new TextEncoder();
    return new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(encoder.encode(fallback));
        controller.close();
      },
    });
  }

  // Build conversation history for Gemini
  const historyForGemini = history.slice(-10).map((m) => ({
    role: m.role,
    parts: [{ text: m.content }],
  }));

  try {
    const client = getClient();
    const model = client.getGenerativeModel({
      model: CHAT_MODEL,
      systemInstruction,
    });

    const chat = model.startChat({ history: historyForGemini });
    const stream = await chat.sendMessageStream(message);
    const encoder = new TextEncoder();

    return new ReadableStream<Uint8Array>({
      async start(controller) {
        try {
          for await (const chunk of stream.stream) {
            const text = chunk.text();
            if (text) controller.enqueue(encoder.encode(text));
          }
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });
  } catch {
    try {
      const client = getClient();
      const model = client.getGenerativeModel({
        model: "gemini-1.5-flash",
        systemInstruction,
      });
      const chat = model.startChat({ history: historyForGemini });
      const stream = await chat.sendMessageStream(message);
      const encoder = new TextEncoder();

      return new ReadableStream<Uint8Array>({
        async start(controller) {
          try {
            for await (const chunk of stream.stream) {
              const text = chunk.text();
              if (text) controller.enqueue(encoder.encode(text));
            }
            controller.close();
          } catch (err) {
            controller.error(err);
          }
        },
      });
    } catch (innerErr: any) {
      console.error("Gemini API Error:", innerErr.message);
      const encoder = new TextEncoder();
      return new ReadableStream<Uint8Array>({
        start(controller) {
          controller.enqueue(
            encoder.encode(`### ⚠️ AI Connection Failed\n\nGemini API Error: ${innerErr.message || "Unknown Error"}\n\nPlease check your GEMINI_API_KEY in Vercel.`)
          );
          controller.close();
        },
      });
    }
  }
}

// ── Milestone Coaching Generation ─────────────────────────────────────────────

export interface MilestoneCoachingOptions {
  career: string;
  steps: Array<{ title: string; description: string; duration?: string }>;
  completedStepIndices: number[];
  userChallenge?: string;
}

/**
 * Generates interactive milestone coaching tailored to what the user has completed vs pending.
 */
export async function generateMilestoneCoachingAI(
  options: MilestoneCoachingOptions
): Promise<ReadableStream<Uint8Array>> {
  const { career, steps, completedStepIndices, userChallenge } = options;

  const total = steps.length;
  const doneCount = completedStepIndices.length;
  const pendingSteps = steps.filter((_, idx) => !completedStepIndices.includes(idx));
  const nextPendingStep = pendingSteps[0] || null;

  const completedTitles = completedStepIndices.map((idx) => steps[idx]?.title).filter(Boolean);
  const pendingTitles = pendingSteps.map((s) => s.title);

  const prompt = `You are the Lead Career Architect at NxtStep.
The user is pursuing the career: **${career}**.

CURRENT PROGRESS STATUS:
- Total Milestones: ${total}
- Completed (${doneCount}/${total}): ${completedTitles.length > 0 ? completedTitles.join(", ") : "None yet - starting out"}
- Pending (${total - doneCount}/${total}): ${pendingTitles.join(", ")}
${nextPendingStep ? `- Immediate Next Milestone to conquer: "${nextPendingStep.title}" (${nextPendingStep.description})` : "- All milestones completed!"}
${userChallenge ? `- User's Specific Question / Blocker: "${userChallenge}"` : ""}

YOUR MISSION:
Deliver a crisp, punchy, and energizing game plan. Do NOT clutter with excessive asterisks. Keep it conversational, actionable, and under 250 words.

Structure your response with these exact headers:
### 1. Where You Stand
Celebrate progress in 1-2 sharp, motivating sentences.

### 2. Next 7-Day Sprint
Give 3 concrete bullet points (tools to try, specific concepts to grasp, or exact workflow steps).

### 3. Portfolio Proof
1 specific, impressive portfolio project idea that recruiters and hiring managers in this field love seeing.

### 4. Coach's Challenge
1 short, direct question to help them conquer their next blocker.`;

  if (!GEMINI_API_KEY) {
    const fallbackText = `### 🎯 Progress Overview for ${career}\n\nYou have completed **${doneCount} of ${total} milestones** (${Math.round((doneCount / Math.max(total, 1)) * 100)}%).\n\n#### ⚡ Next Tactical Step: ${nextPendingStep?.title || "Final Polish"}\n- **Focus**: Dedicate 5-8 hours weekly to mastering core practical skills.\n- **Action**: Build 1 standalone project showcasing real problem-solving.\n- **Next Milestone**: ${nextPendingStep?.description || "Network with professionals and apply for entry roles."}\n\n*Add your GEMINI_API_KEY to get real-time tailored AI coaching on demand!*`;
    const encoder = new TextEncoder();
    return new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(encoder.encode(fallbackText));
        controller.close();
      },
    });
  }

  try {
    const client = getClient();
    const model = client.getGenerativeModel({ model: CHAT_MODEL });
    const stream = await model.generateContentStream(prompt);
    const encoder = new TextEncoder();

    return new ReadableStream<Uint8Array>({
      async start(controller) {
        try {
          for await (const chunk of stream.stream) {
            const text = chunk.text();
            if (text) controller.enqueue(encoder.encode(text));
          }
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });
  } catch (outerErr: any) {
    try {
      const client = getClient();
      const model = client.getGenerativeModel({ model: "gemini-1.5-flash" });
      const stream = await model.generateContentStream(prompt);
      const encoder = new TextEncoder();

      return new ReadableStream<Uint8Array>({
        async start(controller) {
          try {
            for await (const chunk of stream.stream) {
              const text = chunk.text();
              if (text) controller.enqueue(encoder.encode(text));
            }
            controller.close();
          } catch (err) {
            controller.error(err);
          }
        },
      });
    } catch (innerErr: any) {
      console.error("Gemini API Error:", innerErr.message);
      const encoder = new TextEncoder();
      return new ReadableStream<Uint8Array>({
        start(controller) {
          controller.enqueue(
            encoder.encode(`### ⚠️ AI Connection Failed\n\nGemini API Error: ${innerErr.message || "Unknown Error"}\n\nPlease check your GEMINI_API_KEY in Vercel.`)
          );
          controller.close();
        },
      });
    }
  }
}
