# @blox/core

A lightweight React component library with Tailwind CSS for rapid UI development.

## Features

- 50+ React components built with Tailwind CSS
- Context-based state management
- Themeable with CSS variables
- TypeScript support
- Responsive design

## Installation

```bash
# Using bun
bun add @blox/core

# Using npm
npm install @blox/core

# Using yarn
yarn add @blox/core
```

## Usage

Wrap your application with the providers:

```jsx
import { ThemeProvider, AppProvider } from '@blox/core';

function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <YourApp />
      </AppProvider>
    </ThemeProvider>
  );
}
```

Use components:

```jsx
import {
  Container,
  Row,
  Column,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Text,
  useAppContext
} from '@blox/core';

function Counter() {
  const [count, setCount] = useAppContext('count', 0);

  return (
    <Container>
      <Card>
        <CardHeader>
          <Text variant="h2">Counter</Text>
        </CardHeader>
        <CardBody>
          <Text>Count: {count}</Text>
        </CardBody>
        <CardFooter>
          <Row gap="sm">
            <Button onClick={() => setCount(count - 1)}>Decrement</Button>
            <Button onClick={() => setCount(count + 1)}>Increment</Button>
          </Row>
        </CardFooter>
      </Card>
    </Container>
  );
}
```

## Component List

### Layout Components
- Container
- Row
- Column
- Grid
- Box
- Spacer
- Divider
- Stack
- AspectRatio
- ScrollView
- Flex
- Overlay

### UI Elements
- Text
- Button
- Card
- Image
- Icon
- Badge
- Avatar
- Alert
- Progress
- Skeleton
- Tooltip
- Modal
- Drawer
- Tabs
- Breadcrumbs
- Pagination
- Chip
- Marquee
- Toast
- Rating

### Form Components
- Input
- Checkbox
- Radio
- Select
- Switch
- Slider
- FileInput
- DatePicker
- Label
- ValidationMessage

### Data Display
- Table
- List
- ListItem
- Accordion
- Tree
- Chart
- Timeline
- Carousel

### Advanced
- Animate
- Fetch
- Portal
- DragDrop
- Resizable

## State Management

The library provides a simple context-based state management system:

```jsx
import { useAppContext } from '@blox/core';

// In your component
const [value, setValue] = useAppContext('someKey', initialValue);

// Update state
setValue(newValue);
```

## Theming

Customize the theme by using the ThemeProvider:

```jsx
import { ThemeProvider, defaultTheme } from '@blox/core';

const myTheme = {
  ...defaultTheme,
  colors: {
    ...defaultTheme.colors,
    primary: '#007bff',
    secondary: '#6c757d',
  }
};

function App() {
  return (
    <ThemeProvider initialTheme={myTheme}>
      <YourApp />
    </ThemeProvider>
  );
}
```

## Contributing

Contributions are welcome! Please feel free to submit a PR.

## License

MIT