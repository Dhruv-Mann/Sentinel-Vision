"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>("dark");

  // Initialize theme on mount
  useEffect(() => {
    // Check localStorage first
    const storedTheme = localStorage.getItem("theme") as Theme | null;

    if (storedTheme) {
      setThemeState(storedTheme);
      applyTheme(storedTheme);
    } else {
      // Detect system preference using prefers-color-scheme
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      const systemTheme: Theme = prefersDark ? "dark" : "light";
      setThemeState(systemTheme);
      applyTheme(systemTheme);
    }
  }, []);

  // Apply theme to document
  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement;

    // Remove existing theme attribute
    root.removeAttribute("data-theme");

    // Apply new theme with transition
    if (newTheme === "light") {
      root.setAttribute("data-theme", "light");
    }
    // Dark theme is default (no attribute needed)

    // Update meta theme-color tag
    updateMetaThemeColor(newTheme);
  };

  // Update meta theme-color tag based on current theme
  const updateMetaThemeColor = (currentTheme: Theme) => {
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');

    if (!metaThemeColor) {
      metaThemeColor = document.createElement("meta");
      metaThemeColor.setAttribute("name", "theme-color");
      document.head.appendChild(metaThemeColor);
    }

    // Set theme color based on theme
    const themeColor = currentTheme === "dark" ? "#09090b" : "#f4f4f5";
    metaThemeColor.setAttribute("content", themeColor);
  };

  // Set theme and persist to localStorage
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem("theme", newTheme);
    applyTheme(newTheme);
  };

  // Toggle between light and dark themes
  const toggleTheme = () => {
    const newTheme: Theme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook for accessing theme context
export function useTheme() {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
}
