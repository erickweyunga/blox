# @bloxi/core

A lightweight, reactive UI framework built from scratch.

## Features

- 🔄 **Reactive by Design**: State changes automatically update your UI
- 🧩 **Component-Based**: Build complex UIs from simple, reusable components
- 🔍 **Virtual DOM**: Efficient rendering through an optimized diffing algorithm
- 🚀 **Lightweight**: Small bundle size with zero dependencies
- 📦 **Modular**: Use only what you need
- 🔒 **Type-Safe**: Built with TypeScript for excellent developer experience

## Installation

```bash
# Install core framework
npm install @bloxi/core

# Optionally install component library
npm install @bloxi/components
```

## Quick Start

```tsx
import { render, component, state } from "@bloxi/core";
import { Box, Text, Button } from "@bloxi/components";

// Create a simple counter component
const Counter = component({
  name: "Counter",

  setup() {
    // Create reactive state
    const count = state(0);

    // Event handlers
    const increment = () => count.value++;

    return { count, increment };
  },

  render({ count, increment }) {
    return Box({
      padding: "1rem",
      children: [
        Text({ children: `Count: ${count.value}` }),
        Button({
          onClick: increment,
          children: "Increment",
        }),
      ],
    });
  },
});

// Mount the app
const rootElement = document.getElementById("root");
render(Counter(), rootElement);
```

## Core Concepts

### Components

Components are the building blocks of your UI. Each component encapsulates its own state and rendering logic.

```tsx
const MyComponent = component({
  name: "MyComponent",

  // Initialize component state and behavior
  setup(props) {
    // Logic here...
    return {
      /* state and methods */
    };
  },

  // Render the component
  render(setupResult) {
    return /* UI elements */;
  },
});
```

### Reactive State

State in Bloxi is reactive - when it changes, your UI updates automatically.

```tsx
const count = state(0); // Create reactive state

// Reading state
console.log(count.value); // 0

// Updating state (triggers UI updates)
count.value = 5;

// Compute derived state
const doubled = computed(() => count.value * 2);
```

### Lifecycle Hooks

Respond to component lifecycle events.

```tsx
import { component, onMount, onUnmount } from "@bloxi/core";

const MyComponent = component({
  setup() {
    onMount(() => {
      console.log("Component mounted");

      // Setup event listeners, timers, etc.
      const timer = setInterval(() => {
        // Do something...
      }, 1000);

      onUnmount(() => {
        // Clean up
        clearInterval(timer);
      });
    });

    return {};
  },
  render() {
    return /* UI elements */;
  },
});
```

## Package Structure

The Bloxi framework is organized into several packages:

- **@bloxi/core**: Core framework functionality (virtual DOM, reactivity, components)
- **@bloxi/components**: UI component library built on top of core
- **@bloxi/cli**: Command-line tools for project scaffolding (coming soon)

## Contributing

Contributions are welcome! Please feel free to submit a pull request.

## License

MIT
