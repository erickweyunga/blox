import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { defaultTheme, Theme } from "../theme/constants";

// Theme context
const ThemeContext = createContext<{
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleDarkMode: () => void;
}>({
  theme: defaultTheme,
  setTheme: () => {},
  toggleDarkMode: () => {},
});

// Provider component
interface ThemeProviderProps {
  initialTheme?: Theme;
  children: ReactNode;
}

export function ThemeProvider({
  initialTheme = defaultTheme,
  children,
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(initialTheme);

  // Apply theme to CSS variables
  useEffect(() => {
    const root = document.documentElement;

    // Apply colors
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value as string);
    });

    // Apply spacing
    Object.entries(theme.spacing).forEach(([key, value]) => {
      root.style.setProperty(`--spacing-${key}`, `${value}px`);
    });

    // Apply font sizes
    Object.entries(theme.fontSize).forEach(([key, value]) => {
      root.style.setProperty(`--font-size-${key}`, `${value}px`);
    });

    // Apply dark mode class
    if (theme.darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setTheme((prev) => ({
      ...prev,
      darkMode: !prev.darkMode,
      colors: {
        ...prev.colors,
      },
    }));
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook to use the theme
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
