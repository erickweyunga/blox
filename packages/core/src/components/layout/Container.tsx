import React from "react";

export type ContainerSize = "sm" | "md" | "lg" | "xl" | "full";

export interface ContainerProps {
  children: React.ReactNode;
  size?: ContainerSize;
  padding?: string;
  margin?: string;
  centerContent?: boolean;
  className?: string;
}

export const Container: React.FC<ContainerProps> = ({
  children,
  size = "lg",
  padding = "px-4 py-0",
  margin = "mx-auto",
  centerContent = false,
  className = "",
  ...props
}) => {
  // Max width classes
  const sizeClasses = {
    sm: "max-w-screen-sm", // 640px
    md: "max-w-screen-md", // 768px
    lg: "max-w-screen-lg", // 1024px
    xl: "max-w-screen-xl", // 1280px
    full: "max-w-full", // 100%
  };

  // Center content classes
  const centerClasses = centerContent ? "flex flex-col items-center" : "";

  return (
    <div
      className={`w-full ${sizeClasses[size]} ${padding} ${margin} ${centerClasses} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Container;
