import careersJson from "./careers.json";
import coursesJson from "./courses.json";

export interface MarketInsights {
  demandLevel: string;
  growthRate: string;
  seniorityLadder: string[];
  experienceRequired: string;
  salaryEntry: string;
  salaryMid: string;
  salarySenior: string;
  topLinkedInSkills: string[];
}

export interface CourseItem {
  id: string;
  title: string;
  provider: string;
  platform: "Coursera" | "edX" | "Udemy" | string;
  rating: number;
  reviews?: string;
  difficulty: string;
  duration: string;
  costType?: string;
  link: string;
  skills: string[];
  categories: string[];
}

export interface Career {
  id: number;
  title: string;
  description: string;
  pursuitSteps: string[];
  colleges: string;
  salary: string;
  fees: string;
  howTo: string;
  link: string;
  imageUrl: string;
  iconKey: "brain" | "laptop" | "leaf" | "default";
  relatedInterests: string[];
  skills: string[];
  category?: string;
  workStyleFit?: string;
  educationLevel?: string;
  marketInsights?: MarketInsights;
  salaryNumericMin?: number;
  salaryNumericMax?: number;
  recommendedCourseIds?: string[];
  recommendedCourses?: CourseItem[];
  score?: number;
  matchPercentage?: number;
  [key: string]: any;
}

export const careerOptions: Career[] = careersJson as unknown as Career[];
export const coursesData: CourseItem[] = coursesJson as unknown as CourseItem[];

export function getCareerById(id: number | string): Career | undefined {
  return careerOptions.find(c => String(c.id) === String(id));
}

export function getCareerByTitle(title: string): Career | undefined {
  const clean = title.toLowerCase().trim();
  return careerOptions.find(c => c.title.toLowerCase().trim() === clean || c.title.toLowerCase().includes(clean));
}

export function getCoursesForCareer(career: Career): CourseItem[] {
  if (career.recommendedCourses && career.recommendedCourses.length > 0) {
    return career.recommendedCourses;
  }
  
  if (career.recommendedCourseIds && career.recommendedCourseIds.length > 0) {
    return career.recommendedCourseIds
      .map(cId => coursesData.find(c => c.id === cId))
      .filter((c): c is CourseItem => Boolean(c));
  }

  // Smart fallback: search courses based on career title and skills
  const rawTerms = [
    career.title.toLowerCase(),
    ...(career.skills || []).map(s => s.toLowerCase()),
    ...(career.marketInsights?.topLinkedInSkills || []).map(s => s.toLowerCase())
  ].join(" ").split(/\s+/).filter(w => w.length > 3);

  // Remove extremely generic stop-words that cause false positives
  const genericWords = new Set(["systems", "management", "data", "software", "development", "engineer", "professional", "certified", "basics", "fundamentals", "introduction", "advanced", "applied", "skills", "troubleshooting", "maintenance", "services", "operations", "general"]);
  const searchTerms = rawTerms.filter(w => !genericWords.has(w));
  
  // Add the full title as a heavy-weight term
  const fullTitle = career.title.toLowerCase();

  const scoredCourses = coursesData.map(course => {
    let score = 0;
    const courseTitleLower = course.title.toLowerCase();
    const courseText = [course.title, ...(course.skills || []), ...(course.categories || [])].join(" ").toLowerCase();
    
    // Exact or partial full-title match gets massive boost
    if (courseTitleLower.includes(fullTitle) || fullTitle.includes(courseTitleLower)) {
      score += 50;
    }

    for (const term of searchTerms) {
      if (courseTitleLower.includes(term)) {
        score += 3; // Title hits are worth more
      } else if (courseText.includes(term)) {
        score += 1;
      }
    }
    return { course, score };
  });

  scoredCourses.sort((a, b) => b.score - a.score);
  
  // Return the top 2 matching courses, or generic ones if scores are 0
  if (scoredCourses.length > 0 && scoredCourses[0].score > 0) {
    return scoredCourses.slice(0, 2).map(s => s.course);
  }
  
  // Absolute fallback if no keywords match (return generic business/soft skills rather than hardcoded AI)
  return coursesData.filter(c => c.title.includes("Business") || c.title.includes("Management")).slice(0, 2);
}
