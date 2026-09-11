"use client";
import React, { useEffect } from "react";
import { AlertTriangle, Trash2, LogIn, X, Check } from "lucide-react";
export type ModalType = "danger" | "warning" | "info" | "auth";
interface ConfirmModalProps {
  isOpen: boolean;
  type?: ModalType;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}
export default function ConfirmModal({
  isOpen,
  type = "danger",
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onCancel]);
  if (!isOpen) return null;
  const iconConfig = {
    danger: {
      icon: <Trash2 size={28} className="text-red-600 dark:text-red-400" />,
      bg: "bg-red-100 dark:bg-red-950/80 border-red-300 dark:border-red-800",
      btn: "bg-red-600 hover:bg-red-700 text-white shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]",
    },
    warning: {
      icon: (
        <AlertTriangle
          size={28}
          className="text-amber-600 dark:text-amber-400"
        />
      ),
      bg: "bg-amber-100 dark:bg-amber-950/80 border-amber-300 dark:border-amber-800",
      btn: "bg-amber-600 hover:bg-amber-700 text-white shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]",
    },
    auth: {
      icon: (
        <LogIn size={28} className="text-orange-600 dark:text-orange-400 " />
      ),
      bg: "bg-orange-100 dark:bg-orange-950/80 border-orange-300 ",
      btn: "bg-orange-600 dark:bg-orange-500 hover:bg-orange-700 text-white shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]",
    },
    info: {
      icon: <Check size={28} className="text-blue-600 dark:text-blue-400" />,
      bg: "bg-blue-100 dark:bg-blue-950/80 border-blue-300 dark:border-blue-800",
      btn: "bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 text-white shadow-[4px_4px_0px_0px_rgba(234,88,12,1)]",
    },
  }[type];
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
      {" "}
      <div className="bg-white dark:bg-black border-4 border-slate-900 dark:border-zinc-800 rounded-[32px] p-6 md:p-8 max-w-md w-full shadow-[16px_16px_0px_0px_rgba(15,23,42,1)] dark:shadow-[16px_16px_0px_0px_rgba(234,88,12,0.4)] relative animate-in zoom-in-95 duration-200">
        {" "}
        {/* Close Button */}{" "}
        <button
          onClick={onCancel}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          {" "}
          <X size={20} strokeWidth={2.5} />{" "}
        </button>{" "}
        {/* Icon & Content */}{" "}
        <div className="flex flex-col items-center text-center">
          {" "}
          <div
            className={`w-16 h-16 rounded-2xl border-2 flex items-center justify-center mb-5 ${iconConfig.bg}`}
          >
            {" "}
            {iconConfig.icon}{" "}
          </div>{" "}
          <h3 className="text-2xl md:text-3xl font-black uppercase italic tracking-tight text-slate-900 dark:text-white mb-2 leading-none">
            {" "}
            {title}{" "}
          </h3>{" "}
          <p className="text-slate-600 dark:text-slate-300 text-sm font-medium leading-relaxed mb-6">
            {" "}
            {description}{" "}
          </p>{" "}
          {/* Action Buttons */}{" "}
          <div className="flex items-center gap-3 w-full">
            {" "}
            <button
              onClick={onCancel}
              className="flex-1 py-3.5 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-2xl font-black uppercase italic text-xs tracking-wider border-2 border-slate-300 dark:border-zinc-800 transition active:translate-y-0.5"
            >
              {" "}
              {cancelText}{" "}
            </button>{" "}
            <button
              onClick={onConfirm}
              className={`flex-1 py-3.5 px-4 rounded-2xl font-black uppercase italic text-xs tracking-wider transition active:translate-y-0.5 ${iconConfig.btn}`}
            >
              {" "}
              {confirmText}{" "}
            </button>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
}
