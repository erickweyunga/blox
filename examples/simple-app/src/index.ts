import { render, component, h } from "@bloxi/core";
import { Box, Button } from "@bloxi/components";

/**
 * Simple Hello World App
 */
const App = component({
  name: "App",

  render() {
    return Box({
      style: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        fontFamily: "system-ui, -apple-system, sans-serif",
      },
      children: [
        Button({
          style: { margin: "0 0 1rem" },
          onClick: () => alert("Hello World!"),
          children: "Click me!",
        })
      ],
    });
  },
});

// Mount the app when the DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  const rootElement = document.getElementById("root");

  if (rootElement) {
    render(App(), rootElement);
    console.log("Hello World app mounted successfully!");
  } else {
    console.error(
      'Root element not found. Add <div id="root"></div> to your HTML'
    );
  }
});
