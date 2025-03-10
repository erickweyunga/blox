import { Box, Typography } from "@bloxi/components";
import { component } from "@bloxi/core";
import { DeleteConfirmation } from "./hero";

export const App = component({
  name: "App",

  render() {
    return Box({
      style: {
        padding: "2rem",
        maxWidth: "960px",
        margin: "0 auto",
      },
      children: [
        // Header
        Typography({
          as: "h1",
          style: {
            fontSize: "1.875rem",
            fontWeight: "bold",
            marginBottom: "2rem",
            textAlign: "center",
          },
          children: "Bloxi Reactivity Demo",
        }),

        // Explanation
        Typography({
          style: {
            marginBottom: "2rem",
            textAlign: "center",
            color: "#4B5563",
          },
          children:
            "This example demonstrates the improved reactivity system in Bloxi. Click the delete button to see reactive state changes in action.",
        }),

        // The DeleteConfirmation component
        DeleteConfirmation(),
      ],
    });
  },
});
