"use client";

// 1. THE MASTER INTERFACE
export interface Career {
    [x: string]: ReactNode;
    id: number;
    title: string;
    description: string;
    pursuitSteps: string[];
    colleges: string;
    salary: string; 
    link: string;
    imageUrl: string;
    iconKey: 'brain' | 'laptop' | 'leaf' | 'default'; 
    relatedInterests: string[]; 
    skills: string[]; 
}

// 2. THE COMPLETE DATASET (50 CAREERS)
export const careerOptions: Career[] = [
    { 
        id: 1, 
        title: "AI/Machine Learning Engineer", 
        description: "Develop intelligent algorithms and predictive models.", 
        pursuitSteps: ["B.Tech in CSE", "Master Python, TensorFlow & PyTorch", "Crack GATE for M.Tech in AI"], 
        colleges: "IIT Bombay, IIIT Hyderabad, IISc Bangalore", 
        salary: "₹ 8 - 25 LPA", 
        link: "https://www.google.com/search?q=ai+engineer+career",
        imageUrl: "https://images.ctfassets.net/wp1lcwdav1p1/1nYXE4h20tXKjNPrtHwcxs/e13c6a82adb77d21c14361d7145b7369/GettyImages-1363841531_Java_vs_C__.jpg",
        iconKey: 'brain',
        relatedInterests: ['Technology', 'Science'],
        skills: ['Coding', 'Data Analysis']
    },
    { 
        id: 2, 
        title: "Doctor (MBBS)", 
        description: "Diagnose and treat medical conditions.", 
        pursuitSteps: ["Crack NEET UG", "5.5 Years MBBS + Internship", "NEET PG for Specialization"], 
        colleges: "AIIMS Delhi, MAMC, KGMU Lucknow", 
        salary: "₹ 8 - 30 LPA", 
        link: "https://www.google.com/search?q=doctor+career",
        imageUrl: "https://hips.hearstapps.com/hmg-prod/images/portrait-of-a-happy-young-doctor-in-his-clinic-royalty-free-image-1661432441.jpg",
        iconKey: 'default',
        relatedInterests: ['Healthcare', 'Science'],
        skills: ['Communication', 'Leadership']
    },
    { 
        id: 3, 
        title: "Freelance Content Creator", 
        description: "Location-independent work with creative freedom.", 
        pursuitSteps: ["Build portfolio on social media", "Master SEO & Video Editing", "Find clients on Upwork"], 
        colleges: "N/A - Online Certifications", 
        salary: "₹ 3 - 12 LPA",
        link: "https://www.google.com/search?q=content+writer+career",
        imageUrl: "https://www.simplilearn.com/ice9/free_resources_article_thumb/How_To_Become_A_Content_Writer.jpg",
        iconKey: 'laptop',
        relatedInterests: ['Creative Arts', 'Technology'],
        skills: ['Writing', 'Communication']
    },
    { 
        id: 4, 
        title: "Sustainable Energy Analyst", 
        description: "Focus on green technology and climate solutions.", 
        pursuitSteps: ["B.Tech in Environmental Eng.", "Certifications in Green Energy", "Work with NGOs"], 
        colleges: "IIT Delhi, TERI SAS New Delhi", 
        salary: "₹ 5 - 10 LPA",
        link: "https://www.google.com/search?q=environmentalist+career",
        imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3uVhCJJFNxNpNB6VuXjTY7ioxeggiIGR0Lw&s",
        iconKey: 'leaf',
        relatedInterests: ['Science', 'Social Impact'],
        skills: ['Data Analysis', 'Communication']
    },
    { 
        id: 5, 
        title: "Chartered Accountant (CA)", 
        description: "Manage financial accounts, auditing, and taxation.", 
        pursuitSteps: ["Clear ICAI Foundation", "Pass Intermediate & Final", "3 Years Articleship"], 
        colleges: "ICAI", 
        salary: "₹ 7 - 12 LPA",
        link: "https://www.google.com/search?q=chartered+accountant+career",
        imageUrl: "https://bouve.northeastern.edu/wp-content/uploads/2023/05/what-do-pharmacist-do-northeastern-graduate.webp",
        iconKey: 'default',
        relatedInterests: ['Finance'],
        skills: ['Data Analysis', 'Communication']
    },
    { 
        id: 6, 
        title: "UX/UI Designer", 
        description: "Design user-friendly digital interfaces.", 
        pursuitSteps: ["B.Des (Bachelor of Design)", "Crack UCEED/NID DAT", "Build portfolio"], 
        colleges: "NID Ahmedabad, IIT Bombay", 
        salary: "₹ 5 - 12 LPA", 
        link: "https://www.google.com/search?q=graphic+designer+career",
        imageUrl: "https://www.rmcad.edu/wp-content/uploads/2024/04/shutterstock_434383288.jpg",
        iconKey: 'laptop',
        relatedInterests: ['Creative Arts', 'Technology'],
        skills: ['Design (UI/UX)', 'Communication']
    },
    { 
        id: 7, 
        title: "Historian", 
        description: "Studies and researches past events.", 
        pursuitSteps: ["BA in History", "Master Research Methods", "PhD for Academia"], 
        colleges: "JNU, Delhi University", 
        salary: "₹ 3 - 10 LPA",
        link: "https://www.google.com/search?q=historian+career",
        imageUrl: "https://ps-ja.com/wp-content/uploads/2019/10/historian-900x600.jpg",
        iconKey: 'default',
        relatedInterests: ['Creative Arts', 'Science'],
        skills: ['Writing', 'Research']
    },
    { 
        id: 8, 
        title: "Game Developer", 
        description: "Designs and develops video games.", 
        pursuitSteps: ["Learn Unity/Unreal Engine", "Master C# or C++", "Build Indie Games"], 
        colleges: "IIIT Hyderabad, BITS Pilani", 
        salary: "₹ 5 - 30 LPA", 
        link: "https://www.google.com/search?q=game+developer+career",
        imageUrl: "https://www.baker.edu/wp-content/uploads/game-developer-degree.jpg",
        iconKey: 'laptop',
        relatedInterests: ['Technology', 'Creative Arts'],
        skills: ['Coding', 'Design (UI/UX)']
    },
    { 
        id: 9, 
        title: "Pilot", 
        description: "Operates and navigates aircraft.", 
        pursuitSteps: ["CPL Training", "Pass DGCA Exams", "Flight Hours"], 
        colleges: "IGRUA, CAE Oxford", 
        salary: "₹ 10 - 60 LPA",
        link: "https://www.google.com/search?q=pilot+career",
        imageUrl: "https://i0.wp.com/aerocadet.com/blog/wp-content/uploads/2024/03/Good-Airline-Pilot.jpg",
        iconKey: 'default',
        relatedInterests: ['Technology', 'Science'],
        skills: ['Leadership', 'Communication']
    },
    { 
        id: 10, 
        title: "Chef / Culinary Expert", 
        description: "Prepare food and manage kitchen operations.", 
        pursuitSteps: ["B.Sc Culinary Arts", "Hotel Internships", "Specialization"], 
        colleges: "IHM Pusa, IHM Mumbai", 
        salary: "₹ 3 - 12 LPA",
        link: "https://www.google.com/search?q=chef+career",
        imageUrl: "https://www.escoffier.edu/wp-content/uploads/2021/08/Confident-smiling-female-chef-holding-two-plates-cooked-food-in-kitchen.jpeg",
        iconKey: 'default',
        relatedInterests: ['Social Impact', 'Science'],
        skills: ['Leadership', 'Communication']
    },
    { 
        id: 11, 
        title: "Software Developer", 
        description: "Builds software applications.", 
        pursuitSteps: ["Learn programming", "Build projects", "Logic Mastery"], 
        colleges: "IITs, NITs", 
        salary: "₹ 5 - 25 LPA", 
        link: "https://www.google.com/search?q=software+developer+career",
        imageUrl: "https://fsa2-assets.imgix.net/assets/Software-developer-at-computer.jpeg",
        iconKey: 'laptop',
        relatedInterests: ['Technology'],
        skills: ['Coding', 'Data Analysis']
    },
    { 
        id: 12, 
        title: "Cybersecurity Expert", 
        description: "Secures IT systems and data.", 
        pursuitSteps: ["Learn Cybersecurity", "CEH Certifications", "Network Security"], 
        colleges: "IIT Kanpur, NFSU", 
        salary: "₹ 6 - 25 LPA",
        link: "https://www.google.com/search?q=cybersecurity+expert+career",
        imageUrl: "https://s44783.pcdn.co/in/wp-content/uploads/sites/3/2022/06/cybersecurity-career.jpg.optimal.jpg",
        iconKey: 'laptop',
        relatedInterests: ['Technology'],
        skills: ['Data Analysis', 'Coding']
    },
    { 
        id: 13, 
        title: "Investment Banker", 
        description: "Facilitate mergers and capital raising.", 
        pursuitSteps: ["CA/MBA Finance", "Excel Modeling", "Networking"], 
        colleges: "IIMs, SP Jain", 
        salary: "₹ 15 - 40 LPA",
        link: "https://www.google.com/search?q=entrepreneur+career",
        imageUrl: "https://lovinglifeco.com/wp-content/uploads/2023/06/entrepreneur-wellbeing-blog-cover.jpg",
        iconKey: 'default',
        relatedInterests: ['Finance'],
        skills: ['Leadership', 'Data Analysis']
    },
    { 
        id: 14, 
        title: "Data Scientist", 
        description: "Analyze large data sets for insights.", 
        pursuitSteps: ["Master SQL & R", "Python Programming", "Kaggle Projects"], 
        colleges: "ISI Kolkata, IIT Madras", 
        salary: "₹ 7 - 18 LPA",
        link: "https://www.google.com/search?q=data+analyst+career",
        imageUrl: "https://www.smumn.edu/wp-content/uploads/2025/02/data-analyst-working-from-home-office.jpg",
        iconKey: 'brain',
        relatedInterests: ['Technology', 'Science'],
        skills: ['Data Analysis', 'Coding']
    },
    { 
        id: 15, 
        title: "UX Researcher", 
        description: "Understand user behavior through research.", 
        pursuitSteps: ["Study Psychology/Design", "User Interview Training", "Portfolio"], 
        colleges: "IIT Bombay, NID", 
        salary: "₹ 6 - 15 LPA",
        link: "https://www.google.com/search?q=psychologist+career",
        imageUrl: "https://medschool.ucla.edu/sites/default/files/styles/3_2_480x320/public/media/images/Difference-Between-Psychologist-and-Psychiatrist.jpg.webp",
        iconKey: 'brain',
        relatedInterests: ['Social Impact', 'Science'],
        skills: ['Data Analysis', 'Communication']
    },
    { id: 16, title: "Cloud Architect", description: "Design cloud computing strategies.", pursuitSteps: ["AWS/Azure Certs", "Master Networking", "Linux"], colleges: "N/A", salary: "₹ 12 - 30 LPA", link: "https://google.com", imageUrl: "https://placehold.co/600x400", iconKey: 'laptop', relatedInterests: ['Technology'], skills: ['Leadership'] },
    { id: 17, title: "Robotics Engineer", description: "Design and build robots.", pursuitSteps: ["Mechatronics degree", "ROS & C++", "Arduino"], colleges: "IIT Kanpur", salary: "₹ 5 - 12 LPA", link: "https://google.com", imageUrl: "https://placehold.co/600x400", iconKey: 'default', relatedInterests: ['Technology', 'Science'], skills: ['Coding'] },
    { id: 18, title: "DevOps Engineer", description: "Bridge dev and operations.", pursuitSteps: ["Linux Scripting", "Docker/Kubernetes", "Jenkins"], colleges: "N/A", salary: "₹ 7 - 20 LPA", link: "https://google.com", imageUrl: "https://placehold.co/600x400", iconKey: 'laptop', relatedInterests: ['Technology'], skills: ['Coding'] },
    { id: 19, title: "Aerospace Engineer", description: "Design aircraft and spacecraft.", pursuitSteps: ["JEE Advanced", "Aerodynamics", "Intern at ISRO"], colleges: "IIST", salary: "₹ 6 - 15 LPA", link: "https://google.com", imageUrl: "https://placehold.co/600x400", iconKey: 'default', relatedInterests: ['Technology', 'Science'], skills: ['Data Analysis'] },
    { id: 20, title: "Biomedical Engineer", description: "Apply engineering to medicine.", pursuitSteps: ["B.Tech Biomedical", "Hospital Internships", "Instrumentation"], colleges: "VIT", salary: "₹ 4 - 9 LPA", link: "https://google.com", imageUrl: "https://placehold.co/600x400", iconKey: 'default', relatedInterests: ['Science', 'Healthcare'], skills: ['Data Analysis'] },
    { id: 21, title: "Technical Writer", description: "Create clear product docs.", pursuitSteps: ["English/Tech Degree", "Certifications", "Portfolio"], colleges: "Symbiosis", salary: "₹ 4 - 8 LPA", link: "https://google.com", imageUrl: "https://placehold.co/600x400", iconKey: 'default', relatedInterests: ['Technology', 'Creative Arts'], skills: ['Writing'] },
    { id: 22, title: "Quantum Researcher", description: "Develop quantum systems.", pursuitSteps: ["Physics PhD", "TIFR Fellowship", "Math Mastery"], colleges: "IISc", salary: "₹ 8 - 18 LPA", link: "https://google.com", imageUrl: "https://placehold.co/600x400", iconKey: 'brain', relatedInterests: ['Technology', 'Science'], skills: ['Coding'] },
    { id: 23, title: "Product Manager", description: "Oversee product strategy.", pursuitSteps: ["MBA Top Tier", "Market Research", "UX basics"], colleges: "IIMs", salary: "₹ 15 - 35 LPA", link: "https://google.com", imageUrl: "https://placehold.co/600x400", iconKey: 'default', relatedInterests: ['Technology', 'Finance'], skills: ['Leadership', 'Communication'] },
    { id: 24, title: "Management Consultant", description: "Solve business problems.", pursuitSteps: ["MBA", "Case Competitions", "BCG/McKinsey Intern"], colleges: "IIMs", salary: "₹ 20 - 40 LPA", link: "https://google.com", imageUrl: "https://placehold.co/600x400", iconKey: 'default', relatedInterests: ['Finance'], skills: ['Leadership', 'Communication'] },
    { id: 25, title: "Digital Marketer", description: "Promote brands online.", pursuitSteps: ["Ads Certifications", "SEO/SEM", "Content Strategy"], colleges: "MICA", salary: "₹ 4 - 9 LPA", link: "https://google.com", imageUrl: "https://assets.entrepreneur.com/content/3x2/2000/1595357666-GettyImages-1147053827.jpg", iconKey: 'default', relatedInterests: ['Finance', 'Creative Arts'], skills: ['Communication'] },
    { id: 26, title: "Venture Capitalist", description: "Invest in startups.", pursuitSteps: ["Tech/Finance degree", "Startup networking", "Financial Modeling"], colleges: "IIMs", salary: "₹ 12 - 25 LPA", link: "https://google.com", imageUrl: "https://placehold.co/600x400", iconKey: 'default', relatedInterests: ['Finance', 'Technology'], skills: ['Data Analysis'] },
    { id: 27, title: "HR Business Partner", description: "Align HR with business.", pursuitSteps: ["MBA HR", "TISSNET", "Corporate Internships"], colleges: "TISS", salary: "₹ 8 - 20 LPA", link: "https://google.com", imageUrl: "https://placehold.co/600x400", iconKey: 'default', relatedInterests: ['Social Impact'], skills: ['Communication'] },
    { id: 28, title: "Supply Chain Manager", description: "Optimize production flow.", pursuitSteps: ["MBA Operations", "Six Sigma", "Logistics Intern"], colleges: "NITIE", salary: "₹ 10 - 22 LPA", link: "https://google.com", imageUrl: "https://assets.everspringpartners.com/8d/05/636def57477b9844bd527e843858/mechanical-engineering-on-emerging-technologies.jpg", iconKey: 'default', relatedInterests: ['Finance'], skills: ['Leadership'] },
    { id: 29, title: "Real Estate Manager", description: "Oversee construction/finance.", pursuitSteps: ["MBA Infra", "RERA laws", "Sales skills"], colleges: "NICMAR", salary: "₹ 5 - 12 LPA", link: "https://google.com", imageUrl: "https://www.stonewallco.com/hubfs/Construction%20civil%20engineer%20technician%20and%20architect%20working.png", iconKey: 'default', relatedInterests: ['Finance'], skills: ['Leadership'] },
    { id: 30, title: "Public Health Specialist", description: "Investigate disease patterns.", pursuitSteps: ["MPH degree", "Life Science background", "WHO/Govt work"], colleges: "TISS", salary: "₹ 5 - 10 LPA", link: "https://google.com", imageUrl: "https://placehold.co/600x400", iconKey: 'default', relatedInterests: ['Healthcare', 'Social Impact'], skills: ['Data Analysis'] },
    { id: 31, title: "Civil Services (IAS)", description: "Administrative governance.", pursuitSteps: ["Any degree", "UPSC Exam", "LBSNAA"], colleges: "N/A", salary: "₹ 7 - 10 LPA", link: "https://google.com", imageUrl: "https://placehold.co/600x400", iconKey: 'default', relatedInterests: ['Social Impact'], skills: ['Leadership'] },
    { id: 32, title: "Physiotherapist", description: "Recovery movement help.", pursuitSteps: ["BPT Degree", "Internship", "Specialization"], colleges: "CMC", salary: "₹ 3 - 6 LPA", link: "https://google.com", imageUrl: "https://placehold.co/600x400", iconKey: 'default', relatedInterests: ['Healthcare'], skills: ['Communication'] },
    { id: 33, title: "Veterinarian", description: "Animal healthcare.", pursuitSteps: ["NEET Vet", "BVSc degree", "Practice"], colleges: "IVRI", salary: "₹ 4 - 8 LPA", link: "https://google.com", imageUrl: "https://d2zp5xs5cp8zlg.cloudfront.net/image-33625-800.jpg", iconKey: 'default', relatedInterests: ['Healthcare', 'Science'], skills: ['Leadership'] },
    { id: 34, title: "Dietitian", description: "Advise on nutrition.", pursuitSteps: ["B.Sc Nutrition", "RD Exam", "Internship"], colleges: "Lady Irwin", salary: "₹ 3 - 7 LPA", link: "https://google.com", imageUrl: "https://placehold.co/600x400", iconKey: 'default', relatedInterests: ['Healthcare'], skills: ['Communication'] },
    { id: 35, title: "Biotechnologist", description: "Living system products.", pursuitSteps: ["B.Tech Bio", "GATE", "Lab research"], colleges: "IIT Delhi", salary: "₹ 4 - 8 LPA", link: "https://google.com", imageUrl: "https://akm-img-a-in.tosshub.com/sites/resources/campus/prod/img/career/2023/7/africanamericanchemistwomanwritingmedicineexperimentresultsclipboardafteranalyzinggeneticmutationplantsamplemicroscopescientistworkingbiochemistrylaboratory1111383403196.jpg", iconKey: 'default', relatedInterests: ['Science'], skills: ['Data Analysis'] },
    { id: 36, title: "Forensic Scientist", description: "Criminal evidence analysis.", pursuitSteps: ["B.Sc Forensic", "Join CBI labs", "Evidence training"], colleges: "NFSU", salary: "₹ 4 - 9 LPA", link: "https://google.com", imageUrl: "https://placehold.co/600x400", iconKey: 'default', relatedInterests: ['Science', 'Healthcare'], skills: ['Data Analysis'] },
    { id: 37, title: "Filmmaker", description: "Oversee film production.", pursuitSteps: ["Short films", "Film school", "Portfolio"], colleges: "FTII", salary: "₹ 5 - 15 LPA", link: "https://google.com", imageUrl: "https://placehold.co/600x400", iconKey: 'default', relatedInterests: ['Creative Arts'], skills: ['Leadership'] },
    { id: 38, title: "Social Worker", description: "Community challenges help.", pursuitSteps: ["MSW degree", "NGO fieldwork", "TISSNET"], colleges: "TISS", salary: "₹ 3.5 - 7 LPA", link: "https://google.com", imageUrl: "https://onlinesocialwork.vcu.edu/wp-content/uploads/sites/4/2023/12/vcu-msw-blog-disability-social-worker.jpeg", iconKey: 'default', relatedInterests: ['Social Impact'], skills: ['Communication'] },
    { id: 39, title: "Urban Planner", description: "Design town development.", pursuitSteps: ["B.Plan degree", "GATE M.Plan", "Smart City work"], colleges: "SPA Delhi", salary: "₹ 5 - 10 LPA", link: "https://google.com", imageUrl: "https://placehold.co/600x400", iconKey: 'default', relatedInterests: ['Social Impact'], skills: ['Data Analysis'] },
    { id: 40, title: "Journalist", description: "Report news stories.", pursuitSteps: ["Journalism degree", "Media Intern", "Writing"], colleges: "IIMC", salary: "₹ 3 - 7 LPA", link: "https://google.com", imageUrl: "https://cdn.cpdonline.co.uk/wp-content/uploads/2022/09/27091105/1-feature-image-Becoming-a-journalist-scaled.jpg", iconKey: 'default', relatedInterests: ['Creative Arts', 'Social Impact'], skills: ['Writing'] },
    { id: 41, title: "Fashion Designer", description: "Design clothing/accessories.", pursuitSteps: ["NIFT Exam", "Portfolio", "Design School"], colleges: "NIFT", salary: "₹ 4 - 10 LPA", link: "https://google.com", imageUrl: "https://www.usnews.com/dims4/USNEWS/845525a/2147483647/thumbnail/640x420/quality/85/?url=https%3A%2F%2Fwww.usnews.com%2Fcmsmedia%2F19%2Fd5%2F36b07e184f6e826424b5aa2687e5%2F201204-fashiondesigner-stock.jpg", iconKey: 'default', relatedInterests: ['Creative Arts'], skills: ['Writing'] },
    { id: 42, title: "Professor", description: "Teach university level.", pursuitSteps: ["Masters", "UGC-NET", "PhD"], colleges: "DU", salary: "₹ 6 - 12 LPA", link: "https://google.com", imageUrl: "https://placehold.co/600x400", iconKey: 'default', relatedInterests: ['Social Impact'], skills: ['Communication'] },
    { id: 43, title: "PR Specialist", description: "Manage public image.", pursuitSteps: ["Mass Comm degree", "Networking", "Crisis management"], colleges: "XIC", salary: "₹ 4 - 9 LPA", link: "https://google.com", imageUrl: "https://placehold.co/600x400", iconKey: 'default', relatedInterests: ['Creative Arts'], skills: ['Communication'] },
    { id: 44, title: "School Teacher", description: "Educate school students.", pursuitSteps: ["B.Ed", "CTET Exam", "Subject specialization"], colleges: "DU", salary: "₹ 3 - 8 LPA", link: "https://google.com", imageUrl: "https://www.stylemotivation.com/wp-content/uploads/2022/08/download.jpeg", iconKey: 'default', relatedInterests: ['Social Impact'], skills: ['Communication'] },
    { id: 45, title: "Archeologist", description: "Excavation research.", pursuitSteps: ["History degree", "ASI work", "PhD"], colleges: "Deccan College", salary: "₹ 4 - 8 LPA", link: "https://google.com", imageUrl: "https://ps-ja.com/wp-content/uploads/2019/10/historian-900x600.jpg", iconKey: 'default', relatedInterests: ['Science', 'Creative Arts'], skills: ['Data Analysis'] },
    { id: 46, title: "Event Manager", description: "Organize large events.", pursuitSteps: ["Event Mgmt degree", "Vendor networking", "Internships"], colleges: "NIEM", salary: "₹ 3 - 7 LPA", link: "https://google.com", imageUrl: "https://aaft.com/blog/wp-content/uploads/2024/03/46268-1024x683.jpg", iconKey: 'default', relatedInterests: ['Creative Arts'], skills: ['Communication'] },
    { id: 47, title: "Content Writer", description: "Writes media content.", pursuitSteps: ["Writing skills", "Certs", "Portfolio"], colleges: "N/A", salary: "₹ 3 - 12 LPA", link: "https://google.com", imageUrl: "https://www.simplilearn.com/ice9/free_resources_article_thumb/How_To_Become_A_Content_Writer.jpg", iconKey: 'laptop', relatedInterests: ['Creative Arts'], skills: ['Writing'] },
    { id: 48, title: "Artist", description: "Creative expressions.", pursuitSteps: ["Art skills", "MFA", "Portfolio"], colleges: "N/A", salary: "₹ 2 - 15 LPA", link: "https://google.com", imageUrl: "https://cdn.prod.website-files.com/65393b768d06ee4c16d24a33/668ec9b6739ea40561c113e2_Artist%20statement%20examples%20crafting%20your%20own%20unique%20narrative.jpg", iconKey: 'default', relatedInterests: ['Creative Arts'], skills: ['Writing'] },
    { id: 49, title: "Pharmacist", description: "Dispense medicines.", pursuitSteps: ["BPharm", "Pharmacy Council Reg", "Internship"], colleges: "NIPER", salary: "₹ 3 - 10 LPA", link: "https://google.com", imageUrl: "https://bouve.northeastern.edu/wp-content/uploads/2023/05/what-do-pharmacist-do-northeastern-graduate.webp", iconKey: 'default', relatedInterests: ['Healthcare'], skills: ['Communication'] },
    { id: 50, title: "Economist", description: "Analyze economies.", pursuitSteps: ["Masters Econ", "Data modeling", "Research"], colleges: "DSE", salary: "₹ 6 - 25 LPA", link: "https://google.com", imageUrl: "https://www.investopedia.com/thmb/WebrT7xuDb9TA7hww-uJFUuhsTw=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/GettyImages-150337748-74123b73187746fc80dd7f66b3b9d6ed.jpg", iconKey: 'default', relatedInterests: ['Finance'], skills: ['Data Analysis'] },
];

export default careerOptions;