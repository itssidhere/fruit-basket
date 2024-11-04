import React, { createContext, useContext, useState } from "react";

export const themes = {
  light: {
    primary: "from-indigo-500 to-purple-500",
    background: "bg-gray-50",
    surface: "bg-white",
    text: "text-gray-900",
    secondaryText: "text-gray-600",
    surfaceHover: "hover:bg-gray-50",
    border: "border-gray-200",
    cardBg: "bg-white/90",
    cardHoverBg: "hover:bg-white/95",
    buttonBg: "bg-indigo-500",
    buttonHoverBg: "hover:bg-indigo-600",
    buttonText: "text-white",
  },
  dark: {
    primary: "from-purple-600 to-indigo-600",
    background: "bg-gray-900",
    surface: "bg-gray-800",
    text: "text-gray-100",
    secondaryText: "text-gray-400",
    surfaceHover: "hover:bg-gray-700",
    border: "border-gray-700",
    cardBg: "bg-gray-800/90",
    cardHoverBg: "hover:bg-gray-800/95",
    buttonBg: "bg-indigo-600",
    buttonHoverBg: "hover:bg-indigo-700",
    buttonText: "text-white",
  },
  nature: {
    primary: "from-green-500 to-emerald-500",
    background: "bg-green-50",
    surface: "bg-white",
    text: "text-gray-900",
    secondaryText: "text-gray-600",
    surfaceHover: "hover:bg-green-50",
    border: "border-green-200",
    cardBg: "bg-white/90",
    cardHoverBg: "hover:bg-white/95",
    buttonBg: "bg-emerald-500",
    buttonHoverBg: "hover:bg-emerald-600",
    buttonText: "text-white",
  },
};

type ThemeContextType = {
  theme: keyof typeof themes;
  setTheme: (theme: keyof typeof themes) => void;
  themeColors: typeof themes.light;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = "fruitjar-theme";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<keyof typeof themes>(() => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    return (savedTheme as keyof typeof themes) || "light";
  });

  const setTheme = (newTheme: keyof typeof themes) => {
    setThemeState(newTheme);
    localStorage.setItem(THEME_STORAGE_KEY, newTheme);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        themeColors: themes[theme],
      }}
    >
      <div
        className={`${themes[theme].background} min-h-screen transition-colors duration-200`}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
