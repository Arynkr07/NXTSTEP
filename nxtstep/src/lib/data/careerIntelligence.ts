/**
 * Grounded Career Guidance Intelligence Benchmark Knowledge Base
 * Based on: kaggle.com/datasets/tea340yashjoshi/career-guidance-intelligence-benchmark-dataset
 */

export interface GuidanceScenario {
  topic: string;
  keywords: string[];
  counselorGuidance: string;
  recommendedSkillPivots: string[];
}

export const CAREER_GUIDANCE_BENCHMARKS: GuidanceScenario[] = [
  {
    topic: "AI / Tech Career Transition",
    keywords: ["ai", "machine learning", "coding", "software", "python", "developer", "data"],
    counselorGuidance: "Focus on strong computer science fundamentals: Data Structures, Algorithms, and Python. Build portfolio projects demonstrating end-to-end model deployment or full-stack APIs rather than just notebook experiments.",
    recommendedSkillPivots: ["Python", "SQL", "Git", "Docker", "FastAPI / Next.js", "Cloud Deployment"]
  },
  {
    topic: "Design / Creative Transition",
    keywords: ["ui", "ux", "design", "figma", "creative", "artist", "product design"],
    counselorGuidance: "Prioritize user research and product empathy over purely aesthetic mockups. Recruiters look for problem statements, user friction maps, iterative wireframes, and measurable usability impact.",
    recommendedSkillPivots: ["Figma", "Design Systems", "User Interviews", "Usability Testing", "Interactive Prototyping"]
  },
  {
    topic: "Finance & Quantitative Path",
    keywords: ["finance", "banking", "investment", "analyst", "ca", "cfa", "accounting"],
    counselorGuidance: "Excel financial modeling and corporate valuation (DCF, Comps) are the core currency. Complement accounting standards with statistical data analysis tools (SQL/Python).",
    recommendedSkillPivots: ["3-Statement Financial Modeling", "DCF Valuation", "Advanced Excel", "PowerPoint", "SQL"]
  },
  {
    topic: "Healthcare & Life Sciences",
    keywords: ["doctor", "medicine", "biotech", "healthcare", "pharma", "clinical"],
    counselorGuidance: "Clinical excellence requires clinical rigor combined with emerging digital health technologies. Gaining early research or hospital internship exposure is vital.",
    recommendedSkillPivots: ["Clinical Diagnostics", "Patient Communication", "Biostatistics", "Bioinformatics"]
  },
  {
    topic: "General Career Confusion / Beginner",
    keywords: ["confused", "don't know", "lost", "where to start", "help me choose", "beginner"],
    counselorGuidance: "Start by identifying your natural work style: do you prefer hands-on execution or abstract analytical problem solving? Narrow down to 2 core domains, build a foundational skill (like Coding, Communication, or Data Analysis), and test through 2-4 week micro-projects.",
    recommendedSkillPivots: ["Self-Assessment", "Communication", "Basic Data Literacy", "Portfolio Micro-Projects"]
  }
];

export function findGuidanceInsight(query: string): string | null {
  const lower = query.toLowerCase();
  for (const scenario of CAREER_GUIDANCE_BENCHMARKS) {
    if (scenario.keywords.some(kw => lower.includes(kw))) {
      return `${scenario.counselorGuidance} Key skills to develop: ${scenario.recommendedSkillPivots.join(", ")}.`;
    }
  }
  return null;
}
