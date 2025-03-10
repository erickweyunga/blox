import { component, h } from "@bloxi/core";
import { TextProps } from "../types";

/**
 * Typography - Typography component
 *
 * A component for rendering text with various style options
 *
 * @example
 * ```tsx
 * <Typography as="h2" size="1.5rem" weight="bold" color="#333">
 *   Heading Text
 * </Typography>
 * ```
 */

export const Typography = component<TextProps>({
  name: "Typography",

  setup(props) {
    return props;
  },

  render(props) {
    const {
      children,
      as = "span",
      style = {},
      size,
      weight,
      color,
      align,
      transform,
      lineHeight,
      letterSpacing,
      ...rest
    } = props;

    // Build the componet styles
    const computedStyle = {
      ...(size !== undefined && { fontSize: size }),
      ...(weight !== undefined && { fontWeight: weight }),
      ...(color !== undefined && { color }),
      ...(align !== undefined && { textAlign: align }),
      ...(transform !== undefined && { textTransform: transform }),
      ...(lineHeight !== undefined && { lineHeight }),
      ...(letterSpacing !== undefined && { letterSpacing }),
      ...style,
    };

    return h(as, { style: computedStyle, ...rest }, children);
  },
});

export default Typography;
