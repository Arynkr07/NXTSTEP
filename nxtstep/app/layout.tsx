// "use client"; // important if ThemeProvider uses useTheme
import type { Metadata } from "next"; // Import types
import { Inter } from "next/font/google"; // Optional: Add a font
import "./globals.css";
import Navbar from "./components/navbar";
import { ThemeProvider } from "./components/themeProvider"; // Import from your new component

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NxtStep",
  description: "Your Career Counseling Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
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
      </body>
    </html>
  );
}