"use client";

import Link from 'next/link';
import React, { useEffect, useState } from "react";
// import { Career } from '../options/careeroption';


// interface Career {
//   id: number;
//   name: string;
//   description: string;
// }
export interface Career {
  id: number;
  title: string;
  description: string;
  howTo: string;
  salary: string;
  link: string;
  imageUrl: string;
}

const careerOptions: Career[] = [
  {
    id: 1,
    title: 'Doctor',
    description: 'Diagnoses and treats medical conditions.',
    howTo: 'Pass NEET, pursue MBBS/MD.',
    salary: '₹5-30 LPA',
    link: 'https://www.google.com/search?q=doctor+career',
    imageUrl: 'https://www.future-doctor.de/wp-content/uploads/2024/08/shutterstock_2480850611.jpg',
  },
  //{ id: 2, title: 'Engineer', description: 'Designs and builds technical solutions.', howTo: 'Pass JEE, complete B.Tech.', salary: '₹4-20 LPA', link: 'https://www.google.com/search?q=engineer+career', imageUrl: 'https://placehold.co/600x400/6a11cb/ffffff?text=Engineer' },
  {
    id: 3,
    title: 'Historian',
    description: 'Studies and researches past events.',
    howTo: 'Complete a degree in History.',
    salary: '₹3-10 LPA',
    link: 'https://www.google.com/search?q=historian+career',
    imageUrl: 'https://ps-ja.com/wp-content/uploads/2019/10/historian-900x600.jpg',
  },
  {
    id: 4,
    title: 'Physicist',
    description: 'Studies and researches physical phenomena.',
    howTo: 'Pursue BSc, MSc, and PhD in Physics.',
    salary: '₹6-20 LPA',
    link: 'https://www.google.com/search?q=physicist+career',
    imageUrl: 'https://media.istockphoto.com/id/497130603/photo/man-standing-against-chalkboard-solves-physics-equations-rear-view-retro.jpg?s=612x612&w=0&k=20&c=rfsp68WN9mRt84TKxpnOOP4bfxUYMK3RSS_OnuzlDDA=',
  },
  {
    id: 5,
    title: 'Mathematician',
    description: 'Solves mathematical problems.',
    howTo: 'Pursue a degree in Mathematics.',
    salary: '₹4-18 LPA',
    link: 'https://www.google.com/search?q=mathematician+career',
    imageUrl: 'https://penntoday.upenn.edu/sites/default/files/2020-02/P-100849-Master-V1-004X.jpg',
  },
  {
    id: 6,
    title: 'Teacher',
    description: 'Educates and mentors students.',
    howTo: 'Pursue B.Ed and teaching certifications.',
    salary: '₹3-10 LPA',
    link: 'https://www.google.com/search?q=teacher+career',
    imageUrl: 'https://www.stylemotivation.com/wp-content/uploads/2022/08/download.jpeg',
  },
  {
    id: 7,
    title: 'Lawyer',
    description: 'Provides legal advice and representation.',
    howTo: 'Pass LLB, CLAT or AIBE.',
    salary: '₹3-25 LPA',
    link: 'https://www.google.com/search?q=lawyer+career',
    imageUrl: 'https://media.collegedekho.com/media/img/news/Skills_Reuqired_to_be_a_Successful_Lawyer.png?height=310&width=615',
  },
  {
    id: 8,
    title: 'Pilot',
    description: 'Operates and navigates aircraft.',
    howTo: 'Complete CPL training.',
    salary: '₹10-60 LPA',
    link: 'https://www.google.com/search?q=pilot+career',
    imageUrl: 'https://i0.wp.com/aerocadet.com/blog/wp-content/uploads/2024/03/Good-Airline-Pilot.jpg?fit=826%2C551&ssl=1',
  },
  {
    id: 9,
    title: 'Chef',
    description: 'Prepares and presents food.',
    howTo: 'Attend culinary school.',
    salary: '₹3-12 LPA',
    link: 'https://www.google.com/search?q=chef+career',
    imageUrl: 'https://www.escoffier.edu/wp-content/uploads/2021/08/Confident-smiling-female-chef-holding-two-plates-cooked-food-in-kitchen.jpeg',
  },
  {
    id: 10,
    title: 'Artist',
    description: 'Expresses creativity through art.',
    howTo: 'Develop art skills, pursue MFA.',
    salary: '₹2-15 LPA',
    link: 'https://www.google.com/search?q=artist+career',
    imageUrl: 'https://cdn.prod.website-files.com/65393b768d06ee4c16d24a33/668ec9b6739ea40561c113e2_Artist%20statement%20examples%20crafting%20your%20own%20unique%20narrative.jpg',
  },
  {
    id: 11,
    title: 'Software Developer',
    description: 'Builds software applications.',
    howTo: 'Learn programming and development skills.',
    salary: '₹5-25 LPA',
    link: 'https://www.google.com/search?q=software+developer+career',
    imageUrl: 'https://fsa2-assets.imgix.net/assets/Software-developer-at-computer.jpeg?auto=compress%2Cformat&crop=focalpoint&domain=fsa2-assets.imgix.net&fit=crop&fp-x=0.5&fp-y=0.5&ixlib=php-3.3.1&w=1280',
  },
  {
    id: 12,
    title: 'Game Developer',
    description: 'Designs and develops video games.',
    howTo: 'Learn game engines and programming.',
    salary: '₹5-30 LPA',
    link: 'https://www.google.com/search?q=game+developer+career',
    imageUrl: 'https://www.baker.edu/wp-content/uploads/game-developer-degree.jpg',
  },
  {
    id: 13,
    title: 'Dentist',
    description: 'Provides dental care and treatment.',
    howTo: 'Pass NEET, pursue BDS/MDS.',
    salary: '₹5-20 LPA',
    link: 'https://www.google.com/search?q=dentist+career',
    imageUrl: 'https://southgablesdental.com/wp-content/uploads/2019/06/Different-types-of-dentists.jpg',
  },
  {
    id: 14,
    title: 'Astronaut',
    description: 'Explores outer space.',
    howTo: 'Pursue STEM degree and NASA training.',
    salary: 'Varies, often $150K+.',
    link: 'https://www.google.com/search?q=astronaut+career',
    imageUrl: 'https://thumbs.dreamstime.com/b/astronaut-outer-space-against-backdrop-planet-earth-elements-image-furnished-nasa-48582773.jpg',
  },
  {
    id: 15,
    title: 'Fashion Designer',
    description: 'Creates clothing and accessories.',
    howTo: 'Learn fashion design, attend fashion school.',
    salary: '₹4-15 LPA',
    link: 'https://www.google.com/search?q=fashion+designer+career',
    imageUrl: 'https://www.usnews.com/dims4/USNEWS/845525a/2147483647/thumbnail/640x420/quality/85/?url=https%3A%2F%2Fwww.usnews.com%2Fcmsmedia%2F19%2Fd5%2F36b07e184f6e826424b5aa2687e5%2F201204-fashiondesigner-stock.jpg',
  },
  {
    id: 16,
    title: 'Psychologist',
    description: 'Helps people with mental health issues.',
    howTo: 'Pursue BA/BSc Psychology, MSc, and PhD.',
    salary: '₹4-20 LPA',
    link: 'https://www.google.com/search?q=psychologist+career',
    imageUrl: 'https://medschool.ucla.edu/sites/default/files/styles/3_2_480x320/public/media/images/Difference-Between-Psychologist-and-Psychiatrist.jpg.webp?itok=xm3HSttjv',
  },
  {
    id: 17,
    title: 'Entrepreneur',
    description: 'Starts and runs a business.',
    howTo: 'Learn business skills, MBA recommended.',
    salary: 'Varies widely.',
    link: 'https://www.google.com/search?q=entrepreneur+career',
    imageUrl: 'https://lovinglifeco.com/wp-content/uploads/2023/06/entrepreneur-wellbeing-blog-cover.jpg',
  },
  {
    id: 18,
    title: 'Cybersecurity Expert',
    description: 'Secures IT systems and data.',
    howTo: 'Learn cybersecurity, pursue certifications.',
    salary: '₹6-25 LPA',
    link: 'https://www.google.com/search?q=cybersecurity+expert+career',
    imageUrl: 'https://s44783.pcdn.co/in/wp-content/uploads/sites/3/2022/06/cybersecurity-career.jpg.optimal.jpg',
  },
  {
    id: 19,
    title: 'Veterinarian',
    description: 'Treats and cares for animals.',
    howTo: 'Pursue BVSc, pass entrance exams.',
    salary: '₹5-15 LPA',
    link: 'https://www.google.com/search?q=veterinarian+career',
    imageUrl: 'https://d2zp5xs5cp8zlg.cloudfront.net/image-33625-800.jpg',
  },
  {
    id: 20,
    title: 'Data Analyst',
    description: 'Interprets data to inform decisions.',
    howTo: 'Learn analytics, pursue certifications.',
    salary: '₹5-15 LPA',
    link: 'https://www.google.com/search?q=data+analyst+career',
    imageUrl: 'https://www.smumn.edu/wp-content/uploads/2025/02/data-analyst-working-from-home-office.jpg',
  },
  {
    id: 21,
    title: 'Content Writer',
    description: 'Writes and edits content for media.',
    howTo: 'Learn writing skills, pursue certifications.',
    salary: '₹3-12 LPA',
    link: 'https://www.google.com/search?q=content+writer+career',
    imageUrl: 'https://www.simplilearn.com/ice9/free_resources_article_thumb/How_To_Become_A_Content_Writer.jpg',
  },
  {
    id: 22,
    title: 'Digital Marketer',
    description: 'Promotes brands online.',
    howTo: 'Learn SEO, digital marketing certifications.',
    salary: '₹4-15 LPA',
    link: 'https://www.google.com/search?q=digital+marketer+career',
    imageUrl: 'https://assets.entrepreneur.com/content/3x2/2000/1595357666-GettyImages-1147053827.jpg',
  },
  {
    id: 23,
    title: 'Journalist',
    description: 'Reports and writes news stories.',
    howTo: 'Pursue a degree in Journalism.',
    salary: '₹3-10 LPA',
    link: 'https://www.google.com/search?q=journalist+career',
    imageUrl: 'https://cdn.cpdonline.co.uk/wp-content/uploads/2022/09/27091105/1-feature-image-Becoming-a-journalist-scaled.jpg',
  },
  {
    id: 24,
    title: 'Nurse',
    description: 'Provides healthcare and patient support.',
    howTo: 'Pursue BSc Nursing.',
    salary: '₹3-12 LPA',
    link: 'https://www.google.com/search?q=nurse+career',
    imageUrl: 'https://cdn.prod.website-files.com/5babc11099f97ea5dbcf24d5/66aa498eee2c18e9ed7c04d9_what-is-a-vocational-nurse.jpg',
  },
  {
    id: 25,
    title: 'Biologist',
    description: 'Studies living organisms.',
    howTo: 'Complete MSc or PhD in Biology.',
    salary: '₹5-20 LPA',
    link: 'https://www.google.com/search?q=biologist+career',
    imageUrl: 'https://akm-img-a-in.tosshub.com/sites/resources/campus/prod/img/career/2023/7/africanamericanchemistwomanwritingmedicineexperimentresultsclipboardafteranalyzinggeneticmutationplantsamplemicroscopescientistworkingbiochemistrylaboratory1111383403196.jpg?size=624:351',
  },
  {
    id: 26,
    title: 'Economist',
    description: 'Studies and analyses economies.',
    howTo: 'Pursue BA/BSc, MSc in Economics.',
    salary: '₹6-25 LPA',
    link: 'https://www.google.com/search?q=economist+career',
    imageUrl: 'https://www.investopedia.com/thmb/WebrT7xuDb9TA7hww-uJFUuhsTw=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/GettyImages-150337748-74123b73187746fc80dd7f66b3b9d6ed.jpg',
  },
  {
    id: 27,
    title: 'Chemist',
    description: 'Researches chemicals and compounds.',
    howTo: 'Pursue MSc or PhD in Chemistry.',
    salary: '₹4-15 LPA',
    link: 'https://www.google.com/search?q=chemist+career',
    imageUrl: 'https://capitalresin.com/wp-content/uploads/2023/09/O96s0W9tWSan7PtPulShnGx2Dmk1nOX41693510871-1000x500.jpg',
  },
  {
    id: 28,
    title: 'Pharmacist',
    description: 'Prepares and dispenses medicines.',
    howTo: 'Pursue BPharm or DPharm.',
    salary: '₹3-10 LPA',
    link: 'https://www.google.com/search?q=pharmacist+career',
    imageUrl: 'https://bouve.northeastern.edu/wp-content/uploads/2023/05/what-do-pharmacist-do-northeastern-graduate.webp',
  },
  {
    id: 29,
    title: 'Translator',
    description: 'Translates languages for communication.',
    howTo: 'Learn languages and certifications.',
    salary: '₹3-10 LPA',
    link: 'https://www.google.com/search?q=translator+career',
    imageUrl: 'https://www.talentedladiesclub.com/site/wp-content/uploads/Human-translator-vs-AI-solution-Who-will-win-780x520.jpg',
  },
  {
    id: 30,
    title: 'Social Worker',
    description: 'Helps individuals and communities.',
    howTo: 'Pursue MSW or related degree.',
    salary: '₹3-10 LPA',
    link: 'https://www.google.com/search?q=social+worker+career',
    imageUrl: 'https://onlinesocialwork.vcu.edu/wp-content/uploads/sites/4/2023/12/vcu-msw-blog-disability-social-worker.jpeg',
  },
  {
    id: 31,
    title: 'Environmentalist',
    description: 'Protects and advocates for nature.',
    howTo: 'Pursue Environmental Science.',
    salary: '₹4-12 LPA',
    link: 'https://www.google.com/search?q=environmentalist+career',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3uVhCJJFNxNpNB6VuXjTY7ioxeggiIGR0Lw&s',
  },
  {
    id: 32,
    title: 'Interior Designer',
    description: 'Designs indoor spaces.',
    howTo: 'Learn design skills and certifications.',
    salary: '₹4-20 LPA',
    link: 'https://www.google.com/search?q=interior+designer+career',
    imageUrl: 'https://www.wedezinestudio.com/blogs/wp-content/uploads/2025/05/bedroom1-scaled.webp',
  },
  {
    id: 33,
    title: 'Event Planner',
    description: 'Organizes and manages events.',
    howTo: 'Learn event management.',
    salary: '₹4-15 LPA',
    link: 'https://www.google.com/search?q=event+planner+career',
    imageUrl: 'https://aaft.com/blog/wp-content/uploads/2024/03/46268-1024x683.jpg',
  },
  {
    id: 34,
    title: 'Mechanical Engineer',
    description: 'Designs and builds machines.',
    howTo: 'Complete B.Tech or M.Tech.',
    salary: '₹4-20 LPA',
    link: 'https://www.google.com/search?q=mechanical+engineer+career',
    imageUrl: 'https://assets.everspringpartners.com/8d/05/636def57477b9844bd527e843858/mechanical-engineering-on-emerging-technologies.jpg',
  },
  {
    id: 35,
    title: 'Civil Engineer',
    description: 'Designs and builds infrastructure.',
    howTo: 'Pass JEE, pursue B.Tech.',
    salary: '₹4-18 LPA',
    link: 'https://www.google.com/search?q=civil+engineer+career',
    imageUrl: 'https://www.stonewallco.com/hubfs/Construction%20civil%20engineer%20technician%20and%20architect%20working.png',
  },
  {
    id: 36,
    title: 'AI Engineer',
    description: 'Develops AI-based solutions.',
    howTo: 'Learn AI and machine learning.',
    salary: '₹8-25 LPA',
    link: 'https://www.google.com/search?q=ai+engineer+career',
    imageUrl: 'https://images.ctfassets.net/wp1lcwdav1p1/1nYXE4h20tXKjNPrtHwcxs/e13c6a82adb77d21c14361d7145b7369/GettyImages-1363841531_Java_vs_C__.jpg?w=1500&h=680&q=60&fit=fill&f=faces&fm=jpg&fl=progressive',
  },
  {
    id: 37,
    title: 'Graphic Designer',
    description: 'Creates visual designs.',
    howTo: 'Learn graphic design tools and skills.',
    salary: '₹3-15 LPA',
    link: 'https://www.google.com/search?q=graphic+designer+career',
    imageUrl: 'https://www.rmcad.edu/wp-content/uploads/2024/04/shutterstock_434383288.jpg',
  },
  {
    id: 38,
    title: 'Photographer',
    description: 'Captures moments with photography.',
    howTo: 'Learn photography skills.',
    salary: '₹3-12 LPA',
    link: 'https://www.google.com/search?q=photographer+career',
    imageUrl: 'https://t3.ftcdn.net/jpg/02/48/98/86/360_F_248988636_d7C8GzoLO1W6NQ8TJ33kgUkF5SsFI8Cl.jpg',
  },
  {
    id: 39,
    title: 'Actor',
    description: 'Performs in movies and plays.',
    howTo: 'Learn acting skills.',
    salary: 'Varies widely.',
    link: 'https://www.google.com/search?q=actor+career',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmWBsWP8cd72Z5MmQ0F47zwtiROunNaUIHJg&s',
  },
];

