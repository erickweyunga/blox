import { component, h } from "@bloxi/core";
import { CardProps } from "../types";
import Box from "../layout/box";

/**
 * Card - Container with elevation
 *
 * A component for creating card-like containers with shadows and borders
 *
 * @example
 * ```tsx
 * <Card elevation="md" padding="1rem">
 *   <Text>Card content</Text>
 * </Card>
 * ```
 */
export const Card = component<CardProps>({
  name: "Card",

  setup(props) {
    return props;
  },

  render(props) {
    // Shadow styles based on elevation
    const shadowStyles = {
      none: "none",
      sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
      md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    };

    const {
      style = {},
      elevation = "md" as keyof typeof shadowStyles,
      hoverable = false,
      borderRadius = "0.5rem",
      background = "#ffffff",
      ...rest
    } = props;

    // Hover effect
    const hoverStyle = hoverable
      ? {
          transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
          ":hover": {
            transform: "translateY(-4px)",
            boxShadow: shadowStyles.lg,
          },
        }
      : {};

    // Build card style
    const cardStyle = {
      boxShadow: shadowStyles[elevation as keyof typeof shadowStyles],
      overflow: "hidden",
      ...hoverStyle,
      ...style,
    };

    // Use Box component with card styles
    return Box({
      borderRadius,
      background,
      style: cardStyle,
      ...rest,
    });
  },
});

export default Card;
