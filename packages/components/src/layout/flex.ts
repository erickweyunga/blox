import { component, h } from "@bloxi/core";
import { FlexProps } from "../types";
import Box from "./box";

/**
 * Flex - Flexbox container component
 *
 * A component for creating flexbox layouts with various alignment and spacing options
 *
 * @example
 * ```tsx
 * <Flex direction="row" justify="space-between" align="center">
 *   <Box>Item 1</Box>
 *   <Box>Item 2</Box>
 * </Flex>
 * ```
 */
export const Flex = component<FlexProps>({
  name: "Flex",

  setup(props) {
    return props;
  },

  render(props) {
    const {
      style = {},
      direction = "row",
      align,
      justify,
      wrap,
      gap,
      rowGap,
      columnGap,
      flex,
      ...rest
    } = props;

    // Build flexbox style
    const flexStyle = {
      display: "flex",
      flexDirection: direction,
      ...(align !== undefined && { alignItems: align }),
      ...(justify !== undefined && { justifyContent: justify }),
      ...(wrap !== undefined && { flexWrap: wrap }),
      ...(gap !== undefined && { gap }),
      ...(rowGap !== undefined && { rowGap }),
      ...(columnGap !== undefined && { columnGap }),
      ...(flex !== undefined && { flex }),
      ...style,
    };

    // Use Box component with flex styles
    return Box({
      style: flexStyle,
      ...rest,
    });
  },
});

export default Flex;
