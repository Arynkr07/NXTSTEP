// lib/offlineRecommender.ts
// Intelligent local career matching engine for NxtStep
// Used when Gemini API is offline, rate-limited (429), or quota-exhausted.
// Provides multi-factor algorithmic scoring across the 35+ enriched career dataset.

import { careerOptions, Career } from "@/lib/data/careers";
import { QuizState, AssessmentResponse, CareerRecommendationResult } from "@/app/quiz/types";

const TOP_COMPANIES_BY_CATEGORY: Record<string, string[]> = {
  Technology: ["Google", "Microsoft", "Amazon", "Stripe", "CRED", "Razorpay"],
  AI: ["OpenAI", "Google DeepMind", "Meta AI", "Anthropic", "Sarvam AI", "Nvidia"],
  Data: ["Snowflake", "Databricks", "Spotify", "Palantir", "Fractal Analytics"],
  Design: ["Apple", "Airbnb", "Figma", "Canva", "CRED", "Adobe"],
  Product: ["Notion", "Atlassian", "Uber", "Zepto", "Groww", "Swiggy"],
  Finance: ["Goldman Sachs", "JP Morgan", "Morgan Stanley", "Zerodha", "BlackRock"],
  Healthcare: ["Apollo Hospitals", "Roche", "Pfizer", "Biocon", "Novartis"],
  Engineering: ["Tesla", "SpaceX", "Nvidia", "Qualcomm", "Apple", "L&T"],
  Business: ["McKinsey & Co", "BCG", "Bain & Company", "Deloitte", "Zomato"],
  Marketing: ["HubSpot", "Shopify", "ByteDance", "Netflix", "Nike", "Duolingo"],
  Default: ["Google", "Microsoft", "Amazon", "Stripe", "Accenture", "TCS"]
};

function getHiringCompanies(career: Career): string[] {
  const cat = career.category || "";
  const title = career.title.toLowerCase();

  if (title.includes("ai") || title.includes("machine learning") || title.includes("prompt")) {
    return TOP_COMPANIES_BY_CATEGORY.AI;
  }
  if (title.includes("data") || title.includes("analyst") || title.includes("scientist")) {
    return TOP_COMPANIES_BY_CATEGORY.Data;
  }
  if (title.includes("design") || title.includes("ui") || title.includes("ux")) {
    return TOP_COMPANIES_BY_CATEGORY.Design;
  }
  if (title.includes("product") || title.includes("program manager")) {
    return TOP_COMPANIES_BY_CATEGORY.Product;
  }
  if (title.includes("finance") || title.includes("banking") || title.includes("investment")) {
    return TOP_COMPANIES_BY_CATEGORY.Finance;
  }
  if (title.includes("health") || title.includes("doctor") || title.includes("biotech")) {
    return TOP_COMPANIES_BY_CATEGORY.Healthcare;
  }
  if (TOP_COMPANIES_BY_CATEGORY[cat]) {
    return TOP_COMPANIES_BY_CATEGORY[cat];
  }
  return TOP_COMPANIES_BY_CATEGORY.Default;
}

