import { component, h } from "@bloxi/core";
import { GridProps } from "../types";
import Box from "./box";

/**
 * Grid - CSS Grid container component
 *
 * A component for creating grid layouts with various configuration options
 *
 * @example
 * ```tsx
 * <Grid columns="repeat(3, 1fr)" gap="1rem">
 *   <Box>Item 1</Box>
 *   <Box>Item 2</Box>
 *   <Box>Item 3</Box>
 * </Grid>
 * ```
 */
export const Grid = component<GridProps>({
  name: "Grid",

  setup(props) {
    return props;
  },

  render(props) {
    const {
      style = {},
      columns,
      rows,
      gap,
      rowGap,
      columnGap,
      areas,
      autoFlow,
      autoRows,
      autoColumns,
      ...rest
    } = props;

    // Convert numeric columns to template
    const columnsTemplate =
      typeof columns === "number" ? `repeat(${columns}, 1fr)` : columns;

    // Convert numeric rows to template
    const rowsTemplate =
      typeof rows === "number" ? `repeat(${rows}, 1fr)` : rows;

    // Build grid style
    const gridStyle = {
      display: "grid",
      ...(columnsTemplate !== undefined && {
        gridTemplateColumns: columnsTemplate,
      }),
      ...(rowsTemplate !== undefined && { gridTemplateRows: rowsTemplate }),
      ...(gap !== undefined && { gap }),
      ...(rowGap !== undefined && { rowGap }),
      ...(columnGap !== undefined && { columnGap }),
      ...(areas !== undefined && { gridTemplateAreas: areas }),
      ...(autoFlow !== undefined && { gridAutoFlow: autoFlow }),
      ...(autoRows !== undefined && { gridAutoRows: autoRows }),
      ...(autoColumns !== undefined && { gridAutoColumns: autoColumns }),
      ...style,
    };

    // Use Box component with grid styles
    return Box({
      style: gridStyle,
      ...rest,
    });
  },
});

export default Grid;
