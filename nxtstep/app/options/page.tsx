'use client';

import React, { useState, useRef } from 'react';


// Define the structure for a career option
interface Career {
  title: string;
  description: string;
  howTo: string;
  salary: string;
  link: string;
  imageUrl: string;
  
}

const careerOptions: Career[] = [
  { title: 'Doctor', description: 'Diagnoses and treats medical conditions.', howTo: 'Pass NEET, pursue MBBS/MD.', salary: '₹5-30 LPA', link: 'https://www.google.com/search?q=doctor+career', imageUrl: 'https://www.future-doctor.de/wp-content/uploads/2024/08/shutterstock_2480850611.jpg' },
  //{ title: 'Engineer', description: 'Designs and builds technical solutions.', howTo: 'Pass JEE, complete B.Tech.', salary: '₹4-20 LPA', link: 'https://www.google.com/search?q=engineer+career', imageUrl: 'https://placehold.co/600x400/6a11cb/ffffff?text=Engineer' },
  { title: 'Historian', description: 'Studies and researches past events.', howTo: 'Complete a degree in History.', salary: '₹3-10 LPA', link: 'https://www.google.com/search?q=historian+career', imageUrl: 'https://ps-ja.com/wp-content/uploads/2019/10/historian-900x600.jpg' },
  { title: 'Physicist', description: 'Studies and researches physical phenomena.', howTo: 'Pursue BSc, MSc, and PhD in Physics.', salary: '₹6-20 LPA', link: 'https://www.google.com/search?q=physicist+career', imageUrl: 'https://media.istockphoto.com/id/497130603/photo/man-standing-against-chalkboard-solves-physics-equations-rear-view-retro.jpg?s=612x612&w=0&k=20&c=rfsp68WN9mRt84TKxpnOOP4bfxUYMK3RSS_OnuzlDDA=' },
  { title: 'Mathematician', description: 'Solves mathematical problems.', howTo: 'Pursue a degree in Mathematics.', salary: '₹4-18 LPA', link: 'https://www.google.com/search?q=mathematician+career', imageUrl: 'https://penntoday.upenn.edu/sites/default/files/2020-02/P-100849-Master-V1-004X.jpg' },
  { title: 'Teacher', description: 'Educates and mentors students.', howTo: 'Pursue B.Ed and teaching certifications.', salary: '₹3-10 LPA', link: 'https://www.google.com/search?q=teacher+career', imageUrl: 'https://www.stylemotivation.com/wp-content/uploads/2022/08/download.jpeg' },
  { title: 'Lawyer', description: 'Provides legal advice and representation.', howTo: 'Pass LLB, CLAT or AIBE.', salary: '₹3-25 LPA', link: 'https://www.google.com/search?q=lawyer+career', imageUrl: 'https://media.collegedekho.com/media/img/news/Skills_Reuqired_to_be_a_Successful_Lawyer.png?height=310&width=615' },
  { title: 'Pilot', description: 'Operates and navigates aircraft.', howTo: 'Complete CPL training.', salary: '₹10-60 LPA', link: 'https://www.google.com/search?q=pilot+career', imageUrl: 'https://i0.wp.com/aerocadet.com/blog/wp-content/uploads/2024/03/Good-Airline-Pilot.jpg?fit=826%2C551&ssl=1' },
  { title: 'Chef', description: 'Prepares and presents food.', howTo: 'Attend culinary school.', salary: '₹3-12 LPA', link: 'https://www.google.com/search?q=chef+career', imageUrl: 'https://www.escoffier.edu/wp-content/uploads/2021/08/Confident-smiling-female-chef-holding-two-plates-cooked-food-in-kitchen.jpeg' },
  { title: 'Artist', description: 'Expresses creativity through art.', howTo: 'Develop art skills, pursue MFA.', salary: '₹2-15 LPA', link: 'https://www.google.com/search?q=artist+career', imageUrl: 'https://cdn.prod.website-files.com/65393b768d06ee4c16d24a33/668ec9b6739ea40561c113e2_Artist%20statement%20examples%20crafting%20your%20own%20unique%20narrative.jpg' },
  { title: 'Software Developer', description: 'Builds software applications.', howTo: 'Learn programming and development skills.', salary: '₹5-25 LPA', link: 'https://www.google.com/search?q=software+developer+career', imageUrl: 'https://fsa2-assets.imgix.net/assets/Software-developer-at-computer.jpeg?auto=compress%2Cformat&crop=focalpoint&domain=fsa2-assets.imgix.net&fit=crop&fp-x=0.5&fp-y=0.5&ixlib=php-3.3.1&w=1280' },
  { title: 'Game Developer', description: 'Designs and develops video games.', howTo: 'Learn game engines and programming.', salary: '₹5-30 LPA', link: 'https://www.google.com/search?q=game+developer+career', imageUrl: 'https://www.baker.edu/wp-content/uploads/game-developer-degree.jpg' },
  { title: 'Dentist', description: 'Provides dental care and treatment.', howTo: 'Pass NEET, pursue BDS/MDS.', salary: '₹5-20 LPA', link: 'https://www.google.com/search?q=dentist+career', imageUrl: 'https://southgablesdental.com/wp-content/uploads/2019/06/Different-types-of-dentists.jpg' },
  { title: 'Astronaut', description: 'Explores outer space.', howTo: 'Pursue STEM degree and NASA training.', salary: 'Varies, often $150K+.', link: 'https://www.google.com/search?q=astronaut+career', imageUrl: 'https://thumbs.dreamstime.com/b/astronaut-outer-space-against-backdrop-planet-earth-elements-image-furnished-nasa-48582773.jpg' },
  { title: 'Fashion Designer', description: 'Creates clothing and accessories.', howTo: 'Learn fashion design, attend fashion school.', salary: '₹4-15 LPA', link: 'https://www.google.com/search?q=fashion+designer+career', imageUrl: 'https://www.usnews.com/dims4/USNEWS/845525a/2147483647/thumbnail/640x420/quality/85/?url=https%3A%2F%2Fwww.usnews.com%2Fcmsmedia%2F19%2Fd5%2F36b07e184f6e826424b5aa2687e5%2F201204-fashiondesigner-stock.jpg' },
  { title: 'Psychologist', description: 'Helps people with mental health issues.', howTo: 'Pursue BA/BSc Psychology, MSc, and PhD.', salary: '₹4-20 LPA', link: 'https://www.google.com/search?q=psychologist+career', imageUrl: 'https://medschool.ucla.edu/sites/default/files/styles/3_2_480x320/public/media/images/Difference-Between-Psychologist-and-Psychiatrist.jpg.webp?itok=xm3HSttjv' },
  { title: 'Entrepreneur', description: 'Starts and runs a business.', howTo: 'Learn business skills, MBA recommended.', salary: 'Varies widely.', link: 'https://www.google.com/search?q=entrepreneur+career', imageUrl: 'https://lovinglifeco.com/wp-content/uploads/2023/06/entrepreneur-wellbeing-blog-cover.jpg' },
  { title: 'Cybersecurity Expert', description: 'Secures IT systems and data.', howTo: 'Learn cybersecurity, pursue certifications.', salary: '₹6-25 LPA', link: 'https://www.google.com/search?q=cybersecurity+expert+career', imageUrl: 'https://s44783.pcdn.co/in/wp-content/uploads/sites/3/2022/06/cybersecurity-career.jpg.optimal.jpg' },
  { title: 'Veterinarian', description: 'Treats and cares for animals.', howTo: 'Pursue BVSc, pass entrance exams.', salary: '₹5-15 LPA', link: 'https://www.google.com/search?q=veterinarian+career', imageUrl: 'https://d2zp5xs5cp8zlg.cloudfront.net/image-33625-800.jpg' },
  { title: 'Data Analyst', description: 'Interprets data to inform decisions.', howTo: 'Learn analytics, pursue certifications.', salary: '₹5-15 LPA', link: 'https://www.google.com/search?q=data+analyst+career', imageUrl: 'https://www.smumn.edu/wp-content/uploads/2025/02/data-analyst-working-from-home-office.jpg' },
  { title: 'Content Writer', description: 'Writes and edits content for media.', howTo: 'Learn writing skills, pursue certifications.', salary: '₹3-12 LPA', link: 'https://www.google.com/search?q=content+writer+career', imageUrl: 'https://www.simplilearn.com/ice9/free_resources_article_thumb/How_To_Become_A_Content_Writer.jpg' },
  { title: 'Digital Marketer', description: 'Promotes brands online.', howTo: 'Learn SEO, digital marketing certifications.', salary: '₹4-15 LPA', link: 'https://www.google.com/search?q=digital+marketer+career', imageUrl: 'https://assets.entrepreneur.com/content/3x2/2000/1595357666-GettyImages-1147053827.jpg' },
  { title: 'Journalist', description: 'Reports and writes news stories.', howTo: 'Pursue a degree in Journalism.', salary: '₹3-10 LPA', link: 'https://www.google.com/search?q=journalist+career', imageUrl: 'https://cdn.cpdonline.co.uk/wp-content/uploads/2022/09/27091105/1-feature-image-Becoming-a-journalist-scaled.jpg' },
  { title: 'Nurse', description: 'Provides healthcare and patient support.', howTo: 'Pursue BSc Nursing.', salary: '₹3-12 LPA', link: 'https://www.google.com/search?q=nurse+career', imageUrl: 'https://cdn.prod.website-files.com/5babc11099f97ea5dbcf24d5/66aa498eee2c18e9ed7c04d9_what-is-a-vocational-nurse.jpg' },
  { title: 'Biologist', description: 'Studies living organisms.', howTo: 'Complete MSc or PhD in Biology.', salary: '₹5-20 LPA', link: 'https://www.google.com/search?q=biologist+career', imageUrl: 'https://akm-img-a-in.tosshub.com/sites/resources/campus/prod/img/career/2023/7/africanamericanchemistwomanwritingmedicineexperimentresultsclipboardafteranalyzinggeneticmutationplantsamplemicroscopescientistworkingbiochemistrylaboratory1111383403196.jpg?size=624:351' },
  { title: 'Economist', description: 'Studies and analyses economies.', howTo: 'Pursue BA/BSc, MSc in Economics.', salary: '₹6-25 LPA', link: 'https://www.google.com/search?q=economist+career', imageUrl: 'https://www.investopedia.com/thmb/WebrT7xuDb9TA7hww-uJFUuhsTw=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/GettyImages-150337748-74123b73187746fc80dd7f66b3b9d6ed.jpg' },
  { title: 'Chemist', description: 'Researches chemicals and compounds.', howTo: 'Pursue MSc or PhD in Chemistry.', salary: '₹4-15 LPA', link: 'https://www.google.com/search?q=chemist+career', imageUrl: 'https://capitalresin.com/wp-content/uploads/2023/09/O96s0W9tWSan7PtPulShnGx2Dmk1nOX41693510871-1000x500.jpg' },
  { title: 'Pharmacist', description: 'Prepares and dispenses medicines.', howTo: 'Pursue BPharm or DPharm.', salary: '₹3-10 LPA', link: 'https://www.google.com/search?q=pharmacist+career', imageUrl: 'https://bouve.northeastern.edu/wp-content/uploads/2023/05/what-do-pharmacist-do-northeastern-graduate.webp' },
  { title: 'Translator', description: 'Translates languages for communication.', howTo: 'Learn languages and certifications.', salary: '₹3-10 LPA', link: 'https://www.google.com/search?q=translator+career', imageUrl: 'https://www.talentedladiesclub.com/site/wp-content/uploads/Human-translator-vs-AI-solution-Who-will-win-780x520.jpg' },
  { title: 'Social Worker', description: 'Helps individuals and communities.', howTo: 'Pursue MSW or related degree.', salary: '₹3-10 LPA', link: 'https://www.google.com/search?q=social+worker+career', imageUrl: 'https://onlinesocialwork.vcu.edu/wp-content/uploads/sites/4/2023/12/vcu-msw-blog-disability-social-worker.jpeg' },
  { title: 'Environmentalist', description: 'Protects and advocates for nature.', howTo: 'Pursue Environmental Science.', salary: '₹4-12 LPA', link: 'https://www.google.com/search?q=environmentalist+career', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3uVhCJJFNxNpNB6VuXjTY7ioxeggiIGR0Lw&s' },
  { title: 'Interior Designer', description: 'Designs indoor spaces.', howTo: 'Learn design skills and certifications.', salary: '₹4-20 LPA', link: 'https://www.google.com/search?q=interior+designer+career', imageUrl: 'https://www.wedezinestudio.com/blogs/wp-content/uploads/2025/05/bedroom1-scaled.webp' },
  { title: 'Event Planner', description: 'Organizes and manages events.', howTo: 'Learn event management.', salary: '₹4-15 LPA', link: 'https://www.google.com/search?q=event+planner+career', imageUrl: 'https://aaft.com/blog/wp-content/uploads/2024/03/46268-1024x683.jpg' },
  { title: 'Mechanical Engineer', description: 'Designs and builds machines.', howTo: 'Complete B.Tech or M.Tech.', salary: '₹4-20 LPA', link: 'https://www.google.com/search?q=mechanical+engineer+career', imageUrl: 'https://assets.everspringpartners.com/8d/05/636def57477b9844bd527e843858/mechanical-engineering-on-emerging-technologies.jpg' },
  { title: 'Civil Engineer', description: 'Designs and builds infrastructure.', howTo: 'Pass JEE, pursue B.Tech.', salary: '₹4-18 LPA', link: 'https://www.google.com/search?q=civil+engineer+career', imageUrl: 'https://www.stonewallco.com/hubfs/Construction%20civil%20engineer%20technician%20and%20architect%20working.png' },
  { title: 'AI Engineer', description: 'Develops AI-based solutions.', howTo: 'Learn AI and machine learning.', salary: '₹8-25 LPA', link: 'https://www.google.com/search?q=ai+engineer+career', imageUrl: 'https://images.ctfassets.net/wp1lcwdav1p1/1nYXE4h20tXKjNPrtHwcxs/e13c6a82adb77d21c14361d7145b7369/GettyImages-1363841531_Java_vs_C__.jpg?w=1500&h=680&q=60&fit=fill&f=faces&fm=jpg&fl=progressive' },
  { title: 'Graphic Designer', description: 'Creates visual designs.', howTo: 'Learn graphic design tools and skills.', salary: '₹3-15 LPA', link: 'https://www.google.com/search?q=graphic+designer+career', imageUrl: 'https://www.rmcad.edu/wp-content/uploads/2024/04/shutterstock_434383288.jpg' },
  { title: 'Photographer', description: 'Captures moments with photography.', howTo: 'Learn photography skills.', salary: '₹3-12 LPA', link: 'https://www.google.com/search?q=photographer+career', imageUrl: 'https://t3.ftcdn.net/jpg/02/48/98/86/360_F_248988636_d7C8GzoLO1W6NQ8TJ33kgUkF5SsFI8Cl.jpg' },
  { title: 'Actor', description: 'Performs in movies and plays.', howTo: 'Learn acting skills.', salary: 'Varies widely.', link: 'https://www.google.com/search?q=actor+career', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmWBsWP8cd72Z5MmQ0F47zwtiROunNaUIHJg&s' },
];

export default function CareerOptionsPage() {
  const [showPopup, setShowPopup] = useState(false);
  const [popupData, setPopupData] = useState<Career | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const scrollContainerRef = useRef(null);

  const handleShowPopup = (career: Career) => {
    setPopupData(career);
    setShowPopup(true);
  };

 const handleClosePopup = () => {
    setShowPopup(false);
    setPopupData(null);
  };
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };


 const filteredCareers = careerOptions.filter(career =>
    career.title.toLowerCase().includes(searchQuery.toLowerCase())
 );

  return (
    <div className="bg-[#fefcf5] text-gray-800 font-inter">
    {/* Hero Section Container */}
            <div className="relative min-h-screen">
                {/* Background elements (blobs and shapes) */}
                <div className="bg-[#210440] absolute inset-0 z-0">
                    <div className="absolute -top-10 -left-10 w-96 h-96 bg-[#E5958E] rounded-full  filter  opacity-100 animate-blob"></div>
                    <div className="absolute top-90 right-50 w-80 h-80 bg-[#E5958E] rounded-full  filter opacity-100 animate-blob animation-delay-2000"></div>
                    <div className="absolute top-200 right-20 w-60 h-60 bg-[#E5958E] rounded-full  filter opacity-100 animate-blob animation-delay-2000"></div>
                    <div className="absolute top-0 right-0 w-80 h-80 bg-[#E5958E] rounded-full  filter opacity-100 animate-blob animation-delay-2000"></div>
                    <div className="absolute top-240 right70 w-80 h-80 bg-[#E5958E] rounded-full  filter opacity-100 animate-blob animation-delay-2000"></div>
                </div>

                {/* Navbar */}
                <nav className="bg-[#210440] relative z-10 flex justify-between items-center p-4 md:p-8 max-w-7xl mx-auto">
                    <div className="flex items-center space-x-2">
                        <img src="https://placehold.co/40x40/F1AA9B/white?text=N" alt="Foody Logo" className="rounded-full"/>
                        <span className="text-2xl font-bold text-[#F1AA9B]">NXTSTEP</span>
                    </div>
                    <div className="hidden md:flex items-center space-x-6">
                        <a href="#" className="font-medium text-[#F1AA9B] hover:text-orange-500 transition-colors">Home</a>
                        <a href="#" className="font-medium text-[#F1AA9B] hover:text-orange-500 transition-colors">About</a>
                        <a href="#" className="font-medium text-[#F1AA9B] hover:text-orange-500 transition-colors">Form</a>
                        <a href="#" className="font-medium text-[#F1AA9B] hover:text-orange-500 transition-colors">Options</a>
                        <a href="#" className="font-medium text-[#F1AA9B] hover:text-orange-500 transition-colors">Services</a>
                        <a href="#" className="font-medium text-[#F1AA9B] hover:text-orange-500 transition-colors">S</a>
                    </div>
                    <div className="flex items-center space-x-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white cursor-pointer hover:text-gray-300 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                        type="text"
                        id="searchBar"
                        placeholder="Search career options..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full sm:w-auto p-2 text-base rounded-l-md focus:outline-none focus:ring-2 focus:[#310E10] text-[#F5EFEB]"
                        />

                        <button onClick={() => {}} className="px-4 py-2 border border-white text-white text-sm font-semibold rounded-full hover:bg-[#F1AA9B] transition-colors hidden sm:block">Sign in</button>
                    </div>
                </nav>

                {/* Main content area */}
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto px-4 mt-12 md:mt-24">
                    {/* Left content (Text) */}
                    <div className="w-full md:w-1/2 text-center md:text-left mb-10 md:mb-0">
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl  leading-tight text-white mb-6">
                            <span className=" text-[#F1AA9B] font-extrabold ">Choose Path</span> for Yourself <span className=" text-[#F1AA9B] font-extrabold">with NXTSTEP</span> 
                        </h1>
                        <p className="text-lg text-[#a3736a] mb-8 max-w-md mx-auto md:mx-0">
                            Discover your ideal career path with NXTSTEP. Explore diverse options, find your passion, and take the first step towards a fulfilling future.
                        </p>
                        <div className="flex items-center justify-center md:justify-start space-x-4">
                          <input
                        type="text"
                        id="searchBar"
                        placeholder="Search career options..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full sm:w-auto p-2 text-base rounded-l-md focus:outline-none focus:ring-2 focus:[#310E10] text-[#F5EFEB]"
                        />

                            <button onClick={() => {}} className="px-6 py-3 bg-[#FFBA00] text-white font-bold rounded-full shadow-lg hover:bg-[#6f5202] transition-colors transform hover:scale-105">
                                Explore Now
                            </button>
                            
                        </div>
                    </div>
                    {/* Right content (Image and info cards) */}
                    <div className="relative w-full md:w-1/2 flex justify-center mt-8 md:mt-0">
                        <img src="https://quizizz.com/media/resource/gs/quizizz-media/quizzes/251274e8-7340-40cf-bbca-ac2d588123d8" alt="Career" className="w-full max-w-md rounded-full shadow-2xl relative z-10"/>
                        
  
                        {/* Info cards */}
                        <div className="absolute top-1/2 -left-10 transform -translate-y-1/2 bg-white/70 backdrop-blur-md rounded-2xl p-4 shadow-lg flex flex-col space-y-4 z-20 hidden lg:flex">
                            <div className="flex items-center space-x-4">
                                <div className="p-3 bg-orange-100 rounded-full">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-bold"></p>
                                    <p className="text-sm text-gray-600"></p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <div className="p-3 bg-green-100 rounded-full">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c1.657 0 3 .895 3 2s-1.343 2-3 2-3-.895-3-2 1.343-2 3-2zM8 20h8a2 2 0 002-2V6a2 2 0 00-2-2H8a2 2 0 00-2 2v12a2 2 0 002 2zM9 16h6v-2H9v2z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-bold"></p>
                                    <p className="text-sm text-gray-600"></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            <div className="max-w-7xl mx-auto py-10">
              <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-4 text-[#F1AA9B]"> Future-Proof Careers</h1>
              <p className="text-center text-lg md:text-xl text-[#F1AA9B] mb-12">
                Explore high-growth careers in technology and innovation.
              </p>

                {/* cards section */}
              <div className="relative mt-10">
                <div className="absolute top-1/2 left-0 right-0 z-10 flex justify-between transform -translate-y-1/2 px-4 md:px-0">
                {/* Navigation arrows */}
                  <button
                    onClick={scrollLeft}
                    className="p-3 bg-[#f59683] rounded-full shadow-lg border border-[#F1AA9B] hover:bg-[#f59683] transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#f36e54]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={scrollRight}
                    className="p-3 bg-[#f59683] rounded-full shadow-lg border border-[#F1AA9B] hover:bg-[#f59683] transition-colors"
                  >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#f36e54]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                 </button>
                </div>
                    
              <div
                ref={scrollContainerRef}
                className="grid grid-flow-col auto-cols-[85%] sm:auto-cols-[45%] md:auto-cols-[30%] gap-6 py-19 overflow-x-auto scrollable-container scroll-smooth"
              >    {/* Card 1 */}
                {filteredCareers.map((career) => (
                <div
                  key={career.title}
                  className="career-box bg-white text-center rounded-xl shadow-lg cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-2xl hover:bg-gradient-to-br from-[#F1AA9B] to-[#C8D9E6] hover:text-white flex flex-col overflow-hidden"
                  onClick={() => handleShowPopup(career)}
                >
                  <img src={career.imageUrl} alt={career.title} className="w-full h-70 object-cover rounded-t-xl" />
                  <div className="bg-[#F1AA9B] p-4 flex-grow flex items-center justify-center">
                    <h3 className="font-semibold text-lg text-white">{career.title}</h3>
                  </div>
                </div>
                ))}
              </div>
             </div>
            </div>
                        
            {showPopup && popupData && (
            <>
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
                <div className="bg-white rounded-xl shadow-xl w-11/12 md:w-1/2 lg:w-1/3 p-6 text-[#2F4156] relative">
                  <button onClick={handleClosePopup} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <h2 className="text-2xl font-bold mb-2 text-[#F1AA9B]">{popupData.title}</h2>
                  <p className="mb-4 text-gray-700">{popupData.description}</p>
                  <div className="space-y-4 text-sm">
                    <p>
                      <strong className="text-[#2F4156]">How to Pursue:</strong> {popupData.howTo}
                    </p>
                    <p>
                      <strong className="text-[#2F4156]">Salary Range:</strong> {popupData.salary}
                    </p>
                    <a
                      href={popupData.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#F1AA9B] hover:underline block mt-4 font-semibold"
                    >
                     To know more, click here
                    </a>
                  </div>
                </div>
              </div>
              </>
            )}
                
            
        </div>
    </div>
    );
}

{/* export default CareerOptionsPage; */}

