import { component, h, VNode } from "@bloxi/core";

/**
 * Box component props
 */
export interface BoxProps {
  /** Child elements */
  children?: VNode | VNode[] | string | number | null;

  /** HTML tag to use */
  as?: string;

  /** CSS class name */
  className?: string;

  /** Inline styles */
  style?: Record<string, any>;

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

  /** DOM element ID */
  id?: string;

  /** Additional props */
  [key: string]: any;
}

/**
 * Box - Basic container component
 *
 * A versatile layout component for creating containers with various styles
 * and layout properties
 *
 * @example
 * ```tsx
 * <Box padding="1rem" background="#f5f5f5">
 *   Content goes here
 * </Box>
 * ```
 */
export const Box = component<BoxProps>({
  name: "Box",

  setup(props) {
    return props;
  },

  render(props) {
    const {
      children,
      as = "div",
      style = {},
      className = "",
      padding,
      margin,
      background,
      border,
      borderRadius,
      shadow,
      width,
      height,
      minWidth,
      minHeight,
      maxWidth,
      maxHeight,
      // Extract known props so we don't spread them to the DOM
      ...restProps
    } = props;

    // Build computed style
    const computedStyle = {
      ...(padding !== undefined && { padding }),
      ...(margin !== undefined && { margin }),
      ...(background !== undefined && { background }),
      ...(border !== undefined && { border }),
      ...(borderRadius !== undefined && { borderRadius }),
      ...(shadow !== undefined && { boxShadow: shadow }),
      ...(width !== undefined && { width }),
      ...(height !== undefined && { height }),
      ...(minWidth !== undefined && { minWidth }),
      ...(minHeight !== undefined && { minHeight }),
      ...(maxWidth !== undefined && { maxWidth }),
      ...(maxHeight !== undefined && { maxHeight }),
      ...style,
    };

    // Normalize children to array
    const childElements = children
      ? Array.isArray(children)
        ? children
        : [children]
      : [];

    // Create virtual DOM element
    return h(
      as,
      {
        style: computedStyle,
        className,
        ...restProps,
      },
      ...childElements
    );
  },
});

// Default export for easier imports
export default Box;
