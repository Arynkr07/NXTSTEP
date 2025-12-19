// Define the Career interface
export interface Career {
    id: number;
    title: string;
    description: string;
    pursuitSteps: string[];
    colleges: string;
    fees: string; // Used as "Average Salary / Earning Potential" in this context
    iconKey: 'brain' | 'laptop' | 'leaf' | 'default'; 
    relatedInterests: string[]; 
    skills: string[]; 
}

export const MOCK_CAREERS: Career[] = [
    // --- Technology & Engineering (15) ---
    { 
        id: 1, 
        title: "AI/Machine Learning Engineer", 
        description: "Develop intelligent algorithms and predictive models.", 
        pursuitSteps: ["B.Tech in CSE (aim for IITs/NITs)", "Master Python, TensorFlow & PyTorch", "Crack GATE for M.Tech in AI"], 
        colleges: "IIT Bombay, IIIT Hyderabad, IISc Bangalore", 
        fees: "₹ 8 - 25 LPA", 
        iconKey: 'brain',
        relatedInterests: ['Technology', 'Science'],
        skills: ['Coding (Python/JS)', 'Data Analysis']
    },
    { 
        id: 2, 
        title: "Freelance Content Creator", 
        description: "Location-independent work with creative freedom.", 
        pursuitSteps: ["Build portfolio on LinkedIn/Instagram", "Master SEO & Video Editing", "Find clients on Upwork/Freelancer"], 
        colleges: "N/A - Online Certifications (Udemy/Coursera)", 
        fees: "₹ 3 - 12 LPA (Variable)",
        iconKey: 'laptop',
        relatedInterests: ['Creative Arts', 'Technology'],
        skills: ['Writing/Copywriting', 'Communication']
    },
    { 
        id: 3, 
        title: "Sustainable Energy Analyst", 
        description: "Focus on green technology and climate solutions.", 
        pursuitSteps: ["B.Tech in Environmental/Electrical Eng.", "Certifications in Green Energy (BEE)", "Work with NGOs or Power Grid Corp"], 
        colleges: "IIT Delhi, TERI SAS New Delhi", 
        fees: "₹ 5 - 10 LPA",
        iconKey: 'leaf',
        relatedInterests: ['Science', 'Social Impact'],
        skills: ['Data Analysis', 'Communication']
    },
    { 
        id: 4, 
        title: "Full-Stack Web Developer", 
        description: "Build both the front-end and back-end of websites and apps.", 
        pursuitSteps: ["B.Tech or BCA/MCA", "Master MERN Stack (MongoDB, React, Node)", "Build projects for GitHub profile"], 
        colleges: "VIT, BITS Pilani, SRM, IITs", 
        fees: "₹ 4.5 - 14 LPA",
        iconKey: 'laptop',
        relatedInterests: ['Technology'],
        skills: ['Coding (Python/JS)', 'Design (UI/UX)']
    },
    { 
        id: 5, 
        title: "Cybersecurity Analyst", 
        description: "Protect computer systems and networks from threats.", 
        pursuitSteps: ["B.Tech CSE with Cyber Security elective", "CEH (Certified Ethical Hacker) Certification", "Participate in Bug Bounties"], 
        colleges: "IIT Kanpur, NFSU (Forensic Sciences Univ)", 
        fees: "₹ 6 - 15 LPA",
        iconKey: 'default',
        relatedInterests: ['Technology', 'Science'],
        skills: ['Data Analysis', 'Leadership']
    },
    { 
        id: 6, 
        title: "Data Scientist", 
        description: "Analyze large data sets to extract business insights.", 
        pursuitSteps: ["B.Stat or B.Tech in Data Science", "Master SQL, R, and Python", "Projects on Kaggle"], 
        colleges: "ISI Kolkata, IIT Madras (BS Data Science)", 
        fees: "₹ 7 - 18 LPA",
        iconKey: 'brain',
        relatedInterests: ['Technology', 'Science', 'Finance'],
        skills: ['Data Analysis', 'Coding (Python/JS)']
    },
    { 
        id: 7, 
        title: "UX/UI Designer", 
        description: "Design user-friendly and aesthetically pleasing digital interfaces.", 
        pursuitSteps: ["B.Des (Bachelor of Design)", "Crack UCEED/NID DAT exams", "Build portfolio on Behance/Dribbble"], 
        colleges: "NID Ahmedabad, IIT Bombay (IDC), NIFT", 
        fees: "₹ 5 - 12 LPA",
        iconKey: 'laptop',
        relatedInterests: ['Creative Arts', 'Technology'],
        skills: ['Design (UI/UX)', 'Communication']
    },
    { 
        id: 8, 
        title: "Cloud Architect (AWS/Azure)", 
        description: "Design and manage an organization's cloud computing strategy.", 
        pursuitSteps: ["Exp. in IT/System Admin", "AWS/Azure Solutions Architect Certification", "Master Networking & Linux"], 
        colleges: "N/A - Certification based", 
        fees: "₹ 12 - 30 LPA",
        iconKey: 'default',
        relatedInterests: ['Technology', 'Finance'],
        skills: ['Leadership', 'Coding (Python/JS)']
    },
    { 
        id: 9, 
        title: "Robotics Engineer", 
        description: "Design, build, and maintain robots and automation systems.", 
        pursuitSteps: ["B.Tech in Mechatronics/Robotics", "Learn ROS and Embedded C", "Projects with Arduino/Raspberry Pi"], 
        colleges: "IIT Kanpur, Manipal Institute of Technology", 
        fees: "₹ 5 - 12 LPA",
        iconKey: 'default',
        relatedInterests: ['Technology', 'Science'],
        skills: ['Coding (Python/JS)', 'Design (UI/UX)']
    },
    { 
        id: 10, 
        title: "DevOps Engineer", 
        description: "Bridge software development and IT operations.", 
        pursuitSteps: ["Strong Linux & Scripting basics", "Learn Docker, Kubernetes, Jenkins", "Work experience in Backend/SysAdmin"], 
        colleges: "N/A - Experience based", 
        fees: "₹ 7 - 20 LPA",
        iconKey: 'laptop',
        relatedInterests: ['Technology'],
        skills: ['Coding (Python/JS)', 'Data Analysis']
    },
    { 
        id: 11, 
        title: "Aerospace Engineer", 
        description: "Design aircraft, spacecraft, and missiles.", 
        pursuitSteps: ["Crack JEE Advanced for B.Tech Aerospace", "Internships at ISRO/DRDO/HAL", "Master Aerodynamics"], 
        colleges: "IIST Thiruvananthapuram, IIT Bombay/Madras", 
        fees: "₹ 6 - 15 LPA",
        iconKey: 'default',
        relatedInterests: ['Technology', 'Science'],
        skills: ['Data Analysis', 'Leadership']
    },
    { 
        id: 12, 
        title: "Biomedical Engineer", 
        description: "Apply engineering principles to medical problems.", 
        pursuitSteps: ["B.Tech in Biomedical Engineering", "Research internships in hospitals", "Master Medical Instrumentation"], 
        colleges: "VIT Vellore, Manipal, IIT Hyderabad", 
        fees: "₹ 4 - 9 LPA",
        iconKey: 'default',
        relatedInterests: ['Science', 'Healthcare'],
        skills: ['Data Analysis', 'Design (UI/UX)']
    },
    { 
        id: 13, 
        title: "Game Developer", 
        description: "Write code for video games and interactive entertainment.", 
        pursuitSteps: ["B.Tech CSE or B.Des in Game Design", "Master Unity (C#) or Unreal Engine (C++)", "Participate in Game Jams"], 
        colleges: "IIIT Hyderabad, Backstage Pass Institute", 
        fees: "₹ 4 - 10 LPA",
        iconKey: 'default',
        relatedInterests: ['Technology', 'Creative Arts'],
        skills: ['Coding (Python/JS)', 'Design (UI/UX)']
    },
    { 
        id: 14, 
        title: "Technical Writer", 
        description: "Create clear, concise documentation for complex products.", 
        pursuitSteps: ["BA in English or B.Tech", "Certification in Technical Writing", "Create portfolio of User Manuals/API Docs"], 
        colleges: "Symbiosis Pune, English & Foreign Languages Univ", 
        fees: "₹ 4 - 8 LPA",
        iconKey: 'default',
        relatedInterests: ['Technology', 'Creative Arts'],
        skills: ['Writing/Copywriting', 'Communication']
    },
    { 
        id: 15, 
        title: "Quantum Computing Researcher", 
        description: "Develop hardware and software for quantum systems.", 
        pursuitSteps: ["BS/MS in Physics (Quantum Mechanics)", "PhD is highly recommended", "Research Fellowship at TIFR/IISc"], 
        colleges: "IISc Bangalore, TIFR Mumbai", 
        fees: "₹ 8 - 18 LPA (Research Grants)",
        iconKey: 'brain',
        relatedInterests: ['Technology', 'Science'],
        skills: ['Coding (Python/JS)', 'Data Analysis']
    },
    
    // --- Business & Finance (10) ---
    { 
        id: 16, 
        title: "Chartered Accountant (CA)", 
        description: "Manage financial accounts, auditing, and taxation.", 
        pursuitSteps: ["Clear ICAI Foundation after Class 12", "Pass Intermediate & Final Groups", "3 Years Mandatory Articleship"], 
        colleges: "ICAI (Institute of Chartered Accountants of India)", 
        fees: "₹ 7 - 12 LPA (Fresher)",
        iconKey: 'default',
        relatedInterests: ['Finance'],
        skills: ['Data Analysis', 'Communication']
    },
    { 
        id: 17, 
        title: "Product Manager", 
        description: "Oversee the lifecycle and strategy of a product.", 
        pursuitSteps: ["B.Tech + MBA (Preferred)", "Crack CAT for top IIMs", "Understand UX and Market Research"], 
        colleges: "IIM Ahmedabad/Bangalore/Calcutta, ISB", 
        fees: "₹ 15 - 35 LPA",
        iconKey: 'default',
        relatedInterests: ['Technology', 'Finance'],
        skills: ['Leadership', 'Communication', 'Design (UI/UX)']
    },
    { 
        id: 18, 
        title: "Management Consultant", 
        description: "Solve complex business problems for major corporations.", 
        pursuitSteps: ["MBA from Tier-1 College", "Case Study Competitions", "Internships at BCG/McKinsey/Bain"], 
        colleges: "IIMs, FMS Delhi, XLRI Jamshedpur", 
        fees: "₹ 20 - 40 LPA",
        iconKey: 'default',
        relatedInterests: ['Finance', 'Social Impact'],
        skills: ['Leadership', 'Data Analysis', 'Communication']
    },
    { 
        id: 19, 
        title: "Digital Marketing Specialist", 
        description: "Drive sales and brand awareness through online channels.", 
        pursuitSteps: ["BBA/MBA in Marketing", "Google/Meta Ads Certifications", "Hands-on SEO/SEM experience"], 
        colleges: "MICA Ahmedabad, Symbiosis", 
        fees: "₹ 4 - 9 LPA",
        iconKey: 'default',
        relatedInterests: ['Creative Arts', 'Finance'],
        skills: ['Writing/Copywriting', 'Communication']
    },
    { 
        id: 20, 
        title: "Venture Capital Analyst", 
        description: "Identify and invest in high-growth startup companies.", 
        pursuitSteps: ["Finance/Tech Degree from Tier 1", "Experience in Startup Ecosystem", "Financial Modeling skills"], 
        colleges: "IIMs, IITs", 
        fees: "₹ 12 - 25 LPA",
        iconKey: 'default',
        relatedInterests: ['Finance', 'Technology'],
        skills: ['Data Analysis', 'Leadership']
    },
    { 
        id: 21, 
        title: "HR Business Partner", 
        description: "Align HR strategy with business objectives.", 
        pursuitSteps: ["MBA in HR", "Crack XAT/TISSNET", "Internships in Corporate HR"], 
        colleges: "XLRI Jamshedpur, TISS Mumbai, SCMHRD", 
        fees: "₹ 8 - 20 LPA",
        iconKey: 'default',
        relatedInterests: ['Social Impact', 'Finance'],
        skills: ['Communication', 'Leadership']
    },
    { 
        id: 22, 
        title: "Investment Banker", 
        description: "Facilitate mergers, acquisitions, and capital raising.", 
        pursuitSteps: ["CA, CFA, or MBA Finance", "Strong command over Excel/Valuation", "Networking in Finance sector"], 
        colleges: "IIMs, SP Jain, JBIMS", 
        fees: "₹ 15 - 40 LPA",
        iconKey: 'default',
        relatedInterests: ['Finance'],
        skills: ['Data Analysis', 'Leadership']
    },
    { 
        id: 23, 
        title: "Supply Chain Manager", 
        description: "Oversee and optimize the production flow.", 
        pursuitSteps: ["B.Tech or BBA + MBA in Operations", "Six Sigma Certification", "Internships in Logistics/Manufacturing"], 
        colleges: "NITIE Mumbai (IIM Mumbai), IITs", 
        fees: "₹ 10 - 22 LPA",
        iconKey: 'default',
        relatedInterests: ['Finance', 'Technology'],
        skills: ['Leadership', 'Data Analysis']
    },
    { 
        id: 24, 
        title: "Real Estate Manager", 
        description: "Acquire land, finance projects, and oversee construction.", 
        pursuitSteps: ["B.Arch or MBA in Infrastructure Mgmt", "Knowledge of RERA laws", "Sales & Negotiation skills"], 
        colleges: "NICMAR, CEPT University", 
        fees: "₹ 5 - 12 LPA",
        iconKey: 'default',
        relatedInterests: ['Finance'],
        skills: ['Leadership', 'Communication']
    },
    { 
        id: 25, 
        title: "Market Research Analyst", 
        description: "Study market conditions and consumer behavior.", 
        pursuitSteps: ["MBA Marketing or Masters in Economics", "Proficiency in SPSS/Tableau", "Analytical mindset"], 
        colleges: "DSE (Delhi School of Economics), IIMs", 
        fees: "₹ 6 - 12 LPA",
        iconKey: 'default',
        relatedInterests: ['Finance', 'Creative Arts'],
        skills: ['Data Analysis', 'Communication']
    },

    // --- Healthcare & Life Sciences (10) ---
    { 
        id: 26, 
        title: "Registered Nurse", 
        description: "Provide and coordinate patient care.", 
        pursuitSteps: ["B.Sc Nursing (4 Years)", "Appear for Entrance Exams (AIIMS/JIPMER)", "Register with State Nursing Council"], 
        colleges: "AIIMS, CMC Vellore, AFMC Pune", 
        fees: "₹ 3 - 6 LPA",
        iconKey: 'default',
        relatedInterests: ['Healthcare', 'Social Impact'],
        skills: ['Communication', 'Leadership']
    },
    { 
        id: 27, 
        title: "Doctor (MBBS)", 
        description: "Diagnose and treat medical conditions.", 
        pursuitSteps: ["Crack NEET UG with high rank", "5.5 Years MBBS + Internship", "NEET PG for Specialization"], 
        colleges: "AIIMS Delhi, MAMC, KGMU Lucknow", 
        fees: "₹ 8 - 15 LPA (Starting after PG)",
        iconKey: 'default',
        relatedInterests: ['Healthcare', 'Science'],
        skills: ['Communication', 'Leadership']
    },
    { 
        id: 28, 
        title: "Pharmaceutical Scientist", 
        description: "Research and develop new drugs and treatments.", 
        pursuitSteps: ["B.Pharm -> M.Pharm (GPAT Exam)", "PhD for R&D roles", "Work in Pharma MNCs"], 
        colleges: "NIPER Mohali, Jamia Hamdard, ICT Mumbai", 
        fees: "₹ 4 - 9 LPA",
        iconKey: 'default',
        relatedInterests: ['Science', 'Healthcare'],
        skills: ['Data Analysis', 'Writing/Copywriting']
    },
    { 
        id: 29, 
        title: "Physiotherapist", 
        description: "Help patients recover skills and movement.", 
        pursuitSteps: ["BPT (Bachelor of Physiotherapy)", "6 Months Internship", "Specialization (MPT)"], 
        colleges: "Christian Medical College, Apollo Hospitals", 
        fees: "₹ 3 - 6 LPA",
        iconKey: 'default',
        relatedInterests: ['Healthcare', 'Social Impact'],
        skills: ['Communication', 'Leadership']
    },
    { 
        id: 30, 
        title: "Clinical Psychologist", 
        description: "Assess and treat mental health disorders.", 
        pursuitSteps: ["BA/B.Sc Psychology", "MA/M.Sc Psychology", "M.Phil in Clinical Psychology (RCI recognized)"], 
        colleges: "NIMHANS Bangalore, TISS, Delhi University", 
        fees: "₹ 4 - 8 LPA",
        iconKey: 'default',
        relatedInterests: ['Science', 'Healthcare', 'Social Impact'],
        skills: ['Communication', 'Data Analysis']
    },
    { 
        id: 31, 
        title: "Public Health Specialist", 
        description: "Investigate disease patterns in populations.", 
        pursuitSteps: ["MBBS/BDS/Life Science degree", "Masters in Public Health (MPH)", "Work with WHO/UNICEF/Govt"], 
        colleges: "TISS, PHFI (Public Health Foundation of India)", 
        fees: "₹ 5 - 10 LPA",
        iconKey: 'default',
        relatedInterests: ['Science', 'Social Impact', 'Healthcare'],
        skills: ['Data Analysis', 'Communication']
    },
    { 
        id: 32, 
        title: "Veterinarian", 
        description: "Care for the health of animals.", 
        pursuitSteps: ["Crack NEET or State Vet Exam", "BVSc & AH degree (5.5 years)", "MVSc for specialization"], 
        colleges: "IVRI Bareilly, GADVASU Ludhiana", 
        fees: "₹ 4 - 8 LPA",
        iconKey: 'default',
        relatedInterests: ['Science', 'Healthcare'],
        skills: ['Leadership', 'Communication']
    },
    { 
        id: 33, 
        title: "Nutritionist/Dietitian", 
        description: "Advise on food and nutrition impacts on health.", 
        pursuitSteps: ["B.Sc Home Science/Nutrition", "M.Sc Food & Nutrition", "Registered Dietitian (RD) Exam"], 
        colleges: "Lady Irwin College Delhi, SNDT Mumbai", 
        fees: "₹ 3 - 7 LPA",
        iconKey: 'default',
        relatedInterests: ['Healthcare', 'Social Impact'],
        skills: ['Communication', 'Leadership']
    },
    { 
        id: 34, 
        title: "Biotechnologist", 
        description: "Use living systems to make products.", 
        pursuitSteps: ["B.Tech/B.Sc Biotechnology", "GATE for IITs/M.Tech", "Research projects in labs"], 
        colleges: "IIT Delhi, JNU, Vellore Institute of Technology", 
        fees: "₹ 4 - 8 LPA",
        iconKey: 'default',
        relatedInterests: ['Science', 'Healthcare'],
        skills: ['Data Analysis', 'Writing/Copywriting']
    },
    { 
        id: 35, 
        title: "Forensic Scientist", 
        description: "Analyze evidence for criminal investigations.", 
        pursuitSteps: ["B.Sc Forensic Science", "M.Sc Forensic Science", "Join CBI/State Forensic Labs"], 
        colleges: "NFSU Gandhinagar, Delhi University", 
        fees: "₹ 4 - 9 LPA",
        iconKey: 'default',
        relatedInterests: ['Creative Arts', 'Science', 'Healthcare'],
        skills: ['Design (UI/UX)', 'Writing/Copywriting']
    },

    // --- Arts, Media & Social Impact (15) ---
    { 
        id: 36, 
        title: "Filmmaker/Director", 
        description: "Conceptualize and oversee film production.", 
        pursuitSteps: ["Portfolio/Short Films", "Entrance Exam (JET)", "Film Direction Course"], 
        colleges: "FTII Pune, SRFTI Kolkata, Whistling Woods", 
        fees: "₹ 5 - 15 LPA (Project based)",
        iconKey: 'default',
        relatedInterests: ['Creative Arts'],
        skills: ['Leadership', 'Communication']
    },
    { 
        id: 37, 
        title: "Graphic Designer", 
        description: "Create visual concepts to communicate ideas.", 
        pursuitSteps: ["B.Des or Diploma in Design", "Portfolio creation (Behance)", "Internships at Agencies"], 
        colleges: "NID, NIFT, Srishti Manipal", 
        fees: "₹ 4 - 8 LPA",
        iconKey: 'default',
        relatedInterests: ['Creative Arts', 'Technology'],
        skills: ['Design (UI/UX)', 'Communication']
    },
    { 
        id: 38, 
        title: "Social Worker (MSW)", 
        description: "Help communities cope with challenges.", 
        pursuitSteps: ["BSW (Bachelor of Social Work)", "TISSNET for Masters (MSW)", "Fieldwork with NGOs"], 
        colleges: "TISS Mumbai, Delhi School of Social Work", 
        fees: "₹ 3.5 - 7 LPA",
        iconKey: 'default',
        relatedInterests: ['Social Impact', 'Healthcare'],
        skills: ['Communication', 'Leadership']
    },
    { 
        id: 39, 
        title: "Urban Planner", 
        description: "Design development of cities and towns.", 
        pursuitSteps: ["B.Plan (Bachelor of Planning)", "GATE for M.Plan", "Work with Smart City projects"], 
        colleges: "SPA Delhi/Bhopal/Vijayawada, CEPT", 
        fees: "₹ 5 - 10 LPA",
        iconKey: 'default',
        relatedInterests: ['Social Impact', 'Science'],
        skills: ['Data Analysis', 'Leadership']
    },
    { 
        id: 40, 
        title: "Civil Services Officer (IAS/IPS)", 
        description: "Serve the nation in administrative roles.", 
        pursuitSteps: ["Any Degree (Graduation)", "Crack UPSC Civil Services Exam (Prelims+Mains+Interview)", "LBSNAA Training"], 
        colleges: "N/A - Self Study/Coaching", 
        fees: "₹ 7 - 10 LPA + Govt Perks",
        iconKey: 'default',
        relatedInterests: ['Social Impact', 'Finance'],
        skills: ['Leadership', 'Writing/Copywriting', 'Communication']
    },
    { 
        id: 41, 
        title: "Journalist", 
        description: "Research, write, and report news stories.", 
        pursuitSteps: ["BJMC (Bachelor of Journalism)", "Entrance for PG Diploma", "Internships at Media Houses"], 
        colleges: "IIMC Delhi, Asian College of Journalism, Jamia", 
        fees: "₹ 3 - 7 LPA",
        iconKey: 'default',
        relatedInterests: ['Creative Arts', 'Social Impact'],
        skills: ['Writing/Copywriting', 'Communication']
    },
    { 
        id: 42, 
        title: "Fashion Designer", 
        description: "Design clothing and accessories.", 
        pursuitSteps: ["Crack NIFT Entrance Exam", "B.Des in Fashion Design", "Graduation Show/Portfolio"], 
        colleges: "NIFT Delhi/Mumbai, Pearl Academy", 
        fees: "₹ 4 - 10 LPA",
        iconKey: 'default',
        relatedInterests: ['Creative Arts', 'Science'],
        skills: ['Writing/Copywriting', 'Leadership']
    },
    { 
        id: 43, 
        title: "Professor/Lecturer", 
        description: "Teach students at college/university level.", 
        pursuitSteps: ["Masters in Subject", "Crack UGC-NET (JRF for PhD)", "PhD is mandatory for University roles"], 
        colleges: "Central Universities, IITs, DU", 
        fees: "₹ 6 - 12 LPA",
        iconKey: 'default',
        relatedInterests: ['Social Impact', 'Technology'],
        skills: ['Communication', 'Data Analysis']
    },
    { 
        id: 44, 
        title: "Public Relations (PR) Specialist", 
        description: "Manage a company's public image.", 
        pursuitSteps: ["Mass Comm/PR Degree", "Networking skills", "Crisis Management training"], 
        colleges: "Xavier Institute of Comm (XIC), IIMC", 
        fees: "₹ 4 - 9 LPA",
        iconKey: 'default',
        relatedInterests: ['Finance', 'Creative Arts'],
        skills: ['Communication', 'Writing/Copywriting', 'Leadership']
    },
    { 
        id: 45, 
        title: "School Teacher", 
        description: "Educate students in a specific subject area.", 
        pursuitSteps: ["B.Ed (Bachelor of Education)", "Crack CTET/STET exams", "Subject specialization"], 
        colleges: "RIE (Regional Inst. of Education), DU", 
        fees: "₹ 3 - 8 LPA",
        iconKey: 'default',
        relatedInterests: ['Social Impact', 'Science', 'Creative Arts'],
        skills: ['Communication', 'Leadership']
    },
    { 
        id: 46, 
        title: "Lawyer (Advocate)", 
        description: "Advise and represent clients in legal matters.", 
        pursuitSteps: ["Crack CLAT for NLU", "5-Year BA LLB", "Enrol with Bar Council of India"], 
        colleges: "NLSIU Bangalore, NALSAR, NLU Delhi", 
        fees: "₹ 6 - 15 LPA (Firms)",
        iconKey: 'default',
        relatedInterests: ['Finance', 'Social Impact'],
        skills: ['Writing/Copywriting', 'Leadership']
    },
    { 
        id: 47, 
        title: "Interior Designer", 
        description: "Plan and coordinate indoor spaces.", 
        pursuitSteps: ["B.Des or Diploma in Interior Design", "Master AutoCAD/SketchUp", "Portfolio"], 
        colleges: "CEPT Ahmedabad, Arch Academy", 
        fees: "₹ 3 - 8 LPA",
        iconKey: 'default',
        relatedInterests: ['Creative Arts'],
        skills: ['Design (UI/UX)', 'Communication']
    },
    { 
        id: 48, 
        title: "Archeologist", 
        description: "Study human history through excavation.", 
        pursuitSteps: ["MA in Ancient History/Archaeology", "PhD", "Work with ASI (Archaeological Survey of India)"], 
        colleges: "Deccan College Pune, BHU Varanasi", 
        fees: "₹ 4 - 8 LPA",
        iconKey: 'default',
        relatedInterests: ['Science', 'Creative Arts'],
        skills: ['Data Analysis', 'Writing/Copywriting']
    },
    { 
        id: 49, 
        title: "Event Manager", 
        description: "Plan and organize large-scale events.", 
        pursuitSteps: ["Diploma/Degree in Event Mgmt", "Vendor Management skills", "Internships at Event Firms"], 
        colleges: "NIEM (National Institute of Event Mgmt)", 
        fees: "₹ 3 - 7 LPA",
        iconKey: 'default',
        relatedInterests: ['Social Impact', 'Creative Arts'],
        skills: ['Communication', 'Writing/Copywriting']
    },
    { 
        id: 50, 
        title: "Chef / Culinary Expert", 
        description: "Prepare food and manage kitchen operations.", 
        pursuitSteps: ["B.Sc in Culinary Arts/Hotel Mgmt", "Industrial Training in 5-Star Hotels", "Specialization"], 
        colleges: "IHM Pusa, IHM Mumbai (NCHMCT JEE Exam)", 
        fees: "₹ 3 - 8 LPA",
        iconKey: 'default',
        relatedInterests: ['Social Impact', 'Science', 'Healthcare', 'Finance'],
        skills: ['Writing/Copywriting', 'Communication', 'Leadership']
    },
];

export default MOCK_CAREERS;