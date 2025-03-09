import React, { forwardRef } from "react";

export type InputSize = "xs" | "sm" | "md" | "lg" | "xl";
export type InputVariant = "outline" | "filled" | "flushed" | "unstyled";

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  size?: InputSize;
  variant?: InputVariant;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  error?: boolean;
  errorMessage?: string;
  fullWidth?: boolean;
  className?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      size = "md",
      variant = "outline",
      leftIcon,
      rightIcon,
      error = false,
      errorMessage,
      fullWidth = false,
      className = "",
      disabled = false,
      ...props
    },
    ref
  ) => {
    // Base classes
    const baseClasses = "appearance-none focus:outline-none transition-all";

    // Size classes
    const sizeClasses = {
      xs: "text-xs px-2 py-1",
      sm: "text-sm px-3 py-1.5",
      md: "text-base px-4 py-2",
      lg: "text-lg px-5 py-2.5",
      xl: "text-xl px-6 py-3",
    };

    // Variant classes
    const variantClasses = {
      outline:
        "border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500",
      filled:
        "border border-transparent bg-gray-100 dark:bg-gray-700 rounded-md focus:bg-transparent focus:ring-2 focus:ring-primary-500",
      flushed:
        "border-b border-gray-300 dark:border-gray-600 rounded-none px-0 focus:border-primary-500",
      unstyled: "border-none rounded-none px-0",
    };

    // Error classes
    const errorClasses = error
      ? "border-red-500 focus:ring-red-500 focus:border-red-500 text-red-500"
      : "";

    // Width classes
    const widthClasses = fullWidth ? "w-full" : "";

    // Disabled classes
    const disabledClasses = disabled
      ? "opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-800"
      : "";

    // Create container classes for icons
    const containerClasses = `relative inline-flex items-center ${widthClasses}`;

    // Adjust padding for icons
    const leftPadding = leftIcon ? "pl-10" : "";
    const rightPadding = rightIcon ? "pr-10" : "";

    return (
      <div className={`${containerClasses}`}>
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {leftIcon}
          </div>
        )}

        <input
          ref={ref}
          className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${errorClasses} ${widthClasses} ${leftPadding} ${rightPadding} ${disabledClasses} ${className}`}
          disabled={disabled}
          {...props}
        />

        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            {rightIcon}
          </div>
        )}

        {error && errorMessage && (
          <div className="mt-1 text-sm text-red-600 dark:text-red-500">
            {errorMessage}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
