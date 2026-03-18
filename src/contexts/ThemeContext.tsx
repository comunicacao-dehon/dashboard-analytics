import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

export type ColorPalette =
  | "amber"
  | "blue"
  | "violet"
  | "emerald"
  | "rose"
  | "cyan";

interface ThemeContextType {
  theme: Theme;
  palette: ColorPalette;
  toggleTheme: () => void;
  setPalette: (p: ColorPalette) => void;
  switchable: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  switchable?: boolean;
}

const paletteVars: Record<ColorPalette, { primary: string; ring: string; sidebarPrimary: string }> = {
  amber: {
    primary: "#f59e0b",
    ring: "#f59e0b",
    sidebarPrimary: "#f59e0b",
  },
  blue: {
    primary: "#3b82f6",
    ring: "#3b82f6",
    sidebarPrimary: "#3b82f6",
  },
  violet: {
    primary: "#8b5cf6",
    ring: "#8b5cf6",
    sidebarPrimary: "#8b5cf6",
  },
  emerald: {
    primary: "#10b981",
    ring: "#10b981",
    sidebarPrimary: "#10b981",
  },
  rose: {
    primary: "#f43f5e",
    ring: "#f43f5e",
    sidebarPrimary: "#f43f5e",
  },
  cyan: {
    primary: "#06b6d4",
    ring: "#06b6d4",
    sidebarPrimary: "#06b6d4",
  },
};

export function ThemeProvider({
  children,
  defaultTheme = "dark",
  switchable = true,
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem("theme");
    return (stored as Theme) || defaultTheme;
  });

  const [palette, setPaletteState] = useState<ColorPalette>(() => {
    const stored = localStorage.getItem("color-palette");
    return (stored as ColorPalette) || "amber";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const root = document.documentElement;
    const vars = paletteVars[palette];
    root.style.setProperty("--primary", vars.primary);
    root.style.setProperty("--ring", vars.ring);
    root.style.setProperty("--sidebar-primary", vars.sidebarPrimary);
    localStorage.setItem("color-palette", palette);
  }, [palette]);

  const toggleTheme = () => {
    setTheme(prev => (prev === "light" ? "dark" : "light"));
  };

  const setPalette = (p: ColorPalette) => {
    setPaletteState(p);
  };

  return (
    <ThemeContext.Provider value={{ theme, palette, toggleTheme, setPalette, switchable }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
