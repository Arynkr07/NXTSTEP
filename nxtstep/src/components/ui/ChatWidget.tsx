"use client";

import { useState } from "react";
import { MessageSquare, X, Send, Zap } from "lucide-react";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([
    { role: "ai", text: "Hi! I'm NxtStep AI. Need a roadmap or career advice?" },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userMessage: userMsg.text,
          quizResults: {},
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessages((prev) => [...prev, { role: "ai", text: data.reply }]);
      } else {
        setMessages((prev) => [...prev, { role: "ai", text: "Neural link interrupted. Try again!" }]);
      }
    } catch (error) {
      setMessages((prev) => [...prev, { role: "ai", text: "Connection error." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] font-sans">
      {/* 1. The Toggle Button - Brutalist Style */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-orange-600 text-white p-4 rounded-2xl border-4 border-slate-900 dark:border-white shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:-translate-y-1 transition-all flex items-center gap-2 font-black uppercase italic tracking-tighter"
        >
          <MessageSquare size={20} fill="currentColor" />
          <span>Need Help?</span>
        </button>
      )}

      {/* 2. The Chat Window */}
      {isOpen && (
        <div className="bg-white dark:bg-slate-900 border-4 border-slate-900 dark:border-white w-80 md:w-96 h-[500px] rounded-[32px] shadow-[12px_12px_0px_0px_rgba(15,23,42,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)] flex flex-col overflow-hidden animate-in slide-in-from-bottom-4">
          
          {/* Header */}
          <div className="bg-slate-900 dark:bg-slate-800 text-white p-5 flex justify-between items-center border-b-2 border-slate-800 dark:border-slate-700">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
                <Zap size={16} fill="white" />
              </div>
              <h3 className="font-black uppercase italic text-sm tracking-widest">NxtStep AI*</h3>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="hover:bg-orange-600 p-1 rounded-lg transition"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-950/50">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-3 rounded-2xl text-sm font-bold shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] dark:shadow-none border-2 ${
                  msg.role === "user"
                    ? "bg-orange-600 text-white ml-auto border-slate-900 dark:border-orange-500"
                    : "bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border-slate-900 dark:border-slate-700"
                }`}
              >
                {msg.text}
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-2 items-center text-xs font-black uppercase italic text-orange-600 animate-pulse">
                <Zap size={12} fill="currentColor" /> Analyzing...
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white dark:bg-slate-900 border-t-4 border-slate-900 dark:border-slate-800 flex gap-2">
            <input
              type="text"
              className="flex-1 bg-slate-100 dark:bg-slate-800 border-2 border-slate-900 dark:border-slate-700 rounded-xl px-4 py-2 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-600"
              placeholder="ASK THE NEURAL ENGINE..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              onClick={sendMessage}
              disabled={isLoading}
              className="bg-slate-900 dark:bg-orange-600 text-white p-2 rounded-xl border-2 border-slate-900 dark:border-white hover:bg-orange-600 transition disabled:opacity-50"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}