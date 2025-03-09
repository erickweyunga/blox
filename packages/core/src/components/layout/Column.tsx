import React from "react";

export type ColumnJustify =
  | "start"
  | "center"
  | "end"
  | "between"
  | "around"
  | "evenly";
export type ColumnAlign = "start" | "center" | "end" | "stretch" | "baseline";
export type ColumnGap = "none" | "xs" | "sm" | "md" | "lg" | "xl";

export interface ColumnProps {
  children: React.ReactNode;
  justify?: ColumnJustify;
  align?: ColumnAlign;
  gap?: ColumnGap;
  className?: string;
}

export const Column: React.FC<ColumnProps> = ({
  children,
  justify = "start",
  align = "stretch",
  gap = "none",
  className = "",
  ...props
}) => {
  // Base classes
  const baseClasses = "flex flex-col";

  // Justify content classes
  const justifyClasses = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end",
    between: "justify-between",
    around: "justify-around",
    evenly: "justify-evenly",
  };

  // Align items classes
  const alignClasses = {
    start: "items-start",
    center: "items-center",
    end: "items-end",
    stretch: "items-stretch",
    baseline: "items-baseline",
  };

  // Gap classes
  const gapClasses = {
    none: "gap-0",
    xs: "gap-1",
    sm: "gap-2",
    md: "gap-4",
    lg: "gap-6",
    xl: "gap-8",
  };

  return (
    <div
      className={`${baseClasses} ${justifyClasses[justify]} ${alignClasses[align]} ${gapClasses[gap]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Column;
