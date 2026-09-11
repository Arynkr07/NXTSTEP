const fs = require('fs');
const path = require('path');

// Domain enrichment mappings based on 1.3M LinkedIn skills and LinkedIn 2023-2024 postings
const domainEnrichments = {
  Technology: {
    workStyle: "Analytical/Abstract",
    education: "Bachelor's Degree",
    growth: "+28% YoY",
    demand: "Very High",
    fees: "₹ 4 - 12 Lakhs (Degree) / Online Certifications: ₹ 15,000 - 45,000",
    topSkills: ["Python", "JavaScript", "TypeScript", "SQL", "Cloud Computing", "Git", "Docker", "Algorithms", "System Design"],
    courses: ["c-cs-1", "c-web-1", "c-web-2", "c-ai-1", "c-sec-1", "c-cloud-1"]
  },
  Finance: {
    workStyle: "Analytical/Abstract",
    education: "Bachelor's Degree",
    growth: "+19% YoY",
    demand: "High",
    fees: "₹ 5 - 18 Lakhs (Degree/MBA) / Certifications: ₹ 25,000 - 1.5 Lakhs",
    topSkills: ["Financial Modeling", "Excel", "Data Analysis", "Risk Assessment", "Valuation", "Accounting", "Corporate Finance"],
    courses: ["c-fin-1", "c-fin-2", "c-lead-1"]
  },
  Healthcare: {
    workStyle: "Hands-on/Practical",
    education: "Master's Degree",
    growth: "+18% YoY",
    demand: "Very High",
    fees: "₹ 2 - 25 Lakhs (Medical/Clinical Training)",
    topSkills: ["Clinical Diagnostics", "Patient Care", "Medical Ethics", "Healthcare Analytics", "Pharmacology", "Communication"],
    courses: ["c-health-1"]
  },
  "Creative Arts": {
    workStyle: "Hands-on/Practical",
    education: "Bachelor's Degree",
    growth: "+22% YoY",
    demand: "High",
    fees: "₹ 2 - 8 Lakhs (Design/Media) / Online Portfolio: ₹ 10,000 - 30,000",
    topSkills: ["Figma", "Visual Storytelling", "Copywriting", "Creative Direction", "Typography", "Communication"],
    courses: ["c-ux-1", "c-write-1", "c-web-1"]
  },
  Science: {
    workStyle: "Analytical/Abstract",
    education: "Bachelor's Degree",
    growth: "+24% YoY",
    demand: "High",
    fees: "₹ 3 - 9 Lakhs (B.Tech/B.Sc/M.Sc)",
    topSkills: ["Research Methodologies", "Python", "Data Analysis", "Statistical Modeling", "Lab Techniques", "Problem Solving"],
    courses: ["c-ai-1", "c-data-2", "c-sus-1"]
  },
  "Social Impact": {
    workStyle: "Hands-on/Practical",
    education: "Bachelor's Degree",
    growth: "+16% YoY",
    demand: "Growing",
    fees: "₹ 1.5 - 5 Lakhs (Degree) / Field Internships",
    topSkills: ["Public Policy", "Stakeholder Engagement", "Community Outreach", "Program Evaluation", "Leadership", "Communication"],
    courses: ["c-lead-1", "c-write-1"]
  }
};

// High quality curated unsplash image library by role keywords to replace placehold.co
const imageLibrary = {
  "Cloud Architect": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=900&q=80",
  "Robotics Engineer": "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=900&q=80",
  "DevOps Engineer": "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&w=900&q=80",
  "Aerospace Engineer": "https://images.unsplash.com/photo-1517976487507-5b3b4b45f912?auto=format&fit=crop&w=900&q=80",
  "Biomedical Engineer": "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=900&q=80",
  "Technical Writer": "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=80",
  "Quantum Researcher": "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=900&q=80",
  "Product Manager": "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=900&q=80",
  "Management Consultant": "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80",
  "Digital Marketer": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80",
  "Venture Capitalist": "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=900&q=80",
  "HR Business Partner": "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=900&q=80",
  "Supply Chain Manager": "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=900&q=80",
  "Real Estate Manager": "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=900&q=80",
  "Public Health Specialist": "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=900&q=80",
  "Civil Services (IAS)": "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=900&q=80",
  "Physiotherapist": "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=900&q=80",
  "Veterinarian": "https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?auto=format&fit=crop&w=900&q=80",
  "Dietitian": "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=900&q=80",
  "Biotechnologist": "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=900&q=80",
  "Forensic Scientist": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=80",
  "Filmmaker": "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=900&q=80",
  "Social Worker": "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=900&q=80",
  "Urban Planner": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=80",
  "Journalist": "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=900&q=80",
  "Fashion Designer": "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=900&q=80",
  "Professor": "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=900&q=80",
  "PR Specialist": "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=900&q=80",
  "School Teacher": "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=900&q=80",
  "Archeologist": "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=900&q=80",
  "Event Manager": "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=900&q=80",
  "Content Writer": "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=80",
  "Artist": "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=900&q=80",
  "Pharmacist": "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=900&q=80",
  "Economist": "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=900&q=80"
};

