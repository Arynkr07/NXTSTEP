"use client";
import { 
  Map, Zap, RefreshCcw, ArrowRight, CheckCircle, 
  Mail, Phone, MapPin, Globe, Linkedin, Twitter 
} from 'lucide-react';
import Link from 'next/link';
// Just import the tools you need
import { auth, db } from "@/lib/firebase"; 
import React, { useEffect, useState } from 'react';
import { onAuthStateChanged } from "firebase/auth";
import Navbar from '../components/navbar';
import ContactForm from '../components/contact';


// Now use them



const UpgradedLandingPage = () => {
  const user = auth.currentUser;
const [isLoggedIn, setIsLoggedIn] = useState(false);
// 1. HANDLE AUTHENTICATION STATE
  useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    setIsLoggedIn(!!user);
  });
  return () => unsubscribe();
}, []);
  return (
    <div className="bg-white font-sans text-slate-900">
      
      {/* --- 1. NAVIGATION BAR --- */}
      <Navbar />

      {/* --- 2. HOW IT WORKS (Upgraded with Course Suggestions) --- */}
      <section className="py-24 px-8 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-6xl font-black uppercase italic tracking-tighter mb-4">
            The NxtStep <span className="text-orange-600">Method*</span>
          </h2>
          <p className="text-slate-500 font-bold italic">Stop searching. Start mastering.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          {/* Card 1 */}
          <div className="bg-yellow-50 border-4 border-slate-900 p-8 rounded-[40px] shadow-[12px_12px_0px_0px_rgba(15,23,42,1)]">
            <div className="bg-white border-2 border-slate-900 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
              <Map className="text-orange-600" size={32} />
            </div>
            <h3 className="text-2xl font-black uppercase italic mb-4">AI Guidance</h3>
            <p className="text-slate-600 text-sm font-bold leading-relaxed mb-6">
              Our neural engine maps your career goal into a visual "Skill Tree" based on live market demand.
            </p>
            <div className="bg-white border-2 border-slate-900 p-4 rounded-xl italic text-xs font-bold text-slate-400">
              "AI just updated the 'Cybersecurity' path with 4 new modules."
            </div>
          </div>

          {/* Card 2 - Course Logic */}
          <div className="bg-orange-50 border-4 border-slate-900 p-8 rounded-[40px] shadow-[12px_12px_0px_0px_rgba(15,23,42,1)] scale-105 z-10">
            <div className="bg-white border-2 border-slate-900 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
              <Zap className="text-orange-600" size={32} />
            </div>
            <h3 className="text-2xl font-black uppercase italic mb-4">Course Curations</h3>
            <p className="text-slate-600 text-sm font-bold leading-relaxed mb-6">
              No more expensive debt. AI finds the #1 Free YouTube courses and Premium certifications for every node.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 bg-green-100 p-2 rounded-lg border border-green-300 text-[10px] font-black uppercase">
                <CheckCircle size={14} className="text-green-600" /> Free: CS50 Harvard
              </div>
              <div className="flex items-center gap-2 bg-blue-100 p-2 rounded-lg border border-blue-300 text-[10px] font-black uppercase">
                <CheckCircle size={14} className="text-blue-600" /> Paid: Meta Professional Cert
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-blue-50 border-4 border-slate-900 p-8 rounded-[40px] shadow-[12px_12px_0px_0px_rgba(15,23,42,1)]">
            <div className="bg-white border-2 border-slate-900 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
              <RefreshCcw className="text-orange-600" size={32} />
            </div>
            <h3 className="text-2xl font-black uppercase italic mb-4">Skill Pivot</h3>
            <p className="text-slate-600 text-sm font-bold leading-relaxed mb-6">
              Switching fields? We calculate your "Compatibility Score" so you never have to start from zero.
            </p>
            {/* <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden border border-slate-900">
               <div className="bg-orange-600 h-full w-[75%]"></div>
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-2 block">75% Transferable Skills Found</span> */}
          </div>
        </div>
      </section>

      {/* --- SECTION 2: INTERACTIVE ANATOMY (The Roadmap Preview) --- */}
      <section className="bg-slate-900 py-24 px-8 text-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-6xl font-black uppercase italic tracking-tighter leading-none mb-8">
              Your Career is a <br />
              <span className="text-orange-500 underline decoration-4 underline-offset-8">Quest.</span> <br />
              Here is the Map.
            </h2>
            <p className="text-slate-400 text-lg mb-10 max-w-md italic">
              We break down complex career goals into manageable "Level-Ups." Track your progress, earn XP, and master your future.
            </p>
            <ul className="space-y-4">
              {['Foundations', 'Core Specialization', 'Expert Tools'].map((step, i) => (
                <li key={i} className="flex items-center gap-3 font-bold uppercase tracking-widest text-sm">
                  <CheckCircle className="text-orange-500" size={20} /> {step}
                </li>
              ))}
            </ul>
          </div>

          {/* ROADMAP PREVIEW GRAPHIC */}
          <div className="relative border-4 border-white rounded-[40px] p-10 bg-slate-800 shadow-2xl overflow-hidden">
            <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-white/20 -translate-x-1/2"></div>
            <div className="space-y-12 relative">
              <div className="bg-yellow-300 text-slate-900 p-4 rounded-xl border-2 border-slate-900 w-2/3 ml-auto font-black italic shadow-[4px_4px_0px_0px_white]">
                Step 01: Basics
              </div>
              <div className="bg-orange-500 text-white p-4 rounded-xl border-2 border-white w-2/3 mr-auto font-black italic shadow-[4px_4px_0px_0px_white]">
                Step 02: Core Skill
              </div>
              <div className="bg-yellow-300 text-slate-900 p-4 rounded-xl border-2 border-slate-900 w-2/3 ml-auto font-black italic shadow-[4px_4px_0px_0px_white]">
                Step 03: Expert Tools
              </div>
              <div className="bg-orange-500 text-white p-4 rounded-xl border-2 border-white w-2/3 mr-auto font-black italic shadow-[4px_4px_0px_0px_white]">
                Step 04: Real-World Project
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- SECTION 3: STATS TICKER --- */}
      <div className="bg-orange-600 py-6 border-y-4 border-slate-900 overflow-hidden whitespace-nowrap">
        <div className="flex gap-12 items-center text-white font-black uppercase italic text-2xl tracking-tighter animate-pulse">
          <span>12,000+ ROADMAPS GENERATED</span>
          <span className="w-3 h-3 bg-white rounded-full"></span>
          <span>85% CAREER CONFIDENCE RATE</span>
          <span className="w-3 h-3 bg-white rounded-full"></span>
          <span>500+ FREE RESOURCES CURATED</span>
          <span className="w-3 h-3 bg-white rounded-full"></span>
          <span>LIVE AI MENTORSHIP</span>
        </div>
      </div>

      {/* --- 3. TESTIMONIALS SECTION --- */}
      <section className="py-24 bg-slate-50 border-y-4 border-slate-900">
        <div className="max-w-7xl mx-auto px-8">
           <h2 className="text-4xl font-black uppercase italic tracking-tighter mb-12 text-center">Trusted by <span className="text-orange-600">Future Leaders*</span></h2>
           <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white border-4 border-slate-900 p-8 rounded-3xl shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] italic">
                "The AI-generated roadmap for UX Design saved me months of research. I knew exactly which free courses to take first."
                <p className="mt-4 font-black uppercase tracking-widest text-orange-600">— Rahul, Student @ IIT</p>
              </div>
              <div className="bg-white border-4 border-slate-900 p-8 rounded-3xl shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] italic">
                "The mini-challenges are genius. I thought I wanted to be a lawyer until the AI gave me a 5-minute case simulation."
                <p className="mt-4 font-black uppercase tracking-widest text-orange-600">— Priya, Delhi University</p>
              </div>
           </div>
        </div>
      </section>
      {/* --- SECTION 4: FINAL CTA --- */}
      <section className="py-24 px-8 text-center bg-white relative">
        <div className="max-w-4xl mx-auto border-8 border-slate-900 p-16 rounded-[60px] relative z-10 bg-white">
          <h2 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter leading-[0.85] mb-8">
            Catch Your <br />
            <span className="text-orange-600">Next Wave*</span>
          </h2>
          <p className="text-xl text-slate-500 font-bold mb-10 italic">
            Don't leave your future to chance. Let AI map your path.
          </p>
          <Link href="/quiz" className="bg-slate-900 text-white px-12 py-6 rounded-2xl font-black uppercase italic tracking-widest text-xl flex items-center gap-4 mx-auto hover:bg-orange-600 transition shadow-2xl group">
            Build My Blueprint <ArrowRight className="group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
        {/* DECORATIVE BACKGROUND TEXT */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.02] pointer-events-none w-full">
          <span className="text-[400px] font-black italic select-none">QUEST</span>
        </div>
      </section>

      {/* --- 4. CONTACT SECTION --- */}
      {/* <section id="contact" className="py-24 px-8 max-w-7xl mx-auto grid md:grid-cols-2 gap-16"> */}
        {/* <div>
          <h2 className="text-6xl font-black uppercase italic tracking-tighter leading-none mb-6">
            Get in <br /> <span className="text-orange-600">Touch*</span>
          </h2>
          <p className="text-slate-500 font-bold mb-10 max-w-sm">Have questions about your AI profile or want to partner with us? Reach out below.</p>
          
          <div className="space-y-6">
            <div className="flex items-center gap-4 group cursor-pointer">
              <div className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center group-hover:bg-orange-600 transition">
                <Mail size={20} />
              </div>
              <span className="font-black italic">hello@nxtstep.ai</span>
            </div>
            <div className="flex items-center gap-4 group cursor-pointer">
              <div className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center group-hover:bg-orange-600 transition">
                <Linkedin size={20} />
              </div>
              <span className="font-black italic">linkedin.com/nxtstep</span>
            </div>
          </div>
        </div> */}
        {/* </section> */}
        <ContactForm/>

        
      
      

      {/* --- FOOTER --- */}
      <footer className="bg-slate-900 py-12 text-white px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center text-white font-black italic">N</div>
            <span className="text-xl font-black tracking-tighter uppercase italic">NXTSTEP</span>
          </div>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">© 2025 NxtStep AI. All Rights Reserved.</p>
          <div className="flex gap-6 text-slate-400">
            <Twitter size={18} className="hover:text-white cursor-pointer" />
            <Linkedin size={18} className="hover:text-white cursor-pointer" />
            <Globe size={18} className="hover:text-white cursor-pointer" />
          </div>
        </div>
      </footer>
    </div>
  );
};

export default UpgradedLandingPage;
