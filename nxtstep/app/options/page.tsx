'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Zap, Target, ExternalLink, Heart, ChevronLeft, ChevronRight, Globe, Briefcase, Sparkles, AlertCircle } from 'lucide-react';
import { RevealOnScroll } from '../components/reveal';

import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { careerOptions, Career } from '../components/data';
import { TiltCard } from '../components/tilteffect';
import ConfirmModal from '../components/ConfirmModal';

export default function CareerOptionsPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [popupData, setPopupData] = useState<Career | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [savedIds, setSavedIds] = useState<number[]>([]);
  const [user, setUser] = useState<{ uid: string; getIdToken: () => Promise<string> } | null>(null);

  useEffect(() => {
    setMounted(true);
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // Load saved careers from Supabase
        try {
          const token = await currentUser.getIdToken();
          const res = await fetch('/api/user/career', {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            const data = await res.json() as { savedCareers: Array<{ career_id: number }> };
            setSavedIds((data.savedCareers ?? []).map((c) => c.career_id));
          }
        } catch {
          // Ignore — will just show empty saved state
        }
      } else {
        setUser(null);
        setSavedIds([]);
      }
    });
    return () => unsub();
  }, []);

  if (!mounted) return null;

  const toggleSave = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    const isSaved = savedIds.includes(id);
    const career = careerOptions.find((c) => c.id === id);

    // Optimistic UI
    setSavedIds((prev) => isSaved ? prev.filter((i) => i !== id) : [...prev, id]);

    try {
      const token = await user.getIdToken();
      await fetch('/api/user/career', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          careerId: id,
          careerTitle: career?.title ?? String(id),
          action: isSaved ? 'unsave' : 'save',
        }),
      });
    } catch (error) {
      console.error("Error updating saved careers:", error);
      // Revert
      setSavedIds((prev) => isSaved ? [...prev, id] : prev.filter((i) => i !== id));
    }
  };

  const handleShowPopup = (career: Career) => {
    setPopupData(career);
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setPopupData(null);
  };

  const [scrollProgress, setScrollProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftPos, setScrollLeftPos] = useState(0);
  const hasDraggedRef = useRef(false);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -420 : 420;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      const maxScroll = scrollWidth - clientWidth;
      if (maxScroll > 0) {
        setScrollProgress(Math.round((scrollLeft / maxScroll) * 100));
      }
    }
  };

  // Convert vertical mouse wheel into horizontal carousel scroll
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (scrollContainerRef.current) {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        scrollContainerRef.current.scrollLeft += e.deltaY * 1.5;
      }
    }
  };

  // Mouse drag-to-scroll
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    hasDraggedRef.current = false;
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeftPos(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 1.6;
    if (Math.abs(walk) > 6) {
      hasDraggedRef.current = true;
    }
    scrollContainerRef.current.scrollLeft = scrollLeftPos - walk;
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  const filteredCareers = careerOptions.filter(career =>
    career.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    // 1. MAIN CONTAINER: Added dark:bg-slate-950 and dark:text-white
    <div className="min-h-screen bg-white dark:bg-slate-950 font-sans text-slate-900 dark:text-white transition-colors duration-300">

      {/* --- HERO / SEARCH SECTION --- */}
      {/* 2. HERO HEADER: Changed bg-slate-50 to dark:bg-slate-900 */}
      <header className="bg-slate-50 dark:bg-slate-900 py-20 px-8 relative overflow-hidden border-b-4 border-transparent dark:border-slate-800 transition-colors duration-300">
        <RevealOnScroll>
        <div className="max-w-6xl mx-auto relative z-10 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 text-orange-600 font-bold text-sm uppercase tracking-widest mb-4">
            <Target size={18} fill="currentColor" />
            <span>Discover Your Calling</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black leading-[0.9] mb-8 tracking-tighter uppercase italic text-slate-900 dark:text-white">
            Catch Your <br /> 
            <span className="text-orange-600">Future Wave*</span>
          </h1>
          
          <div className="flex flex-col md:flex-row gap-4 mt-12 max-w-2xl">
            <div className="relative flex-grow">
              <TiltCard>
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              {/* 3. SEARCH INPUT: Added dark:bg-slate-950, dark:text-white, dark:border-slate-700 */}
              <input
                type="text"
                placeholder="Search careers (e.g. Designer, Pilot...)"
                className="w-full bg-white dark:bg-slate-950 border-4 border-slate-900 dark:border-slate-700 p-5 pl-12 rounded-2xl font-bold text-lg text-slate-900 dark:text-white focus:outline-none focus:ring-8 focus:ring-orange-100 dark:focus:ring-orange-900 transition shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.5)]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              </TiltCard>
            </div>
          </div>
        </div>
        {/* Background Decorative Text */}
        <div className="absolute -bottom-10 right-0 opacity-[0.04] dark:opacity-[0.05] select-none pointer-events-none dark:text-white">
          <h2 className="text-[250px] font-black italic whitespace-nowrap leading-none">EXPLORE</h2>
        </div>
        </RevealOnScroll>
      </header>

      {/* --- CAREER CAROUSEL SECTION --- */}
      <section className="py-24 px-8 max-w-[1400px] mx-auto">
        <RevealOnScroll>
          <TiltCard>
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-4xl font-black uppercase italic tracking-tighter">Future-Proof Paths</h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium mt-2 italic">Hand-picked by AI based on market growth.</p>
          </div>
          <div className="flex gap-4">
            {/* 4. SCROLL BUTTONS: Added dark:bg-slate-900 and dark:text-white */}
            <button onClick={() => scroll('left')} className="p-4 border-2 border-slate-900 dark:border-slate-700 rounded-xl hover:bg-orange-600 hover:text-white dark:text-white dark:hover:bg-orange-600 transition shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.5)]">
              <ChevronLeft size={24} />
            </button>
            <button onClick={() => scroll('right')} className="p-4 border-2 border-slate-900 dark:border-slate-700 rounded-xl hover:bg-orange-600 hover:text-white dark:text-white dark:hover:bg-orange-600 transition shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.5)]">
              <ChevronRight size={24} />
            </button>
          </div>
        </div>

        {filteredCareers.length > 0 ? (
          <div className="relative group/carousel">
            {/* Floating Left Arrow */}
            <button
              onClick={() => scroll('left')}
              className="hidden md:flex absolute -left-5 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-white dark:bg-slate-900 border-4 border-slate-900 dark:border-slate-700 rounded-2xl items-center justify-center text-slate-900 dark:text-white hover:bg-orange-600 hover:text-white shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] transition-all hover:scale-110 active:translate-y-0 opacity-80 group-hover/carousel:opacity-100"
              aria-label="Scroll left"
            >
              <ChevronLeft size={24} />
            </button>

            {/* Floating Right Arrow */}
            <button
              onClick={() => scroll('right')}
              className="hidden md:flex absolute -right-5 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-white dark:bg-slate-900 border-4 border-slate-900 dark:border-slate-700 rounded-2xl items-center justify-center text-slate-900 dark:text-white hover:bg-orange-600 hover:text-white shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] transition-all hover:scale-110 active:translate-y-0 opacity-80 group-hover/carousel:opacity-100"
              aria-label="Scroll right"
            >
              <ChevronRight size={24} />
            </button>

            {/* Carousel Container */}
            <div 
              ref={scrollContainerRef}
              onScroll={handleScroll}
              onWheel={handleWheel}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUpOrLeave}
              onMouseLeave={handleMouseUpOrLeave}
              className="flex gap-8 overflow-x-auto pb-8 pt-2 scroll-smooth no-scrollbar cursor-grab active:cursor-grabbing select-none"
            >
              {filteredCareers.map((career) => (
                <div
                  key={career.id}
                  onClick={() => {
                    if (!hasDraggedRef.current) handleShowPopup(career);
                  }}
                  className="min-w-[320px] md:min-w-[380px] group cursor-pointer flex-shrink-0"
                >
                  {/* 5. CARD: Added dark:border-slate-700 and dark shadow */}
                  <div className="relative h-[400px] rounded-[32px] overflow-hidden border-4 border-slate-900 dark:border-slate-700 shadow-[12px_12px_0px_0px_rgba(15,23,42,1)] dark:shadow-[12px_12px_0px_0px_rgba(255,255,255,0.1)] transition-all group-hover:-translate-y-2 group-hover:shadow-[16px_16px_0px_0px_rgba(234,88,12,1)] dark:group-hover:shadow-[16px_16px_0px_0px_rgba(234,88,12,0.8)]">
                    <img src={career.imageUrl} alt={career.title} className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-500 pointer-events-none" />
                    
                    {/* Overlay Content */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-90"></div>
                    
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSave(e, career.id);
                      }}
                      className="absolute top-6 right-6 p-3 bg-white dark:bg-slate-900 rounded-xl border-2 border-slate-900 dark:border-white shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] dark:shadow-none hover:scale-110 transition z-20"
                    >
                    <Heart size={20} fill={savedIds.includes(career.id) ? "#ea580c" : "none"} color={savedIds.includes(career.id) ? "#ea580c" : "currentColor"} className="text-slate-900 dark:text-white" />
                    </button>

                    <div className="absolute bottom-8 left-8 right-8">
                      <span className="bg-orange-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-3 inline-block shadow-md">
                        {career.marketInsights?.demandLevel ? `${career.marketInsights.demandLevel} Demand` : "High Growth"} {career.marketInsights?.growthRate ? `• ${career.marketInsights.growthRate}` : ""}
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

            {/* Interactive Scroll Progress Indicator */}
            <div className="mt-4 flex items-center justify-between gap-6 px-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400 dark:text-slate-500">
                <span className="hidden sm:inline">Tip: Scroll with mouse wheel or drag to swipe</span>
              </div>
              
              <div className="flex-1 max-w-sm bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-orange-600 h-full rounded-full transition-all duration-150"
                  style={{ width: `${Math.max(scrollProgress, 6)}%` }}
                />
              </div>

              <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                {filteredCareers.length} Paths Available
              </span>
            </div>
          </div>
        ) : (
          <div className="border-4 border-slate-900 dark:border-slate-700 rounded-[32px] p-8 md:p-12 bg-orange-50/70 dark:bg-slate-900/90 shadow-[12px_12px_0px_0px_rgba(234,88,12,1)] dark:shadow-[12px_12px_0px_0px_rgba(234,88,12,0.4)] text-center max-w-3xl mx-auto my-4">
            <div className="w-16 h-16 bg-orange-100 dark:bg-slate-800 rounded-2xl border-4 border-orange-500 flex items-center justify-center mx-auto mb-4 text-orange-600">
              <Search size={32} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-orange-700 dark:text-orange-300 bg-orange-200 dark:bg-orange-950 px-3.5 py-1 rounded-full border border-orange-400 dark:border-orange-800 inline-block mb-3">
              Not Found in Database
            </span>
            <h3 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter text-slate-900 dark:text-white mb-3">
              "{searchQuery}" is not in our database
            </h3>
            <p className="text-slate-600 dark:text-slate-300 font-medium text-sm md:text-base max-w-xl mx-auto mb-8 leading-relaxed">
              We couldn't find <strong className="text-orange-600 font-bold">"{searchQuery}"</strong> in our indexed catalog yet. Don't worry! You can search live career roadmaps, requirements, and hiring trends directly on Google, or take our AI diagnostic quiz.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href={`https://www.google.com/search?q=${encodeURIComponent(searchQuery + " career roadmap salary skills requirements")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 px-6 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black uppercase italic tracking-wider text-xs md:text-sm hover:bg-orange-600 dark:hover:bg-orange-600 dark:hover:text-white transition shadow-[4px_4px_0px_0px_rgba(234,88,12,1)] active:translate-y-0.5"
              >
                <Globe size={18} /> Search "{searchQuery}" on Google <ExternalLink size={14} />
              </a>
              <a
                href={`https://www.google.com/search?q=${encodeURIComponent(searchQuery + " jobs hiring")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 px-6 py-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-2 border-slate-900 dark:border-slate-700 rounded-2xl font-black uppercase italic tracking-wider text-xs md:text-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition"
              >
                <Briefcase size={18} /> Google Jobs <ExternalLink size={14} />
              </a>
              <a
                href="/quiz"
                className="flex items-center gap-2.5 px-6 py-4 bg-orange-600 text-white rounded-2xl font-black uppercase italic tracking-wider text-xs md:text-sm hover:bg-orange-700 transition shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]"
              >
                <Sparkles size={18} /> Take AI Quiz
              </a>
            </div>
          </div>
        )}
        </TiltCard>
        </RevealOnScroll>
      </section>

      {/* --- POPUP MODAL --- */}
      {showPopup && popupData && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
          <TiltCard>
          {/* 6. MODAL CONTAINER: Added dark:bg-slate-950 and dark:border-slate-700 */}
          <div className="bg-white dark:bg-slate-950 rounded-[40px] border-4 border-slate-900 dark:border-slate-700 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-[20px_20px_0px_0px_rgba(234,88,12,1)] dark:shadow-[20px_20px_0px_0px_rgba(234,88,12,0.5)] relative animate-in fade-in zoom-in duration-300">
            <button onClick={handleClosePopup} className="absolute top-6 right-6 z-10 p-2 hover:rotate-90 transition-transform bg-white/50 dark:bg-black/50 rounded-full">
              <Zap size={32} className="text-slate-900 dark:text-white fill-orange-500" />
            </button>

            <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
              <div className="md:w-1/3 h-48 md:h-auto flex-shrink-0">
                <img src={popupData.imageUrl} className="w-full h-full object-cover border-b-4 md:border-b-0 md:border-r-4 border-slate-900 dark:border-slate-700" />
              </div>
              <div className="p-8 md:p-10 md:w-2/3 overflow-y-auto custom-scrollbar">
                <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter mb-4 text-slate-900 dark:text-white">{popupData.title}</h2>
                <p className="text-slate-600 dark:text-slate-300 font-medium mb-8 leading-relaxed italic border-l-4 border-orange-500 pl-4">"{popupData.description}"</p>
                
                <div className="space-y-4 mb-8">
                  <div>
                    <span className="text-xs font-black uppercase tracking-widest text-orange-600">How to Pursue</span>
                    <ul className="mt-2 space-y-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
                      {popupData.pursuitSteps?.map((step: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-orange-600 font-black">{idx + 1}.</span>
                          <span>{step}</span>
                        </li>
                      )) || <p className="font-bold text-slate-900 dark:text-white">{popupData.howTo}</p>}
                    </ul>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-200 dark:border-slate-800">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-orange-600">Expected Salary</span>
                      <p className="font-black text-slate-900 dark:text-white text-lg">{popupData.salary}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-orange-600">Market Demand</span>
                      <p className="font-bold text-slate-900 dark:text-white text-sm">
                        {popupData.marketInsights?.demandLevel || "High Growth"} ({popupData.marketInsights?.growthRate || "+25% YoY"})
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <a href={popupData.link} target="_blank" rel="noopener noreferrer" className="flex-1 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-center py-4 px-4 rounded-2xl font-black uppercase italic tracking-widest flex items-center justify-center gap-2 hover:bg-orange-600 dark:hover:bg-orange-600 dark:hover:text-white transition text-xs md:text-sm">
                    Explore Roadmap <ExternalLink size={16} />
                  </a>
                  <a
                    href={`https://www.google.com/search?q=${encodeURIComponent(popupData.title + " career roadmap salary skills")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border-2 border-slate-900 dark:border-slate-700 rounded-2xl flex items-center justify-center hover:bg-orange-100 dark:hover:bg-orange-950 transition text-xs font-black uppercase"
                    title="Search on Google"
                  >
                    <Globe size={18} />
                  </a>
                  <button 
                    onClick={(e) => toggleSave(e, popupData.id)}
                    className="px-5 border-4 border-slate-900 dark:border-slate-700 rounded-2xl flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-900 transition"
                  >
                    <Heart size={22} fill={savedIds.includes(popupData.id) ? "#ea580c" : "none"} color={savedIds.includes(popupData.id) ? "#ea580c" : "currentColor"} className="text-slate-900 dark:text-white" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          </TiltCard>
        </div>
      )}

      {/* ── Login Required Modal ───────────────────────────────────────────── */}
      <ConfirmModal
        isOpen={showAuthModal}
        type="auth"
        title="Account Required"
        description="Please log in or sign up to save careers to your favorites, track roadmaps, and monitor your milestone progress."
        confirmText="Log In Now"
        cancelText="Continue Browsing"
        onConfirm={() => router.push('/login')}
        onCancel={() => setShowAuthModal(false)}
      />
    </div>
  );
}