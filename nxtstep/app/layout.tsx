import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ChatWidget from "./components/ChatWidget"; 
import { ThemeProvider } from "./components/themeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NxtStep - Find Your Path",
  description: "AI-powered career counseling",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // 1. Added suppressHydrationWarning to prevent theme-flicker errors
    <html lang="en" suppressHydrationWarning>
      <body
        // 2. Added bg-white and dark:bg-slate-950 to the body
        // 3. Added transition-colors so the switch feels smooth
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300`}
      >
        <ThemeProvider 
          attribute="class" 
          defaultTheme="light" 
          enableSystem={false} // Force it to use the toggle rather than system settings initially
        >
          {children}
        </ThemeProvider>
        
        <ChatWidget />
      </body>
    </html>
  );
}