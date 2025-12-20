// "use client"; // important if ThemeProvider uses useTheme
import type { Metadata } from "next"; // Import types
import { Inter } from "next/font/google"; // Optional: Add a font
import "./globals.css";
<<<<<<< HEAD
import Navbar from "./components/navbar";
import { ThemeProvider } from "./components/themeProvider"; // Import from your new component
=======
// 1. IMPORT THE CHAT WIDGET
import ChatWidget from "./components/ChatWidget"; 
>>>>>>> parent of d89560e (mode required)

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
<<<<<<< HEAD
  title: "NxtStep",
  description: "Your Career Counseling Platform",
=======
  title: "NxtStep - Find Your Path", // Updated title for you
  description: "AI-powered career counseling",
>>>>>>> parent of d89560e (mode required)
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
<<<<<<< HEAD
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* Navbar should be inside the body, usually inside the provider */}
          <Navbar />
          {children}
        </ThemeProvider>
=======
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        
        {/* 2. ADD THE WIDGET HERE */}
        <ChatWidget />
>>>>>>> parent of d89560e (mode required)
      </body>
    </html>
  );
}