// theme types
export interface Theme {
  darkMode: boolean;
  colors: {
    primary: string;
    secondary: string;
    success: string;
    warning: string;
    danger: string;
    info: string;
    light: string;
    dark: string;
    background: string;
    text: string;
    [key: string]: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
    [key: string]: number;
  };
  fontSize: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
    [key: string]: number;
  };
  borderRadius: {
    none: number;
    sm: number;
    md: number;
    lg: number;
    full: number;
    [key: string]: number;
  };
  shadows: {
    none: string;
    sm: string;
    md: string;
    lg: string;
    [key: string]: string;
  };
}

// Default theme
export const defaultTheme: Theme = {
  darkMode: false,
  colors: {
    primary: "#3b82f6",
    secondary: "#6b7280",
    success: "#10b981",
    warning: "#f59e0b",
    danger: "#ef4444",
    info: "#3b82f6",
    light: "#f3f4f6",
    dark: "#111827",
    background: "#ffffff",
    text: "#111827",
    muted: "#6b7280",
    border: "#e5e7eb",
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
  },
  borderRadius: {
    none: 0,
    sm: 2,
    md: 4,
    lg: 8,
    full: 9999,
  },
  shadows: {
    none: "none",
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  },
};

// Dark mode theme
export const darkTheme: Theme = {
  ...defaultTheme,
  darkMode: true,
  colors: {
    ...defaultTheme.colors,
    background: "#111827",
    text: "#f3f4f6",
    border: "#374151",
  },
};