interface QuizResult {
  id: number;
  quizName: string;
  score: number;
  createdAt: string;
}

// ===== Local Storage Helpers (Updated to match Options Page key: "favourites") =====
const getSavedCareers = (): number[] => {
  if (typeof window === 'undefined') return [];
  return JSON.parse(localStorage.getItem("saved_careers") || "[]");
};

const saveCareer = (careerId: number) => {
  const saved = getSavedCareers();
  if (!saved.includes(careerId)) saved.push(careerId);
  localStorage.setItem("saved_careers", JSON.stringify(saved));
};

const removeCareer = (careerId: number) => {
  const saved = getSavedCareers().filter(id => id !== careerId);
  localStorage.setItem("saved_careers", JSON.stringify(saved));
};

const getQuizResults = (): QuizResult[] => {
  if (typeof window === 'undefined') return [];
  return JSON.parse(localStorage.getItem("quiz_results") || "[]");
};

// ===== Mock Career Data =====
// const careerOptions: Career[] = [
//   // { id: 1, name: "Software Engineer", description: "Build and design applications." },
//   // { id: 2, name: "Data Scientist", description: "Analyze data to find insights." },
//   // { id: 3, name: "UI/UX Designer", description: "Design user-friendly interfaces." },
//   // { id: 4, name: "Cybersecurity Expert", description: "Secure systems and data." },
// ];

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);
  const [savedCareers, setSavedCareers] = useState<Career[]>([]);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [recommendations, setRecommendations] = useState<Career[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    setMounted(true);
    const savedIds = getSavedCareers();

    setSavedCareers(careerOptions.filter(c => savedIds.includes(c.id)));

    const quizData = getQuizResults();
    setQuizResults(quizData);

    setRecommendations(careerOptions.filter(c => !savedIds.includes(c.id)).slice(0, 3));
  }, []);

  const toggleSave = (careerId: number) => {
    const saved = getSavedCareers();
    if (saved.includes(careerId)) {
      removeCareer(careerId);
    } else {
      saveCareer(careerId);
    }

    const updatedSaved = careerOptions.filter(c => getSavedCareers().includes(c.id));
    setSavedCareers(updatedSaved);

    setRecommendations(careerOptions.filter(c => !getSavedCareers().includes(c.id)).slice(0, 3));
  };

  if (!mounted) return null;

  return (
    <div className="text-white bg-gradient-to-br from-gray-900 via-purple-900 to-gray-800 font-inter min-h-screen relative">
      {/* Navbar */}
      <nav className="bg-[#210440] relative z-10 flex justify-between items-center p-4 md:p-8 max-w-7xl mx-auto">
                    <div className="flex items-center space-x-2">
                        <img src="https://placehold.co/40x40/F1AA9B/white?text=N" alt="Foody Logo" className="rounded-full"/>
                        <span className="text-2xl font-bold text-[#fdfdfd]">NXTSTEP</span>
                    </div>
                    <div className="hidden md:flex items-center space-x-6">
                        <a href="/home" className="font-medium text-[#fcfcfb] hover:text-[#650b4b] transition-colors">Home</a>
                        <a href="/about" className="font-medium text-[#fffefe] hover:text-[#650b4b] transition-colors">About</a>
                        <a href="/form" className="font-medium text-[#fdfcfb] hover:text-[#650b4b] transition-colors">Form</a>
                        <a href="/options" className="font-medium text-[#fdfbfb] hover:text-[#650b4b] transition-colors">Options</a>
                        <a href="/quiz" className="font-medium text-[#fefdfd] hover:text-[#650b4b] transition-colors">Quiz</a>
                        <a href="/dashboard" className="font-medium text-[#fefbfb] hover:text-[#650b4b] transition-colors">Dashboard</a>
                    </div>
                    <div className="flex items-center space-x-4">
                        {/* <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white cursor-pointer hover:text-gray-300 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg> */}
                        {/* <input
                        type="text"
                        id="searchBar"
                        placeholder="Search career options..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full sm:w-auto p-2 text-base rounded-l-md focus:outline-none focus:ring-2 focus:[#310E10] text-[#F5EFEB]"
                        /> */}
                        <Link href="/signup">

                        <button onClick={() => {}} className="px-4 py-2 border border-white text-white text-sm font-semibold rounded-full hover:bg-[#650b4b] transition-colors hidden sm:block">Sign in</button>
                        </Link>
                    
                    </div>
                </nav>
<img src="https://pbs.twimg.com/media/EDyxVvhWsAMIbLx?format=png&name=small" alt="Background" className="absolute inset-0 w-full h-full object-cover opacity-20 z-0"/>
      
      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 mt-12 md:mt-24 space-y-12">
        {/* Saved Careers */}
        <div className="bg-[#280a49] rounded-2xl shadow p-6">
          <h2 className="text-2xl font-semibold text-[#F1AA9B] mb-4">My Favourites</h2>

          {savedCareers.length === 0 ? (
            <p className="text-gray-300">No favourite careers added yet.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {savedCareers.map(career => (
                <div key={career.id} className="p-4 bg-[#F1AA9B]/10 rounded-xl flex justify-between items-center hover:bg-[#F1AA9B]/20 transition">
                  <div>
                    <h3 className="font-bold text-lg">{career.title}</h3>
                    <p className="text-gray-300">{career.description}</p>
                  </div>

                  {/* Filled heart for saved */}
                  <button
                    onClick={() => toggleSave(career.id)}
                    className="text-red-500 text-2xl"
                  >
                    ❤️
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quiz Results */}
        <div className="bg-[#280a49] rounded-2xl shadow p-6">
          <h2 className="text-2xl font-semibold text-[#F1AA9B] mb-4">My Recent Quiz Results</h2>

          {quizResults.length === 0 ? (
            <p className="text-gray-300">No quiz results yet.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {quizResults.map(q => (
                <div key={q.id} className="p-4 bg-[#F1AA9B]/10 rounded-xl">
                  <p><strong>Quiz:</strong> {q.quizName}</p>
                  <p><strong>Score:</strong> {q.score}%</p>
                  <p className="text-gray-400 text-sm">{new Date(q.createdAt).toLocaleString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recommended Careers */}
        <div className="bg-[#280a49] rounded-2xl shadow p-6">
          <h2 className="text-2xl font-semibold text-[#F1AA9B] mb-4">Recommended for You</h2>

          {recommendations.length === 0 ? (
            <p className="text-gray-300">No recommendations available.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {recommendations.map(career => (
                <div key={career.id} className="p-4 bg-[#F1AA9B]/10 rounded-xl flex justify-between items-center hover:bg-[#F1AA9B]/20 transition">
                  <div>
                    <h3 className="font-bold text-lg">{career.title}</h3>
                    <p className="text-gray-300">{career.description}</p>
                  </div>

                  {/* Empty heart for not saved */}
                  <button
                    onClick={() => toggleSave(career.id)}
                    className="text-white text-2xl"
                  >
                    🤍
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}