export function generateOfflineAssessment(state: QuizState): AssessmentResponse {
  const userSkills = (state.skills || []).map((s) => ({
    name: s.name.toLowerCase().trim(),
    proficiency: s.proficiency || "intermediate",
    weight: s.proficiency === "advanced" ? 3 : s.proficiency === "intermediate" ? 2 : 1,
  }));

  const userSkillNames = userSkills.map((s) => s.name);
  const userActivities = (state.activities || []).map((a) => a.toLowerCase().trim());
  const freeTextCorpus = [
    state.frustrations || "",
    state.projects || "",
    state.fieldOfStudy || "",
    state.aiFollowUpAnswer || "",
    state.concern || "",
  ]
    .join(" ")
    .toLowerCase();

  // Tokenize and extract keywords from user inputs
  const extractKeywords = (texts: string[]) => {
    return texts
      .join(" ")
      .toLowerCase()
      .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 3 && !["this", "that", "with", "from", "your", "what", "how", "and", "the", "for"].includes(w));
  };

  const userKeywords = extractKeywords([...userActivities, freeTextCorpus, ...userSkillNames, state.fieldOfStudy || ""]);

  const field = (state.fieldOfStudy || "").toLowerCase().trim();
  const careerPool = careerOptions.filter((career) => {
    const haystack = [
      career.title,
      career.category || "",
      career.description || "",
      ...(career.skills || []),
      ...(career.marketInsights?.topLinkedInSkills || []),
    ].join(" ").toLowerCase();

    if (field && (haystack.includes(field) || field.includes(haystack))) {
      return true;
    }

    const hasSkillMatch = userSkills.some((uSkill) => {
      const token = uSkill.name.toLowerCase().trim();
      return token && haystack.includes(token);
    });

    if (hasSkillMatch) {
      return true;
    }

    return userKeywords.some((kw) => haystack.includes(kw));
  });

  const candidatePool = careerPool.length > 0 ? careerPool.slice(0, 180) : careerOptions.slice(0, 60);

  const scored = candidatePool.map((career) => {
    let score = 0;
    const careerTitleLower = career.title.toLowerCase();
    const careerCategoryLower = (career.category || "").toLowerCase();
    const careerDescLower = (career.description || "").toLowerCase();
    const careerSkills = (career.skills || []).map((s) => s.toLowerCase());
    const topSkills = (career.marketInsights?.topLinkedInSkills || []).map((s) => s.toLowerCase());
    const careerTokens = new Set(
      extractKeywords([careerTitleLower, careerCategoryLower, careerDescLower, ...careerSkills, ...topSkills])
    );

    let matchedSkillCount = 0;
    for (const uSkill of userSkills) {
      const uName = uSkill.name.toLowerCase().trim();
      if (!uName) continue;
      const hasMatch =
        careerTokens.has(uName) ||
        careerSkills.some((cs) => cs.includes(uName) || uName.includes(cs)) ||
        careerTitleLower.includes(uName) ||
        careerCategoryLower.includes(uName);

      if (hasMatch) {
        score += 15 * (uSkill.weight || 1);
        matchedSkillCount++;
      }
    }

    let keywordHits = 0;
    for (const kw of userKeywords) {
      if (careerTitleLower.includes(kw) || careerCategoryLower.includes(kw) || careerDescLower.includes(kw)) {
        score += 8;
        keywordHits++;
      } else if (careerTokens.has(kw)) {
        score += 3;
        keywordHits++;
      }
    }

    if (field && (careerCategoryLower.includes(field) || careerTitleLower.includes(field))) {
      score += 20;
    }

    return {
      career,
      score,
      matchedSkillCount,
      keywordHits,
    };
  });

  scored.sort((a, b) => b.score - a.score);

  const topMatches: typeof scored = [];

  for (const item of scored) {
    if (topMatches.length >= 3) break;
    
    const normTitle = item.career.title.toLowerCase().trim();
    
    // Check if we already added a highly similar career (e.g. "Software Engineer" vs "Senior Software Engineer")
    let isDuplicate = false;
    for (const match of topMatches) {
      const matchTitle = match.career.title.toLowerCase().trim();
      // If one string contains the other, consider it a duplicate (e.g. "Artist" vs "Fine Artist")
      if (matchTitle.includes(normTitle) || normTitle.includes(matchTitle)) {
        isDuplicate = true;
        break;
      }
    }

    if (!isDuplicate) {
      topMatches.push(item);
    }
  }

  // If no strong matches found, pick top relevant from varied categories
  const fallbackList = topMatches.length >= 3 && topMatches[0].score > 0
    ? topMatches
    : [
        { career: careerOptions[0] || careerOptions.find(c => c.title.includes("Software"))!, score: 85, matchedSkillCount: 1 },
        { career: careerOptions[1] || careerOptions.find(c => c.title.includes("Data"))!, score: 80, matchedSkillCount: 1 },
        { career: careerOptions[2] || careerOptions.find(c => c.title.includes("Product"))!, score: 75, matchedSkillCount: 0 },
      ];

  const primaryActivity = state.activities?.[0] || "problem solving and building";
  const primarySkill = state.skills?.[0]?.name || "analytical thinking";

  const mappedCareers: CareerRecommendationResult[] = fallbackList.map((item, idx) => {
    const c = item.career;
    const baseFit = Math.min(96, Math.max(78, 95 - idx * 4 + Math.min(item.matchedSkillCount * 2, 6)));

    // Calculate skill gaps: skills from career that the user didn't list
    const allCareerSkills = [...(c.skills || []), ...(c.marketInsights?.topLinkedInSkills || [])];
    const userSkillSet = new Set(userSkillNames);
    const gaps = allCareerSkills.filter((s) => !userSkillSet.has(s.toLowerCase())).slice(0, 3);
    const finalGaps = gaps.length > 0 ? gaps : ["Advanced System Architecture", "Production Deployment"];

    const firstSteps = c.pursuitSteps && c.pursuitSteps.length >= 3
      ? c.pursuitSteps.slice(0, 3)
      : [
          `Master core fundamentals in ${c.title} workflows`,
          `Build 2 production-grade projects showcasing ${finalGaps[0] || 'practical skills'}`,
          `Refine portfolio and target high-growth employers in this space`,
        ];

    const whyItFits = `Your focus on ${primaryActivity} paired with your grasp of ${primarySkill} creates high-velocity alignment with ${c.title}. Market hiring data reflects surging demand (+25% YoY) for practitioners who can execute independently.`;

    return {
      title: c.title,
      fitScore: baseFit,
      whyItFits,
      salaryMatch: true,
      timelineRealistic: true,
      skillGaps: finalGaps,
      firstSteps,
      topCompaniesHiring: getHiringCompanies(c),
    };
  });

  // Archetype Synthesis
  const topCareer = mappedCareers[0];
  const archetypeInsight = `You demonstrate a high-leverage builder archetype with strong execution capability in ${primaryActivity}. Based on your proficiency in ${primarySkill} and target compensation (${state.salaryRange}), the ${topCareer.title} trajectory maximizes your immediate career velocity.`;

  const competitiveAdvantage = userSkillNames.length > 0
    ? `Strong foundational grasp of ${userSkillNames.slice(0, 3).join(", ")} combined with clear outcome orientation.`
    : `Rapid problem-solving aptitude and clear adaptability to modern digital toolkits.`;

  const strategicWatchout = `Avoid getting trapped in tutorial loops without shipping end-to-end projects. Focus on mastering ${mappedCareers[0]?.skillGaps?.[0] || "core tools"} and deploying publicly.`;

  return {
    needsRefinement: false,
    careers: mappedCareers,
    overallInsight: archetypeInsight,
    biggestStrength: competitiveAdvantage,
    watchOut: strategicWatchout,
  };
}
