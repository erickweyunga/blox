import React from "react";
import { useTheme } from "../../context/ThemeContext";

export type ButtonVariant = "solid" | "outline" | "ghost" | "link";
export type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl";
export type ButtonColor =
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger"
  | "info";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  color?: ButtonColor;
  fullWidth?: boolean;
  rounded?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isLoading?: boolean;
  isDisabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "solid",
  size = "md",
  color = "primary",
  fullWidth = false,
  rounded = false,
  leftIcon,
  rightIcon,
  isLoading = false,
  isDisabled = false,
  className = "",
  ...props
}) => {
  // Base classes that apply to all buttons
  const baseClasses =
    "inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";

  // Size classes
  const sizeClasses = {
    xs: "text-xs px-2 py-1",
    sm: "text-sm px-3 py-1.5",
    md: "text-md px-4 py-2",
    lg: "text-lg px-6 py-2.5",
    xl: "text-xl px-8 py-3",
  };

  // Border radius classes
  const roundedClasses = rounded ? "rounded-full" : "rounded-md";

  // Width classes
  const widthClasses = fullWidth ? "w-full" : "";

  // Color and variant classes
  const colorVariantClasses = () => {
    switch (variant) {
      case "solid":
        return `bg-${color} hover:bg-${color}-600 text-white focus:ring-${color}-500`;
      case "outline":
        return `border border-${color} text-${color} hover:bg-${color}-50 focus:ring-${color}-500`;
      case "ghost":
        return `text-${color} hover:bg-${color}-50 focus:ring-${color}-500`;
      case "link":
        return `text-${color} hover:underline focus:ring-${color}-500`;
      default:
        return `bg-${color} hover:bg-${color}-600 text-white focus:ring-${color}-500`;
    }
  };

  // Disabled classes
  const disabledClasses = isDisabled ? "opacity-50 cursor-not-allowed" : "";

  // Loading classes and content
  const loadingContent = isLoading ? (
    <span className="mr-2">
      <svg
        className="animate-spin h-4 w-4 text-current"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    </span>
  ) : null;

  return (
    <button
      className={`${baseClasses} ${
        sizeClasses[size]
      } ${roundedClasses} ${widthClasses} ${colorVariantClasses()} ${disabledClasses} ${className}`}
      disabled={isDisabled || isLoading}
      {...props}
    >
      {leftIcon && <span className="mr-2">{leftIcon}</span>}
      {loadingContent}
      {children}
      {rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
};

export default Button;
