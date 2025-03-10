import { render } from "@bloxi/core";
import { App } from "./components/App";

document.addEventListener("DOMContentLoaded", () => {
  const rootElement = document.getElementById("root");

  if (rootElement) {
    render(App(), rootElement);
    console.log("App mounted successfully!");
  } else {
    console.error(
      'Root element not found. Add <div id="root"></div> to your HTML'
    );
  }
});
