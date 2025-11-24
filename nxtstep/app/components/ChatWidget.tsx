"use client"; // This is required for interactivity

import { useState } from "react";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([
    { role: "ai", text: "Hi! I'm NxtStep AI. How can I help with your career today?" },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    // 1. Add user message to UI immediately
    const userMsg = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      // 2. Send to our Backend API
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userMessage: userMsg.text,
          quizResults: {}, // We can connect real quiz results later
        }),
      });

      const data = await res.json();

      // 3. Add AI response to UI
      if (res.ok) {
        setMessages((prev) => [...prev, { role: "ai", text: data.reply }]);
      } else {
        setMessages((prev) => [...prev, { role: "ai", text: "Oops! Something went wrong. Check the console." }]);
        console.error(data.error);
      }
    } catch (error) {
      console.error("Frontend Error:", error);
      setMessages((prev) => [...prev, { role: "ai", text: "Error connecting to server." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 font-sans">
      {/* 1. The Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center"
        >
          💬 Need Help?
        </button>
      )}

      {/* 2. The Chat Window */}
      {isOpen && (
        <div className="bg-white border border-gray-200 w-80 h-96 rounded-lg shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 text-white p-3 flex justify-between items-center">
            <h3 className="font-bold">NxtStep Assistant</h3>
            <button onClick={() => setIsOpen(false)} className="text-sm hover:text-gray-200">
              ✕ Close
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-2 rounded-lg text-sm max-w-[80%] ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white ml-auto"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {msg.text}
              </div>
            ))}
            {isLoading && <div className="text-xs text-gray-500 italic">Thinking...</div>}
          </div>

          {/* Input Area */}
          <div className="p-3 border-t flex gap-2">
            <input
              type="text"
              className="flex-1 border rounded px-2 py-1 text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ask me anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              onClick={sendMessage}
              disabled={isLoading}
              className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}