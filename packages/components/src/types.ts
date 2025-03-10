import { VNode } from "@bloxi/core";

/**
 * Base props shared by all components
 */
export interface BaseProps {
  /** Child elements */
  children?: VNode | VNode[] | string | number | null;

  /** CSS class name */
  className?: string;

  /** Inline styles */
  style?: Record<string, any>;

  /** DOM element ID */
  id?: string;

  /** Additional props */
  [key: string]: any;
}

/**
 * Box component props
 */
export interface BoxProps extends BaseProps {
  /** HTML tag to use */
  as?: string;

  /** Box padding */
  padding?: string | number;

  /** Box margin */
  margin?: string | number;

  /** Background color */
  background?: string;

  /** Border */
  border?: string;

  /** Border radius */
  borderRadius?: string | number;

  /** Box shadow */
  shadow?: string;

  /** Width */
  width?: string | number;

  /** Height */
  height?: string | number;

  /** Minimum width */
  minWidth?: string | number;

  /** Minimum height */
  minHeight?: string | number;

  /** Maximum width */
  maxWidth?: string | number;

  /** Maximum height */
  maxHeight?: string | number;
}

/**
 * Flex component props
 */
export interface FlexProps extends BoxProps {
  /** Flex direction */
  direction?: "row" | "column" | "row-reverse" | "column-reverse";

  /** Align items */
  align?: "flex-start" | "flex-end" | "center" | "stretch" | "baseline";

  /** Justify content */
  justify?:
    | "flex-start"
    | "flex-end"
    | "center"
    | "space-between"
    | "space-around"
    | "space-evenly";

  /** Flex wrap */
  wrap?: "nowrap" | "wrap" | "wrap-reverse";

  /** Gap between items */
  gap?: string | number;

  /** Gap between rows */
  rowGap?: string | number;

  /** Gap between columns */
  columnGap?: string | number;

  /** Flex grow/shrink/basis */
  flex?: string | number;
}

/**
 * Grid component props
 */
export interface GridProps extends BoxProps {
  /** Grid template columns */
  columns?: string | number;

  /** Grid template rows */
  rows?: string | number;

  /** Gap between items */
  gap?: string | number;

  /** Gap between rows */
  rowGap?: string | number;

  /** Gap between columns */
  columnGap?: string | number;

  /** Grid template areas */
  areas?: string;

  /** Grid auto flow */
  autoFlow?: "row" | "column" | "row dense" | "column dense";

  /** Grid auto rows */
  autoRows?: string;

  /** Grid auto columns */
  autoColumns?: string;
}

/**
 * Text component props
 */
export interface TextProps extends BaseProps {
  /** HTML tag to use */
  as?: string;

  /** Font size */
  size?: string | number;

  /** Font weight */
  weight?: string | number | "normal" | "bold" | "lighter" | "bolder";

  /** Text color */
  color?: string;

  /** Text alignment */
  align?: "left" | "center" | "right" | "justify";

  /** Text transform */
  transform?: "uppercase" | "lowercase" | "capitalize" | "none";

  /** Line height */
  lineHeight?: string | number;

  /** Letter spacing */
  letterSpacing?: string | number;
}

/**
 * Button variants
 */
export type ButtonVariant =
  | "default"
  | "primary"
  | "secondary"
  | "danger"
  | "success"
  | "warning"
  | "info";

/**
 * Button sizes
 */
export type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl";

/**
 * Button component props
 */
export interface ButtonProps extends BaseProps {
  /** Click handler */
  onClick?: (event: any) => void;

  /** Button is disabled */
  disabled?: boolean;

  /** Button type attribute */
  type?: "button" | "submit" | "reset";

  /** Visual style variant */
  variant?: ButtonVariant;

  /** Button size */
  size?: ButtonSize;

  /** Full width button */
  fullWidth?: boolean;

  /** Icon element */
  icon?: VNode;

  /** Icon position */
  iconPosition?: "left" | "right";
}

/**
 * Input component props
 */
export interface InputProps extends BaseProps {
  /** Input type */
  type?: string;

  /** Input value */
  value?: string | number;

  /** Placeholder text */
  placeholder?: string;

  /** Change handler */
  onChange?: (event: any) => void;

  /** Focus handler */
  onFocus?: (event: any) => void;

  /** Blur handler */
  onBlur?: (event: any) => void;

  /** Input is disabled */
  disabled?: boolean;

  /** Input is required */
  required?: boolean;

  /** Input is read-only */
  readOnly?: boolean;

  /** Input name */
  name?: string;

  /** Minimum value */
  min?: number | string;

  /** Maximum value */
  max?: number | string;

  /** Step value */
  step?: number | string;

  /** Pattern for validation */
  pattern?: string;

  /** Autocomplete attribute */
  autoComplete?: string;

  /** Autofocus attribute */
  autoFocus?: boolean;
}

/**
 * Image component props
 */
export interface ImageProps extends BaseProps {
  /** Image source URL */
  src: string;

  /** Alternative text */
  alt?: string;

  /** Image width */
  width?: string | number;

  /** Image height */
  height?: string | number;

  /** Object fit */
  fit?: "cover" | "contain" | "fill" | "none" | "scale-down";

  /** Object position */
  position?: string;

  /** Loading attribute */
  loading?: "eager" | "lazy";

  /** Fallback content */
  fallback?: VNode;
}
