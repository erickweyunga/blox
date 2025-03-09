import React from "react";

export type TextVariant =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "p"
  | "span"
  | "label";
export type TextSize = "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
export type TextWeight = "light" | "normal" | "medium" | "semibold" | "bold";
export type TextAlign = "left" | "center" | "right" | "justify";
export type TextColor =
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "text"
  | "muted";

export interface TextProps {
  children: React.ReactNode;
  variant?: TextVariant;
  size?: TextSize;
  weight?: TextWeight;
  align?: TextAlign;
  color?: TextColor;
  truncate?: boolean;
  italic?: boolean;
  underline?: boolean;
  className?: string;
  as?: React.ElementType;
}

export const Text: React.FC<TextProps> = ({
  children,
  variant = "p",
  size = "md",
  weight = "normal",
  align = "left",
  color = "text",
  truncate = false,
  italic = false,
  underline = false,
  className = "",
  as,
  ...props
}) => {
  // Determine the element to render
  const Component = as || variant;

  // Size classes
  const sizeClasses = {
    xs: "text-xs",
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
    xxl: "text-2xl",
  };

  // Weight classes
  const weightClasses = {
    light: "font-light",
    normal: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
    bold: "font-bold",
  };

  // Alignment classes
  const alignClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
    justify: "text-justify",
  };

  // Color classes
  const colorClass = `text-${color}`;

  // Style classes
  const styleClasses = [
    truncate ? "truncate" : "",
    italic ? "italic" : "",
    underline ? "underline" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Component
      className={`${sizeClasses[size]} ${weightClasses[weight]} ${alignClasses[align]} ${colorClass} ${styleClasses} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Text;
