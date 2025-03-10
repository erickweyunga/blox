import { component, h } from "@bloxi/core";
import { FlexProps } from "../types";
import Flex from "./flex";

/**
 * Stack - Vertical or horizontal stack component
 *
 * A convenience component for stacking elements with consistent spacing
 *
 * @example
 * ```tsx
 * <Stack spacing="1rem">
 *   <Box>Item 1</Box>
 *   <Box>Item 2</Box>
 *   <Box>Item 3</Box>
 * </Stack>
 * ```
 */
export const Stack = component<FlexProps & { spacing?: string | number }>({
  name: "Stack",

  setup(props) {
    return props;
  },

  render(props) {
    const { direction = "column", spacing, gap, ...rest } = props;

    // Use Flex component with appropriate spacing
    return Flex({
      direction,
      gap: spacing || gap,
      ...rest,
    });
  },
});

export default Stack;
