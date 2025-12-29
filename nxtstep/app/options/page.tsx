'use client';

import Link from 'next/link';
import React, { useState, useRef, useEffect } from 'react';
import { Search, Zap, Target, ArrowRight, ExternalLink, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { RevealOnScroll } from '../components/reveal';

import { auth, db } from "@/lib/firebase"; 
import { doc, setDoc, arrayUnion, arrayRemove, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { careerOptions, Career } from '../components/data'; 
import { TiltCard } from '../components/tilteffect';

export default function CareerOptionsPage() {
  const [mounted, setMounted] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupData, setPopupData] = useState<Career | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const [saved, setSaved] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userRef = doc(db, "users", currentUser.uid);
        const unsubscribeDoc = onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) {
            // Listen to 'likedCareers' to match Dashboard
            setSaved(docSnap.data().likedCareers || []);
          }
        });
        return () => unsubscribeDoc();
      } else {
        setSaved([]); 
      }
    });
    return () => unsubscribeAuth();
  }, []);

  if (!mounted) return null;

  const toggleSave = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation(); 
    if (!user) {
      alert("Please log in to save careers!");
      return;
    }

    const userRef = doc(db, "users", user.uid);
    // Safe string comparison for UI logic
    const isCurrentlyLiked = saved.some(savedId => String(savedId) === String(id));

    try {
      // FIX: Use setDoc with merge: true to avoid "No document to update" error
      await setDoc(userRef, {
        likedCareers: isCurrentlyLiked ? arrayRemove(id) : arrayUnion(id)
      }, { merge: true });
      
    } catch (error) {
      console.error("Error updating saved careers:", error);
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

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
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
              {/* 5. CARD: Added dark:border-slate-700 and dark shadow */}
              <div className="relative h-[400px] rounded-[32px] overflow-hidden border-4 border-slate-900 dark:border-slate-700 shadow-[12px_12px_0px_0px_rgba(15,23,42,1)] dark:shadow-[12px_12px_0px_0px_rgba(255,255,255,0.1)] transition-all group-hover:-translate-y-2 group-hover:shadow-[16px_16px_0px_0px_rgba(234,88,12,1)] dark:group-hover:shadow-[16px_16px_0px_0px_rgba(234,88,12,0.8)]">
                <img src={career.imageUrl} alt={career.title} className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-500" />
                
                {/* Overlay Content */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-90"></div>
                
                <button 
                  onClick={(e) => toggleSave(e, career.id)}
                  className="absolute top-6 right-6 p-3 bg-white dark:bg-slate-900 rounded-xl border-2 border-slate-900 dark:border-white shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] dark:shadow-none hover:scale-110 transition z-20"
                >
                  <Heart size={20} fill={saved.includes(career.id) ? "#ea580c" : "none"} color={saved.includes(career.id) ? "#ea580c" : "currentColor"} className="text-slate-900 dark:text-white" />
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
        </TiltCard>
        </RevealOnScroll>
      </section>

      {/* --- POPUP MODAL --- */}
      {showPopup && popupData && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
          <TiltCard>
          {/* 6. MODAL CONTAINER: Added dark:bg-slate-950 and dark:border-slate-700 */}
          <div className="bg-white dark:bg-slate-950 rounded-[40px] border-4 border-slate-900 dark:border-slate-700 w-full max-w-2xl overflow-hidden shadow-[20px_20px_0px_0px_rgba(234,88,12,1)] dark:shadow-[20px_20px_0px_0px_rgba(234,88,12,0.5)] relative animate-in fade-in zoom-in duration-300">
            <button onClick={handleClosePopup} className="absolute top-6 right-6 z-10 p-2 hover:rotate-90 transition-transform bg-white/50 dark:bg-black/50 rounded-full">
              <Zap size={32} className="text-slate-900 dark:text-white fill-orange-500" />
            </button>

            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/3 h-48 md:h-auto">
                <img src={popupData.imageUrl} className="w-full h-full object-cover border-r-4 border-slate-900 dark:border-slate-700" />
              </div>
              <div className="p-10 md:w-2/3">
                <h2 className="text-5xl font-black uppercase italic tracking-tighter mb-4 text-slate-900 dark:text-white">{popupData.title}</h2>
                <p className="text-slate-600 dark:text-slate-300 font-medium mb-8 leading-relaxed italic border-l-4 border-orange-500 pl-4">"{popupData.description}"</p>
                
                <div className="space-y-6 mb-10">
                  <div>
                    <span className="text-xs font-black uppercase tracking-widest text-orange-600">How to Pursue</span>
                    <p className="font-bold text-slate-900 dark:text-white">{popupData.howTo}</p>
                  </div>
                  <div>
                    <span className="text-xs font-black uppercase tracking-widest text-orange-600">Expected Salary</span>
                    <p className="font-bold text-slate-900 dark:text-white text-2xl">{popupData.salary}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <a href={popupData.link} target="_blank" className="flex-grow bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-center py-4 rounded-2xl font-black uppercase italic tracking-widest flex items-center justify-center gap-2 hover:bg-orange-600 dark:hover:bg-orange-600 dark:hover:text-white transition">
                    Explore Roadmap <ExternalLink size={18} />
                  </a>
                  <button 
                    onClick={(e) => toggleSave(e, popupData.id)}
                    className="px-6 border-4 border-slate-900 dark:border-slate-700 rounded-2xl flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-900 transition"
                  >
                    <Heart size={24} fill={saved.includes(popupData.id) ? "#ea580c" : "none"} color={saved.includes(popupData.id) ? "#ea580c" : "currentColor"} className="text-slate-900 dark:text-white" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          </TiltCard>
        </div>
      )}
    </div>
  );
}