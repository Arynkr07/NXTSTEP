import careersData from "./careers.json";
import coursesData from "./courses.json";

export interface UserQuizAnswers {
  interests?: string[];
  cognitiveStyle?: string | null;
  workStyle?: "Hands-on/Practical" | "Analytical/Abstract" | string | null;
  environment?: string | null;
  careerPriority?: string | null;
  educationLevel?: string | null;
  skills?: string[];
  salaryExpectation?: string;
}

export interface CareerMatch {
  career: any;
  score: number;
  matchPercentage: number;
  matchReasons: string[];
  matchingSkills: string[];
  recommendedCourses: any[];
}

export function recommendCareers(answers: UserQuizAnswers, limit: number = 6): any[] {
  const userInterests = (answers.interests || []).map(i => i.toLowerCase().trim());
  const userSkills = (answers.skills || []).map(s => s.toLowerCase().trim());
  const userCognitiveStyle = (answers.cognitiveStyle || "").toLowerCase();
  const userWorkStyle = (answers.workStyle || "").toLowerCase();
  const userEnvironment = (answers.environment || "").toLowerCase();
  const userPriority = (answers.careerPriority || "").toLowerCase();
  const userEducation = (answers.educationLevel || "").toLowerCase();

  // Parse salary expectation number
  let userTargetSalary = 0;
  if (answers.salaryExpectation) {
    const digits = answers.salaryExpectation.replace(/[^0-9]/g, "");
    if (digits) {
      userTargetSalary = parseInt(digits, 10);
    }
  }

  const scored = (careersData as any[]).map(career => {
    let score = 0;
    const matchReasons: string[] = [];
    const matchingSkillsList: string[] = [];

    // ── 1. Domain & Interest Matching (35 points max) ─────────────────────
    const careerInterests = [
      ...(career.relatedInterests || []),
      career.title,
      career.description || ""
    ].map((i: string) => i.toLowerCase());

    let interestMatchCount = 0;
    userInterests.forEach(ui => {
      if (careerInterests.some(ci => ci.includes(ui) || ui.includes(ci))) {
        interestMatchCount++;
      }
    });

    if (interestMatchCount > 0) {
      const interestPoints = Math.min(interestMatchCount * 14, 35);
      score += interestPoints;
      matchReasons.push(`Direct alignment with your passions`);
    }

    // ── 2. Skills & Taxonomy Matching (30 points max) ──────────────────────
    const careerSkills = [
      ...(career.skills || []),
      ...(career.marketInsights?.topLinkedInSkills || []),
      career.title
    ].map((s: string) => s.toLowerCase());

    userSkills.forEach(us => {
      // Split into sub-terms for flexible matching e.g. "Python / Backend" -> ["python", "backend"]
      const subterms = us.split(/[\/, ]+/).filter(Boolean);
      const isMatch = subterms.some(term => careerSkills.some(cs => cs.includes(term)));
      if (isMatch && !matchingSkillsList.includes(us)) {
        matchingSkillsList.push(us);
      }
    });

    if (matchingSkillsList.length > 0) {
      const skillPoints = Math.min(matchingSkillsList.length * 10, 30);
      score += skillPoints;
      matchReasons.push(`Utilizes your strengths in ${matchingSkillsList.slice(0, 2).join(" & ")}`);
    }

    // ── 3. Cognitive & Problem Solving Style (15 points max) ───────────────
    if (userCognitiveStyle) {
      if (
        (userCognitiveStyle.includes("algorithmic") || userCognitiveStyle.includes("code")) &&
        (career.title.toLowerCase().includes("engineer") || career.title.toLowerCase().includes("developer") || career.title.toLowerCase().includes("data"))
      ) {
        score += 15;
        matchReasons.push("Ideal for algorithmic problem solving");
      } else if (
        (userCognitiveStyle.includes("visual") || userCognitiveStyle.includes("design")) &&
        (career.title.toLowerCase().includes("design") || career.title.toLowerCase().includes("product") || career.title.toLowerCase().includes("artist"))
      ) {
        score += 15;
        matchReasons.push("Matches human-centered & creative instincts");
      } else if (
        (userCognitiveStyle.includes("quantitative") || userCognitiveStyle.includes("data")) &&
        (career.title.toLowerCase().includes("analyst") || career.title.toLowerCase().includes("scientist") || career.title.toLowerCase().includes("finance"))
      ) {
        score += 15;
        matchReasons.push("Capitalizes on analytical & quantitative thinking");
      } else if (
        (userCognitiveStyle.includes("strategy") || userCognitiveStyle.includes("lead")) &&
        (career.title.toLowerCase().includes("manager") || career.title.toLowerCase().includes("product") || career.title.toLowerCase().includes("consultant"))
      ) {
        score += 15;
        matchReasons.push("Fits strategic execution & leadership drive");
      } else {
        score += 6;
      }
    } else if (userWorkStyle && career.workStyleFit) {
      if (userWorkStyle.includes(career.workStyleFit.toLowerCase())) {
        score += 12;
      } else {
        score += 5;
      }
    }

    // ── 4. Career Priority & Market Growth (10 points max) ─────────────────
    if (userPriority) {
      if (userPriority.includes("cutting-edge") || userPriority.includes("growth")) {
        if (career.marketInsights?.demandLevel === "Very High" || career.marketInsights?.growthRate?.includes("+")) {
          score += 10;
          matchReasons.push(`High market upside: ${career.marketInsights?.growthRate || "+25% YoY"}`);
        } else {
          score += 5;
        }
      } else if (userPriority.includes("compensation") || userPriority.includes("stability")) {
        if ((career.salaryNumericMax || 0) >= 1200000 || (career.salaryNumericMin || 0) >= 600000) {
          score += 10;
          matchReasons.push("High earning potential and strong industry stability");
        } else {
          score += 6;
        }
      } else {
        score += 7;
      }
    } else {
      score += 7;
    }

    // ── 5. Salary & Education Alignment (10 points max) ────────────────────
    if (userTargetSalary > 0 && career.salaryNumericMax) {
      if (userTargetSalary <= career.salaryNumericMax) {
        score += 10;
      } else {
        score += 4;
      }
    } else {
      score += 7;
    }

    // Normalized match percentage between 48% and 98%
    const matchPercentage = Math.min(Math.max(Math.round(score), 48), 98);

    // Fetch recommended courses
    const recommendedCourses = (career.recommendedCourseIds || [])
      .map((cId: string) => (coursesData as any[]).find(course => course.id === cId))
      .filter(Boolean);

    return {
      ...career,
      score,
      matchPercentage,
      matchReasons: matchReasons.slice(0, 3),
      matchingSkills: matchingSkillsList,
      recommendedCourses
    };
  });

  // Sort descending by score
  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, limit);
}
