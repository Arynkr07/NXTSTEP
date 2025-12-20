"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

export function ThemeProvider({ children, ...props }: any) {
  return (
    <NextThemesProvider 
      attribute="class" // Must be "class"
      defaultTheme="light" 
      enableSystem={false} // Prevents it from following Windows/Mac settings over your button
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}