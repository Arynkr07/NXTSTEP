"use client";
import React, { useState, KeyboardEvent } from "react";
import { X, Plus, Sparkles } from "lucide-react";
interface SkillInputProps {
  skills: string[];
  onChange: (skills: string[]) => void;
  placeholder?: string;
  maxSkills?: number;
}
export default function SkillInput({
  skills,
  onChange,
  placeholder = "Type a skill (e.g. Python, React, Excel, Figma...)",
  maxSkills = 10,
}: SkillInputProps) {
  const [input, setInput] = useState("");
  const addSkill = (raw: string) => {
    const skill = raw.trim();
    if (!skill || skills.includes(skill) || skills.length >= maxSkills) return;
    onChange([...skills, skill]);
    setInput("");
  };
  const removeSkill = (skill: string) => {
    onChange(skills.filter((s) => s !== skill));
  };
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addSkill(input);
    } else if (e.key === "Backspace" && !input && skills.length > 0) {
      removeSkill(skills[skills.length - 1]);
    }
  };
  return (
    <div className="space-y-3">
      {" "}
      {/* Section header — highly visible */}{" "}
      <div className="flex items-center gap-2 bg-orange-50 border-2 border-orange-300 rounded-xl px-3 py-2">
        {" "}
        <Sparkles size={14} className="text-orange-500 flex-shrink-0" />{" "}
        <span className="text-xs font-black uppercase tracking-widest text-orange-700">
          {" "}
          Your Current Skills{" "}
        </span>{" "}
        <span className="ml-auto text-[10px] font-bold text-orange-500 bg-orange-100 px-2 py-0.5 rounded-full">
          {" "}
          Optional — improves roadmap{" "}
        </span>{" "}
      </div>{" "}
      {/* Skill pills */}{" "}
      {skills.length > 0 && (
        <div className="flex flex-wrap gap-2 p-2 bg-orange-50/60 border border-orange-200 rounded-xl">
          {" "}
          {skills.map((skill) => (
            <span
              key={skill}
              className="flex items-center gap-1.5 px-3 py-1 bg-orange-600 dark:bg-orange-500 text-white rounded-full text-xs font-black border-2 border-orange-800/20 shadow-sm"
            >
              {" "}
              {skill}{" "}
              <button
                onClick={() => removeSkill(skill)}
                className="hover:text-orange-200 transition"
                aria-label={`Remove ${skill}`}
              >
                {" "}
                <X size={10} strokeWidth={3} />{" "}
              </button>{" "}
            </span>
          ))}{" "}
        </div>
      )}{" "}
      {/* Input row */}{" "}
      <div className="flex gap-2">
        {" "}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            skills.length >= maxSkills
              ? `Max ${maxSkills} skills reached`
              : placeholder
          }
          disabled={skills.length >= maxSkills}
          className="flex-1 border-2 border-slate-700 bg-white rounded-xl px-4 py-2.5 text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
        />{" "}
        <button
          onClick={() => addSkill(input)}
          disabled={!input.trim() || skills.length >= maxSkills}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-orange-600 dark:bg-orange-500 text-white rounded-xl text-xs font-black uppercase hover:bg-orange-700 transition disabled:opacity-40 disabled:cursor-not-allowed shadow-[3px_3px_0px_0px_rgba(15,23,42,0.3)]"
        >
          {" "}
          <Plus size={14} strokeWidth={3} /> Add{" "}
        </button>{" "}
      </div>{" "}
      <p className="text-[10px] text-slate-500 font-medium">
        {" "}
        Press{" "}
        <kbd className="bg-slate-100 border border-slate-300 px-1 py-0.5 rounded text-slate-600">
          Enter
        </kbd>{" "}
        or{" "}
        <kbd className="bg-slate-100 border border-slate-300 px-1 py-0.5 rounded text-slate-600">
          ,
        </kbd>{" "}
        to add a skill{" "}
      </p>{" "}
    </div>
  );
}
