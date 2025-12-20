"use client";
import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Logic: You can use 'addDoc(collection(db, "messages"), formData)' 
    // here to save these to Firestore!
    
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: 'General Inquiry', message: '' });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      
      <main className="max-w-7xl mx-auto px-8 py-16 grid lg:grid-cols-2 gap-16 items-center">
        
        {/* LEFT SIDE: CONTACT INFO */}
        <div className="space-y-12">
          <header>
            <div className="flex items-center gap-2 text-orange-600 font-bold text-sm uppercase tracking-widest mb-4">
              <MessageSquare size={18} fill="currentColor" />
              <span>Support Center</span>
            </div>
            <h1 className="text-7xl font-black leading-[0.9] mb-6 tracking-tighter uppercase italic">
              Let's Talk <br /> 
              <span className="text-orange-600">Strategy*</span>
            </h1>
            <p className="text-lg text-slate-500 font-medium italic border-l-4 border-slate-900 pl-6">
              Have questions about your AI roadmap or need technical help? Our team is on standby.
            </p>
          </header>

          <div className="space-y-8">
            <div className="flex items-center gap-6 group">
              <div className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(234,88,12,1)] group-hover:scale-110 transition">
                <Mail size={24} />
              </div>
              <div>
                <p className="text-xs font-black uppercase text-slate-400">Email Us</p>
                <p className="text-xl font-black italic">support@nxtstep.ai</p>
              </div>
            </div>

            <div className="flex items-center gap-6 group">
              <div className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(234,88,12,1)] group-hover:scale-110 transition">
                <Phone size={24} />
              </div>
              <div>
                <p className="text-xs font-black uppercase text-slate-400">Call Support</p>
                <p className="text-xl font-black italic">+1 (555) NXT-STEP</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: THE FORM */}
        <div className="relative">
          <div className="absolute inset-0 bg-orange-600 rounded-[40px] translate-x-4 translate-y-4 -z-10"></div>
          <div className="bg-white border-4 border-slate-900 p-10 rounded-[40px] shadow-xl">
            {submitted ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-green-600">
                   <Send size={32} />
                </div>
                <h2 className="text-3xl font-black uppercase italic mb-2">Message Received!</h2>
                <p className="text-slate-500 font-bold">We'll get back to you within 24 hours.</p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="mt-8 text-orange-600 font-black uppercase italic text-sm hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">Name</label>
                    <input 
                      required
                      type="text" 
                      className="w-full border-2 border-slate-900 p-4 rounded-xl font-bold focus:ring-4 focus:ring-orange-100 outline-none" 
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">Email</label>
                    <input 
                      required
                      type="email" 
                      className="w-full border-2 border-slate-900 p-4 rounded-xl font-bold focus:ring-4 focus:ring-orange-100 outline-none" 
                      placeholder="email@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">Subject</label>
                  <select 
                    className="w-full border-2 border-slate-900 p-4 rounded-xl font-bold focus:ring-4 focus:ring-orange-100 outline-none bg-white"
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  >
                    <option>General Inquiry</option>
                    <option>Technical Issue</option>
                    <option>Roadmap Feedback</option>
                    <option>Partnership</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">Message</label>
                  <textarea 
                    required
                    rows={4} 
                    className="w-full border-2 border-slate-900 p-4 rounded-xl font-bold focus:ring-4 focus:ring-orange-100 outline-none resize-none" 
                    placeholder="How can we help your journey?"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                  ></textarea>
                </div>

                <button 
                  disabled={isSubmitting}
                  className="w-full bg-slate-900 text-white p-5 rounded-xl font-black uppercase italic tracking-widest flex items-center justify-center gap-3 hover:bg-orange-600 transition shadow-[8px_8px_0px_0px_rgba(234,88,12,1)] active:translate-y-1 active:shadow-none"
                >
                  {isSubmitting ? "Sending..." : "Blast Message"} <Send size={20} />
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}