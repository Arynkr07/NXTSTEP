// mockData.tsx

// Define the Career interface (UPDATED with filter fields)
export interface Career {
    id: number;
    title: string;
    description: string;
    pursuitSteps: string[];
    colleges: string;
    fees: string;
    iconKey: 'brain' | 'laptop' | 'leaf' | 'default'; // For CareerCard
    
    // 🌟 NEW FIELDS FOR FILTERING 🌟
    relatedInterests: string[]; // Matches interests from ChatbotPanel
    skills: string[]; // Matches skills from ChatbotPanel
}

// Mock Data Array (All 50 entries now contain filtering data)
export const MOCK_CAREERS: Career[] = [
    // --- Technology & Engineering (15) ---
    { 
        id: 1, 
        title: "AI/Machine Learning Engineer", 
        description: "Develop intelligent algorithms and predictive models.", 
        pursuitSteps: ["Master's in CS/Data Science", "Focus on Python/TensorFlow", "Publish research papers"], 
        colleges: "MIT, Stanford, UIUC", 
        fees: "$40-70k/year", 
        iconKey: 'brain',
        relatedInterests: ['Technology', 'Science'],
        skills: ['Coding (Python/JS)', 'Data Analysis']
    },
    { 
        id: 2, 
        title: "Digital Nomad/Freelance Creator", 
        description: "Location-independent work with creative freedom.", 
        pursuitSteps: ["Build a strong online portfolio", "Master one high-demand skill (e.g., SEO)", "Network remotely"], 
        colleges: "N/A - Focus on online courses", 
        fees: "$5-15k total (for courses)",
        iconKey: 'laptop',
        relatedInterests: ['Creative Arts', 'Technology'],
        skills: ['Writing/Copywriting', 'Communication']
    },
    { 
        id: 3, 
        title: "Sustainable Energy Analyst", 
        description: "Focus on green technology and climate solutions.", 
        pursuitSteps: ["B.S. in Environmental Engineering", "Gain experience with energy modeling", "Get certified in energy auditing"], 
        colleges: "UC Berkeley, Georgia Tech", 
        fees: "$30-60k/year",
        iconKey: 'leaf',
        relatedInterests: ['Science', 'Social Impact'],
        skills: ['Data Analysis', 'Communication']
    },
    { 
        id: 4, 
        title: "Full-Stack Web Developer", 
        description: "Build both the front-end and back-end of websites and apps.", 
        pursuitSteps: ["Bootcamp or B.S. in CS", "Master JavaScript, React, Node.js", "Build and deploy 3 portfolio projects"], 
        colleges: "General universities, Tech schools", 
        fees: "$20-40k/year",
        iconKey: 'laptop',
        relatedInterests: ['Technology'],
        skills: ['Coding (Python/JS)', 'Design (UI/UX)']
    },
    { 
        id: 5, 
        title: "Cybersecurity Analyst", 
        description: "Protect computer systems and networks from threats.", 
        pursuitSteps: ["B.S. in Cyber Security", "Obtain CompTIA Security+ certification", "Practice ethical hacking"], 
        colleges: "Purdue, Carnegie Mellon", 
        fees: "$35-65k/year",
        iconKey: 'default',
        relatedInterests: ['Technology', 'Science'],
        skills: ['Data Analysis', 'Leadership']
    },
    { 
        id: 6, 
        title: "Data Scientist", 
        description: "Analyze large data sets to extract business insights.", 
        pursuitSteps: ["Master's in Statistics/Data Science", "Proficiency in Python and R", "Develop visualization skills"], 
        colleges: "Johns Hopkins, Columbia", 
        fees: "$40-75k/year",
        iconKey: 'brain',
        relatedInterests: ['Technology', 'Science', 'Finance'],
        skills: ['Data Analysis', 'Coding (Python/JS)']
    },
    { 
        id: 7, 
        title: "UX/UI Designer", 
        description: "Design user-friendly and aesthetically pleasing digital interfaces.", 
        pursuitSteps: ["Bachelor's in Design or HCI", "Master Figma/Sketch/Adobe XD", "Build case studies for portfolio"], 
        colleges: "Savannah College of Art and Design, Pratt", 
        fees: "$30-50k/year",
        iconKey: 'laptop',
        relatedInterests: ['Creative Arts', 'Technology'],
        skills: ['Design (UI/UX)', 'Communication']
    },
    { 
        id: 8, 
        title: "Cloud Architect (AWS/Azure)", 
        description: "Design and manage an organization's cloud computing strategy.", 
        pursuitSteps: ["10+ years IT experience", "Obtain top-tier cloud certifications (e.g., AWS SA Pro)", "Master networking principles"], 
        colleges: "N/A - Certifications are key", 
        fees: "$15-25k (Certifications)",
        iconKey: 'default',
        relatedInterests: ['Technology', 'Finance'],
        skills: ['Leadership', 'Coding (Python/JS)']
    },
    { 
        id: 9, 
        title: "Robotics Engineer", 
        description: "Design, build, and maintain robots and automation systems.", 
        pursuitSteps: ["B.S. in Electrical or Mechanical Engineering", "Master embedded systems and C++", "Gain factory/industrial experience"], 
        colleges: "Georgia Tech, Michigan", 
        fees: "$30-60k/year",
        iconKey: 'default',
        relatedInterests: ['Technology', 'Science'],
        skills: ['Coding (Python/JS)', 'Design (UI/UX)']
    },
    { 
        id: 10, 
        title: "DevOps Engineer", 
        description: "Bridge software development and IT operations.", 
        pursuitSteps: ["Strong coding and system administration skills", "Master Docker, Kubernetes, and Jenkins", "Obtain DevOps certifications"], 
        colleges: "N/A - Experience based", 
        fees: "$10-20k (Certifications)",
        iconKey: 'laptop',
        relatedInterests: ['Technology'],
        skills: ['Coding (Python/JS)', 'Data Analysis']
    },
    { 
        id: 11, 
        title: "Aerospace Engineer", 
        description: "Design aircraft, spacecraft, and missiles.", 
        pursuitSteps: ["B.S. in Aerospace Engineering", "Advanced calculus and physics required", "Work for NASA or defense contractors"], 
        colleges: "Purdue, MIT", 
        fees: "$40-70k/year",
        iconKey: 'default',
        relatedInterests: ['Technology', 'Science'],
        skills: ['Data Analysis', 'Leadership']
    },
    { 
        id: 12, 
        title: "Biomedical Engineer", 
        description: "Apply engineering principles to medical problems.", 
        pursuitSteps: ["B.S. in Biomedical Engineering", "Strong background in biology and mechanics", "Clinical trials or medical device experience"], 
        colleges: "Duke, Johns Hopkins", 
        fees: "$35-65k/year",
        iconKey: 'default',
        relatedInterests: ['Science', 'Healthcare'],
        skills: ['Data Analysis', 'Design (UI/UX)']
    },
    { 
        id: 13, 
        title: "Game Developer", 
        description: "Write code for video games and interactive entertainment.", 
        pursuitSteps: ["B.A. in Game Development or CS", "Master C++ or C# (Unity/Unreal)", "Participate in game jams"], 
        colleges: "DigiPen, Full Sail University", 
        fees: "$30-50k/year",
        iconKey: 'default',
        relatedInterests: ['Technology', 'Creative Arts'],
        skills: ['Coding (Python/JS)', 'Design (UI/UX)']
    },
    { 
        id: 14, 
        title: "Technical Writer", 
        description: "Create clear, concise documentation for complex products.", 
        pursuitSteps: ["B.A. in English/Communications", "Technical background is a plus", "Focus on Git and Markdown"], 
        colleges: "General universities", 
        fees: "$20-35k/year",
        iconKey: 'default',
        relatedInterests: ['Technology', 'Creative Arts'],
        skills: ['Writing/Copywriting', 'Communication']
    },
    { 
        id: 15, 
        title: "Quantum Computing Engineer", 
        description: "Develop hardware and software for quantum systems.", 
        pursuitSteps: ["PhD in Physics or Quantum Engineering", "Deep understanding of quantum mechanics", "Work at national labs or IBM"], 
        colleges: "MIT, Caltech", 
        fees: "$50-80k/year",
        iconKey: 'brain',
        relatedInterests: ['Technology', 'Science'],
        skills: ['Coding (Python/JS)', 'Data Analysis']
    },
    
    // --- Business & Finance (10) ---
    { 
        id: 16, 
        title: "Financial Analyst", 
        description: "Guide businesses on investments and budget planning.", 
        pursuitSteps: ["B.S. in Finance/Economics", "Obtain CFA (Chartered Financial Analyst)", "Master Excel and financial modeling"], 
        colleges: "Wharton, NYU Stern", 
        fees: "$35-60k/year",
        iconKey: 'default',
        relatedInterests: ['Finance'],
        skills: ['Data Analysis', 'Communication']
    },
    { 
        id: 17, 
        title: "Product Manager", 
        description: "Oversee the lifecycle and strategy of a product.", 
        pursuitSteps: ["MBA or Technical background", "Experience in UX/Dev", "Master market analysis"], 
        colleges: "Harvard, Stanford GSB", 
        fees: "$45-80k/year",
        iconKey: 'default',
        relatedInterests: ['Technology', 'Finance'],
        skills: ['Leadership', 'Communication', 'Design (UI/UX)']
    },
    { 
        id: 18, 
        title: "Management Consultant", 
        description: "Solve complex business problems for major corporations.", 
        pursuitSteps: ["MBA required for top firms (MBB)", "Master case interview prep", "Exceptional communication skills"], 
        colleges: "Harvard, Stanford, INSEAD", 
        fees: "$50-90k/year",
        iconKey: 'default',
        relatedInterests: ['Finance', 'Social Impact'],
        skills: ['Leadership', 'Data Analysis', 'Communication']
    },
    { 
        id: 19, 
        title: "Digital Marketing Specialist", 
        description: "Drive sales and brand awareness through online channels.", 
        pursuitSteps: ["B.A. in Marketing", "Master Google Ads/SEO/PPC", "Obtain HubSpot certifications"], 
        colleges: "General universities", 
        fees: "$20-40k/year",
        iconKey: 'default',
        relatedInterests: ['Creative Arts', 'Finance'],
        skills: ['Writing/Copywriting', 'Communication']
    },
    { 
        id: 20, 
        title: "Venture Capital Analyst", 
        description: "Identify and invest in high-growth startup companies.", 
        pursuitSteps: ["B.S. in Finance/CS", "Strong network in the startup ecosystem", "Deep understanding of technology trends"], 
        colleges: "Top business schools", 
        fees: "$40-70k/year",
        iconKey: 'default',
        relatedInterests: ['Finance', 'Technology'],
        skills: ['Data Analysis', 'Leadership']
    },
    { 
        id: 21, 
        title: "HR Business Partner (HRBP)", 
        description: "Align HR strategy with business objectives.", 
        pursuitSteps: ["B.A. in Human Resources", "Obtain PHR/SHRM certification", "Strong conflict resolution skills"], 
        colleges: "General universities", 
        fees: "$20-40k/year",
        iconKey: 'default',
        relatedInterests: ['Social Impact', 'Finance'],
        skills: ['Communication', 'Leadership']
    },
    { 
        id: 22, 
        title: "Investment Banker", 
        description: "Facilitate mergers, acquisitions, and capital raising.", 
        pursuitSteps: ["Top university B.S. in Finance/Accounting", "Extremely long hours required", "Exceptional financial modeling skills"], 
        colleges: "Wharton, Columbia, Yale", 
        fees: "$45-80k/year",
        iconKey: 'default',
        relatedInterests: ['Finance'],
        skills: ['Data Analysis', 'Leadership']
    },
    { 
        id: 23, 
        title: "Supply Chain Manager", 
        description: "Oversee and optimize the production flow from supplier to customer.", 
        pursuitSteps: ["B.S. in Supply Chain Management", "Master logistics software (SAP, Oracle)", "Obtain CSCP certification"], 
        colleges: "MIT, Michigan State", 
        fees: "$30-55k/year",
        iconKey: 'default',
        relatedInterests: ['Finance', 'Technology'],
        skills: ['Leadership', 'Data Analysis']
    },
    { 
        id: 24, 
        title: "Real Estate Developer", 
        description: "Acquire land, finance projects, and oversee construction.", 
        pursuitSteps: ["Degree in Finance or Architecture", "Deep knowledge of local zoning laws", "Strong negotiation skills"], 
        colleges: "General universities", 
        fees: "$20-45k/year",
        iconKey: 'default',
        relatedInterests: ['Finance'],
        skills: ['Leadership', 'Communication']
    },
    { 
        id: 25, 
        title: "Market Research Analyst", 
        description: "Study market conditions and consumer behavior.", 
        pursuitSteps: ["B.S. in Marketing or Statistics", "Proficiency in statistical software (SPSS)", "Strong presentation skills"], 
        colleges: "General universities", 
        fees: "$25-40k/year",
        iconKey: 'default',
        relatedInterests: ['Finance', 'Creative Arts'],
        skills: ['Data Analysis', 'Communication']
    },

    // --- Healthcare & Life Sciences (10) ---
    { 
        id: 26, 
        title: "Registered Nurse (RN)", 
        description: "Provide and coordinate patient care.", 
        pursuitSteps: ["BSN (Bachelor of Science in Nursing)", "Pass the NCLEX exam", "Specialization (ICU, ER, etc.)"], 
        colleges: "Accredited nursing programs", 
        fees: "$20-40k/year",
        iconKey: 'default',
        relatedInterests: ['Healthcare', 'Social Impact'],
        skills: ['Communication', 'Leadership']
    },
    { 
        id: 27, 
        title: "Physician Assistant (PA)", 
        description: "Practice medicine under the direction of a physician.", 
        pursuitSteps: ["Master's in Physician Assistant Studies (MPAS)", "Obtain clinical experience (PCE)", "Pass the PANCE exam"], 
        colleges: "Accredited PA schools", 
        fees: "$40-70k/year",
        iconKey: 'default',
        relatedInterests: ['Healthcare', 'Science'],
        skills: ['Communication', 'Leadership']
    },
    { 
        id: 28, 
        title: "Pharmaceutical Scientist", 
        description: "Research and develop new drugs and treatments.", 
        pursuitSteps: ["PhD in Chemistry or Pharmacology", "Post-doctoral research is common", "Work in R&D labs"], 
        colleges: "Top research universities", 
        fees: "$40-75k/year",
        iconKey: 'default',
        relatedInterests: ['Science', 'Healthcare'],
        skills: ['Data Analysis', 'Writing/Copywriting']
    },
    { 
        id: 29, 
        title: "Occupational Therapist (OT)", 
        description: "Help patients recover skills needed for daily living.", 
        pursuitSteps: ["Master's in Occupational Therapy (MOT)", "Pass the NBCOT exam", "Clinical rotations"], 
        colleges: "Accredited OT schools", 
        fees: "$30-55k/year",
        iconKey: 'default',
        relatedInterests: ['Healthcare', 'Social Impact'],
        skills: ['Communication', 'Leadership']
    },
    { 
        id: 30, 
        title: "Genetic Counselor", 
        description: "Assess and counsel individuals on genetic disorders.", 
        pursuitSteps: ["Master's in Genetic Counseling", "Pass board certification", "Strong empathy and communication skills"], 
        colleges: "Accredited programs", 
        fees: "$35-60k/year",
        iconKey: 'default',
        relatedInterests: ['Science', 'Healthcare', 'Social Impact'],
        skills: ['Communication', 'Data Analysis']
    },
    { 
        id: 31, 
        title: "Epidemiologist", 
        description: "Investigate disease patterns and causes in populations.", 
        pursuitSteps: ["Master's in Public Health (MPH)", "Strong statistics background", "Work for CDC/WHO"], 
        colleges: "Harvard, Johns Hopkins (Public Health)", 
        fees: "$30-50k/year",
        iconKey: 'default',
        relatedInterests: ['Science', 'Social Impact', 'Healthcare'],
        skills: ['Data Analysis', 'Communication']
    },
    { 
        id: 32, 
        title: "Veterinarian (DVM)", 
        description: "Care for the health of animals.", 
        pursuitSteps: ["Doctor of Veterinary Medicine (DVM)", "Required clinical hours", "Pass the national licensing exam"], 
        colleges: "Accredited vet schools", 
        fees: "$40-80k/year",
        iconKey: 'default',
        relatedInterests: ['Science', 'Healthcare'],
        skills: ['Leadership', 'Communication']
    },
    { 
        id: 33, 
        title: "Physical Therapist (DPT)", 
        description: "Help injured people improve movement and manage pain.", 
        pursuitSteps: ["Doctor of Physical Therapy (DPT)", "Clinical placements", "Pass the licensure exam"], 
        colleges: "Accredited DPT programs", 
        fees: "$35-65k/year",
        iconKey: 'default',
        relatedInterests: ['Healthcare', 'Social Impact'],
        skills: ['Communication', 'Leadership']
    },
    { 
        id: 34, 
        title: "Clinical Researcher", 
        description: "Design and manage trials for medical advancements.", 
        pursuitSteps: ["Master's in Clinical Research", "Knowledge of FDA/EMA regulations", "Strong organizational skills"], 
        colleges: "Research universities", 
        fees: "$30-50k/year",
        iconKey: 'default',
        relatedInterests: ['Science', 'Healthcare'],
        skills: ['Data Analysis', 'Writing/Copywriting']
    },
    { 
        id: 35, 
        title: "Medical Illustrator", 
        description: "Create visual materials for medical science.", 
        pursuitSteps: ["Master's in Medical Illustration", "Exceptional artistic and scientific skills", "Build specialized portfolio"], 
        colleges: "Johns Hopkins, RIT", 
        fees: "$30-50k/year",
        iconKey: 'default',
        relatedInterests: ['Creative Arts', 'Science', 'Healthcare'],
        skills: ['Design (UI/UX)', 'Writing/Copywriting']
    },

    // --- Arts, Media & Social Impact (15) ---
    { 
        id: 36, 
        title: "Filmmaker/Director", 
        description: "Conceptualize and oversee the creative aspects of film production.", 
        pursuitSteps: ["Film school (optional but helpful)", "Start making short films", "Network with industry professionals"], 
        colleges: "USC, NYU Tisch", 
        fees: "$40-70k/year",
        iconKey: 'default',
        relatedInterests: ['Creative Arts'],
        skills: ['Leadership', 'Communication']
    },
    { 
        id: 37, 
        title: "Graphic Designer", 
        description: "Create visual concepts to communicate ideas that inspire and inform.", 
        pursuitSteps: ["B.A. in Graphic Design", "Master Adobe Creative Suite", "Build a diverse client portfolio"], 
        colleges: "Rhode Island School of Design (RISD)", 
        fees: "$30-50k/year",
        iconKey: 'default',
        relatedInterests: ['Creative Arts', 'Technology'],
        skills: ['Design (UI/UX)', 'Communication']
    },
    { 
        id: 38, 
        title: "Social Worker (LCSW)", 
        description: "Help individuals and families cope with personal challenges.", 
        pursuitSteps: ["Master's in Social Work (MSW)", "Obtain LCSW licensure", "Clinical experience"], 
        colleges: "Accredited MSW programs", 
        fees: "$25-45k/year",
        iconKey: 'default',
        relatedInterests: ['Social Impact', 'Healthcare'],
        skills: ['Communication', 'Leadership']
    },
    { 
        id: 39, 
        title: "Urban Planner", 
        description: "Design and manage the development of cities and towns.", 
        pursuitSteps: ["Master's in Urban Planning", "Knowledge of zoning laws and sustainability", "GIS proficiency"], 
        colleges: "MIT, Columbia", 
        fees: "$30-55k/year",
        iconKey: 'default',
        relatedInterests: ['Social Impact', 'Science'],
        skills: ['Data Analysis', 'Leadership']
    },
    { 
        id: 40, 
        title: "Non-Profit Manager", 
        description: "Oversee operations, fundraising, and mission fulfillment for a charity.", 
        pursuitSteps: ["Master's in Public Administration (MPA) or MBA", "Strong grant writing skills", "Demonstrated passion for the cause"], 
        colleges: "General universities", 
        fees: "$20-40k/year",
        iconKey: 'default',
        relatedInterests: ['Social Impact', 'Finance'],
        skills: ['Leadership', 'Writing/Copywriting', 'Communication']
    },
    { 
        id: 41, 
        title: "Journalist/Investigative Reporter", 
        description: "Research, write, and report news stories.", 
        pursuitSteps: ["B.A. in Journalism", "Master multimedia tools and ethics", "Build a strong body of published work"], 
        colleges: "Columbia Journalism School", 
        fees: "$30-50k/year",
        iconKey: 'default',
        relatedInterests: ['Creative Arts', 'Social Impact'],
        skills: ['Writing/Copywriting', 'Communication']
    },
    { 
        id: 42, 
        title: "Museum Curator", 
        description: "Manage a collection of artifacts or artworks in a museum.", 
        pursuitSteps: ["Master's or PhD in Art History/Archaeology", "Grant writing experience", "Fluency in relevant foreign languages"], 
        colleges: "Harvard, NYU", 
        fees: "$35-60k/year",
        iconKey: 'default',
        relatedInterests: ['Creative Arts', 'Science'],
        skills: ['Writing/Copywriting', 'Leadership']
    },
    { 
        id: 43, 
        title: "Librarian (MLS)", 
        description: "Manage information resources and community programs.", 
        pursuitSteps: ["Master's in Library Science (MLS)", "Technology and digital literacy skills", "Experience in public or academic libraries"], 
        colleges: "Accredited MLS programs", 
        fees: "$25-40k/year",
        iconKey: 'default',
        relatedInterests: ['Social Impact', 'Technology'],
        skills: ['Communication', 'Data Analysis']
    },
    { 
        id: 44, 
        title: "Public Relations Specialist", 
        description: "Manage a company's public image and media relationship.", 
        pursuitSteps: ["B.A. in Communications/PR", "Strong writing and crisis management skills", "Network with media contacts"], 
        colleges: "General universities", 
        fees: "$30-50k/year",
        iconKey: 'default',
        relatedInterests: ['Finance', 'Creative Arts'],
        skills: ['Communication', 'Writing/Copywriting', 'Leadership']
    },
    { 
        id: 45, 
        title: "High School Teacher", 
        description: "Educate students in a specific subject area.", 
        pursuitSteps: ["B.A. in Subject + Education Certification", "Pass state licensing exams", "Classroom management training"], 
        colleges: "State university education programs", 
        fees: "$20-40k/year",
        iconKey: 'default',
        relatedInterests: ['Social Impact', 'Science', 'Creative Arts'],
        skills: ['Communication', 'Leadership']
    },
    { 
        id: 46, 
        title: "Attorney (Lawyer)", 
        description: "Advise and represent clients in legal matters.", 
        pursuitSteps: ["J.D. degree", "Pass the State Bar Exam", "Clinical or specialized practice experience"], 
        colleges: "Yale, Harvard, Stanford Law", 
        fees: "$50-90k/year",
        iconKey: 'default',
        relatedInterests: ['Finance', 'Social Impact'],
        skills: ['Writing/Copywriting', 'Leadership']
    },
    { 
        id: 47, 
        title: "Interior Designer", 
        description: "Plan and coordinate the aesthetic and functional elements of indoor spaces.", 
        pursuitSteps: ["B.A. in Interior Design", "Master CAD and 3D modeling software", "Build client portfolio"], 
        colleges: "Pratt, Parsons School of Design", 
        fees: "$30-50k/year",
        iconKey: 'default',
        relatedInterests: ['Creative Arts'],
        skills: ['Design (UI/UX)', 'Communication']
    },
    { 
        id: 48, 
        title: "Archeologist", 
        description: "Study human history and prehistory through excavation.", 
        pursuitSteps: ["Master's or PhD in Archaeology", "Field school experience required", "Fluency in ancient languages is a plus"], 
        colleges: "UCL, Cambridge, Stanford", 
        fees: "$35-60k/year",
        iconKey: 'default',
        relatedInterests: ['Science', 'Creative Arts'],
        skills: ['Data Analysis', 'Writing/Copywriting']
    },
    { 
        id: 49, 
        title: "Translator/Interpreter", 
        description: "Convert communication from one language to another.", 
        pursuitSteps: ["Fluency in 2+ languages", "Master cultural nuances", "Certification in specialized fields (legal, medical)"], 
        colleges: "Monterey Institute, specialized programs", 
        fees: "$20-40k/year",
        iconKey: 'default',
        relatedInterests: ['Social Impact', 'Creative Arts'],
        skills: ['Communication', 'Writing/Copywriting']
    },
    { 
        id: 50, 
        title: "Ethicist (Corporate/Bio)", 
        description: "Study moral principles and decision-making in complex fields.", 
        pursuitSteps: ["PhD in Philosophy or Bioethics", "Strong critical thinking skills", "Consulting experience"], 
        colleges: "General universities", 
        fees: "$40-70k/year",
        iconKey: 'default',
        relatedInterests: ['Social Impact', 'Science', 'Healthcare', 'Finance'],
        skills: ['Writing/Copywriting', 'Communication', 'Leadership']
    },
];

export default MOCK_CAREERS;