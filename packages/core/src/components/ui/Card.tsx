import React from "react";

export type CardVariant = "elevated" | "outlined" | "filled";
export type CardShadow = "none" | "sm" | "md" | "lg";
export type CardBorderRadius = "none" | "sm" | "md" | "lg";

export interface CardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  shadow?: CardShadow;
  borderRadius?: CardBorderRadius;
  padding?: string;
  margin?: string;
  width?: string;
  background?: string;
  border?: string;
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = "elevated",
  shadow = "md",
  borderRadius = "md",
  padding = "p-4",
  margin = "m-0",
  width = "w-full",
  background = "bg-white dark:bg-gray-800",
  border = "border-gray-200 dark:border-gray-700",
  className = "",
  ...props
}) => {
  // Border radius classes
  const radiusClasses = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
  };

  // Shadow classes
  const shadowClasses = {
    none: "shadow-none",
    sm: "shadow-sm",
    md: "shadow",
    lg: "shadow-lg",
  };

  // Variant classes
  const variantClasses = {
    elevated: `${background} ${shadowClasses[shadow]}`,
    outlined: `${background} border ${border}`,
    filled: `${background}`,
  };

  return (
    <div
      className={`${width} ${padding} ${margin} ${radiusClasses[borderRadius]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

// Sub-components for Card
export const CardHeader: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "", ...props }) => (
  <div className={`mb-4 ${className}`} {...props}>
    {children}
  </div>
);

export const CardBody: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "", ...props }) => (
  <div className={className} {...props}>
    {children}
  </div>
);

export const CardFooter: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "", ...props }) => (
  <div className={`mt-4 ${className}`} {...props}>
    {children}
  </div>
);

export default Card;