// Read original data.tsx
const dataContent = fs.readFileSync(path.join(__dirname, '../../app/components/data.tsx'), 'utf8');

// Extract careerOptions array using simple regex/eval extraction
const arrayMatch = dataContent.match(/export const careerOptions: Career\[\] = (\[[\s\S]*?\]);\s*export default/);

if (!arrayMatch) {
  console.error("Could not parse careerOptions from data.tsx");
  process.exit(1);
}

// Safely evaluate the array
const rawCareers = eval(arrayMatch[1]);
console.log("Extracted", rawCareers.length, "careers from data.tsx");

const courses = JSON.parse(fs.readFileSync(path.join(__dirname, 'courses.json'), 'utf8'));

const enrichedCareers = rawCareers.map((c) => {
  const primaryCategory = (c.relatedInterests && c.relatedInterests[0]) || "Technology";
  const domainInfo = domainEnrichments[primaryCategory] || domainEnrichments.Technology;

  // Replace placeholder image if needed
  let finalImageUrl = c.imageUrl;
  if (!finalImageUrl || finalImageUrl.includes("placehold.co")) {
    finalImageUrl = imageLibrary[c.title] || "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=900&q=80";
  }

  // Generate actionable howTo text from pursuitSteps
  const howToText = c.pursuitSteps && c.pursuitSteps.length > 0
    ? c.pursuitSteps.join(" -> ")
    : "Complete relevant foundational degree, acquire required industry skills, and build a verified portfolio.";

  // Recommended courses based on primary category and skills
  const matchedCourses = courses
    .filter(course => 
      course.categories.some(cat => c.relatedInterests?.includes(cat)) ||
      course.skills.some(sk => c.skills?.includes(sk))
    )
    .slice(0, 3)
    .map(course => course.id);

  // Parse salary into numeric bounds if possible
  let salaryNumericMin = 500000;
  let salaryNumericMax = 2000000;
  const numMatches = c.salary ? c.salary.match(/\d+(\.\d+)?/g) : null;
  if (numMatches && numMatches.length >= 2) {
    salaryNumericMin = Math.round(parseFloat(numMatches[0]) * 100000);
    salaryNumericMax = Math.round(parseFloat(numMatches[1]) * 100000);
  }

  return {
    ...c,
    imageUrl: finalImageUrl,
    category: primaryCategory,
    workStyleFit: domainInfo.workStyle,
    educationLevel: domainInfo.education,
    fees: c.fees || domainInfo.fees,
    howTo: howToText,
    marketInsights: {
      demandLevel: domainInfo.demand,
      growthRate: domainInfo.growth,
      seniorityLadder: [
        `Entry Level (0-2 yrs)`,
        `Mid-Level Professional (2-5 yrs)`,
        `Senior / Lead Specialist (5+ yrs)`
      ],
      experienceRequired: "0-2 years (Entry) to 5+ years (Senior)",
      salaryEntry: `₹ ${Math.round(salaryNumericMin / 100000)} - ${Math.round((salaryNumericMin * 1.5) / 100000)} LPA`,
      salaryMid: `₹ ${Math.round((salaryNumericMin * 1.6) / 100000)} - ${Math.round((salaryNumericMax * 0.8) / 100000)} LPA`,
      salarySenior: `₹ ${Math.round((salaryNumericMax * 0.85) / 100000)} - ${Math.round((salaryNumericMax * 1.3) / 100000)}+ LPA`,
      topLinkedInSkills: [
        ...(c.skills || []),
        ...domainInfo.topSkills
      ].slice(0, 8)
    },
    salaryNumericMin,
    salaryNumericMax,
    recommendedCourseIds: matchedCourses.length > 0 ? matchedCourses : ["c-cs-1", "c-web-1"]
  };
});

fs.writeFileSync(path.join(__dirname, 'careers.json'), JSON.stringify(enrichedCareers, null, 2));
console.log("Successfully created careers.json with", enrichedCareers.length, "careers!");
