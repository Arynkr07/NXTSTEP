'use client';

import Link from 'next/link';
import React, { useState, useRef, useEffect } from 'react';
import { saveCareer, removeCareer, getSavedCareers } from '../utils/storage';
import { Search, Map, Zap, Target, ArrowRight, ExternalLink, Heart, ChevronLeft, ChevronRight } from 'lucide-react';

interface Career {
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
  // ... (Keep other career items here)
];

export default function CareerOptionsPage() {
  const [showPopup, setShowPopup] = useState(false);
  const [popupData, setPopupData] = useState<Career | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [saved, setSaved] = useState<number[]>([]);

  useEffect(() => {
    setSaved(getSavedCareers());
  }, []);

  const handleShowPopup = (career: Career) => {
    setPopupData(career);
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setPopupData(null);
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const filteredCareers = careerOptions.filter(career =>
    career.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleSave = (e: React.MouseEvent, id: number) => {
    e.stopPropagation(); // Don't open popup when clicking heart
    if (saved.includes(id)) {
      removeCareer(id);
    } else {
      saveCareer(id);
    }
    setSaved(getSavedCareers());
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* --- NAVIGATION --- */}
      <nav className="flex items-center justify-between px-8 py-6 border-b border-slate-100 sticky top-0 bg-white z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center text-white font-bold italic">N</div>
          <span className="text-xl font-bold tracking-tight uppercase">NXTSTEP</span>
        </div>
        <div className="hidden md:flex gap-8 text-sm font-medium text-slate-600">
          <Link href="/home" className="hover:text-orange-600 transition">Home</Link>
          <Link href="/form" className="hover:text-orange-600 transition">AI Guide</Link>
          <Link href="/options" className="text-orange-600 font-bold">Options</Link>
          <Link href="/dashboard" className="hover:text-orange-600 transition">Dashboard</Link>
        </div>
        <Link href="/signup">
          <button className="bg-slate-900 text-white px-6 py-2 rounded-full font-bold text-sm hover:bg-orange-600 transition shadow-lg">
            Sign In
          </button>
        </Link>
      </nav>

      {/* --- HERO / SEARCH SECTION --- */}
      <header className="bg-slate-50 py-20 px-8 relative overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 text-orange-600 font-bold text-sm uppercase tracking-widest mb-4">
            <Target size={18} fill="currentColor" />
            <span>Discover Your Calling</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black leading-[0.9] mb-8 tracking-tighter uppercase italic">
            Catch Your <br /> 
            <span className="text-orange-600">Future Wave*</span>
          </h1>
          
          <div className="flex flex-col md:flex-row gap-4 mt-12 max-w-2xl">
            <div className="relative flex-grow">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Search careers (e.g. Designer, Pilot...)"
                className="w-full border-4 border-slate-900 p-5 pl-12 rounded-2xl font-bold text-lg focus:outline-none focus:ring-8 focus:ring-orange-100 transition shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
        {/* Background Decorative Text */}
        <div className="absolute -bottom-10 right-0 opacity-[0.04] select-none pointer-events-none">
          <h2 className="text-[250px] font-black italic whitespace-nowrap leading-none">EXPLORE</h2>
        </div>
      </header>

      {/* --- CAREER CAROUSEL SECTION --- */}
      <section className="py-24 px-8 max-w-[1400px] mx-auto">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-4xl font-black uppercase italic tracking-tighter">Future-Proof Paths</h2>
            <p className="text-slate-500 font-medium mt-2 italic">Hand-picked by AI based on market growth.</p>
          </div>
          <div className="flex gap-4">
            <button onClick={() => scroll('left')} className="p-4 border-2 border-slate-900 rounded-xl hover:bg-orange-600 hover:text-white transition shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
              <ChevronLeft size={24} />
            </button>
            <button onClick={() => scroll('right')} className="p-4 border-2 border-slate-900 rounded-xl hover:bg-orange-600 hover:text-white transition shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
              <ChevronRight size={24} />
            </button>
          </div>
        </div>

        <div 
          ref={scrollContainerRef}
          className="flex gap-8 overflow-x-auto pb-12 scroll-smooth no-scrollbar"
        >
          {filteredCareers.map((career) => (
            <div
              key={career.id}
              onClick={() => handleShowPopup(career)}
              className="min-w-[320px] md:min-w-[380px] group cursor-pointer"
            >
              <div className="relative h-[400px] rounded-[32px] overflow-hidden border-4 border-slate-900 shadow-[12px_12px_0px_0px_rgba(15,23,42,1)] transition-all group-hover:-translate-y-2 group-hover:shadow-[16px_16px_0px_0px_rgba(234,88,12,1)]">
                <img src={career.imageUrl} alt={career.title} className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-500" />
                
                {/* Overlay Content */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-90"></div>
                
                <button 
                  onClick={(e) => toggleSave(e, career.id)}
                  className="absolute top-6 right-6 p-3 bg-white rounded-xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:scale-110 transition"
                >
                  <Heart size={20} fill={saved.includes(career.id) ? "#ea580c" : "none"} color={saved.includes(career.id) ? "#ea580c" : "currentColor"} />
                </button>

                <div className="absolute bottom-8 left-8 right-8">
                  <span className="bg-orange-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-3 inline-block">
                    High Growth
                  </span>
                  <h3 className="text-3xl font-black text-white uppercase italic leading-none">{career.title}</h3>
                  <div className="flex items-center gap-2 text-orange-400 mt-2 font-bold italic">
                    <Zap size={14} fill="currentColor" /> {career.salary}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- POPUP MODAL --- */}
      {showPopup && popupData && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
          <div className="bg-white rounded-[40px] border-4 border-slate-900 w-full max-w-2xl overflow-hidden shadow-[20px_20px_0px_0px_rgba(234,88,12,1)] relative animate-in fade-in zoom-in duration-300">
            <button onClick={handleClosePopup} className="absolute top-6 right-6 z-10 p-2 hover:rotate-90 transition-transform">
              <Zap size={32} className="text-slate-900 fill-orange-500" />
            </button>

            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/3 h-48 md:h-auto">
                <img src={popupData.imageUrl} className="w-full h-full object-cover border-r-4 border-slate-900" />
              </div>
              <div className="p-10 md:w-2/3">
                <h2 className="text-5xl font-black uppercase italic tracking-tighter mb-4">{popupData.title}</h2>
                <p className="text-slate-600 font-medium mb-8 leading-relaxed italic border-l-4 border-orange-500 pl-4">"{popupData.description}"</p>
                
                <div className="space-y-6 mb-10">
                  <div>
                    <span className="text-xs font-black uppercase tracking-widest text-orange-600">How to Pursue</span>
                    <p className="font-bold text-slate-900">{popupData.howTo}</p>
                  </div>
                  <div>
                    <span className="text-xs font-black uppercase tracking-widest text-orange-600">Expected Salary</span>
                    <p className="font-bold text-slate-900 text-2xl">{popupData.salary}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <a href={popupData.link} target="_blank" className="flex-grow bg-slate-900 text-white text-center py-4 rounded-2xl font-black uppercase italic tracking-widest flex items-center justify-center gap-2 hover:bg-orange-600 transition">
                    Explore Roadmap <ExternalLink size={18} />
                  </a>
                  <button 
                    onClick={(e) => toggleSave(e, popupData.id)}
                    className="px-6 border-4 border-slate-900 rounded-2xl flex items-center justify-center hover:bg-slate-50 transition"
                  >
                    <Heart size={24} fill={saved.includes(popupData.id) ? "#ea580c" : "none"} color={saved.includes(popupData.id) ? "#ea580c" : "currentColor"} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}