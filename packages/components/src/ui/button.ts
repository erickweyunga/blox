import { component, h, state } from "@bloxi/core";
import { ButtonProps, ButtonVariant } from "../types";

/**
 * Button - Interactive button component
 *
 * A versatile button component with various styles, sizes, and states
 *
 * @example
 * ```tsx
 * <Button variant="primary" onClick={() => console.log('Clicked!')}>
 *   Click me
 * </Button>
 * ```
 */
export const Button = component<ButtonProps>({
  name: "Button",

  setup(props) {
    // Track hover state
    const isHovered = state(false);

    // Track active (pressed) state
    const isActive = state(false);

    // Event handlers
    const handleMouseEnter = () => {
      isHovered.value = true;
    };

    const handleMouseLeave = () => {
      isHovered.value = false;
      isActive.value = false;
    };

    const handleMouseDown = () => {
      isActive.value = true;
    };

    const handleMouseUp = () => {
      isActive.value = false;
    };

    return {
      ...props,
      isHovered,
      isActive,
      handleMouseEnter,
      handleMouseLeave,
      handleMouseDown,
      handleMouseUp,
    };
  },

  render(props) {
    const {
      children,
      onClick,
      className = "",
      style = {},
      disabled = false,
      type = "button",
      variant = "default",
      size = "md",
      fullWidth = false,
      icon,
      iconPosition = "left",
      isHovered,
      isActive,
      handleMouseEnter,
      handleMouseLeave,
      handleMouseDown,
      handleMouseUp,
      ...rest
    } = props;

    // Style maps for variants and sizes
    const variantStyles = {
      default: {
        backgroundColor: "#f9fafb",
        color: "#111827",
        border: "1px solid #d1d5db",
        hover: {
          backgroundColor: "#f3f4f6",
          borderColor: "#c0c7d2",
        },
        active: {
          backgroundColor: "#e5e7eb",
          borderColor: "#b6bfc9",
        },
      },
      primary: {
        backgroundColor: "#3b82f6",
        color: "#ffffff",
        border: "none",
        hover: {
          backgroundColor: "#2563eb",
        },
        active: {
          backgroundColor: "#1d4ed8",
        },
      },
      secondary: {
        backgroundColor: "#6b7280",
        color: "#ffffff",
        border: "none",
        hover: {
          backgroundColor: "#4b5563",
        },
        active: {
          backgroundColor: "#374151",
        },
      },
      danger: {
        backgroundColor: "#ef4444",
        color: "#ffffff",
        border: "none",
        hover: {
          backgroundColor: "#dc2626",
        },
        active: {
          backgroundColor: "#b91c1c",
        },
      },
      success: {
        backgroundColor: "#10b981",
        color: "#ffffff",
        border: "none",
        hover: {
          backgroundColor: "#059669",
        },
        active: {
          backgroundColor: "#047857",
        },
      },
      warning: {
        backgroundColor: "#f59e0b",
        color: "#ffffff",
        border: "none",
        hover: {
          backgroundColor: "#d97706",
        },
        active: {
          backgroundColor: "#b45309",
        },
      },
      info: {
        backgroundColor: "#3b82f6",
        color: "#ffffff",
        border: "none",
        hover: {
          backgroundColor: "#2563eb",
        },
        active: {
          backgroundColor: "#1d4ed8",
        },
      },
    };

    const sizeStyles = {
      xs: {
        padding: "0.25rem 0.5rem",
        fontSize: "0.75rem",
      },
      sm: {
        padding: "0.375rem 0.75rem",
        fontSize: "0.875rem",
      },
      md: {
        padding: "0.5rem 1rem",
        fontSize: "1rem",
      },
      lg: {
        padding: "0.625rem 1.25rem",
        fontSize: "1.125rem",
      },
      xl: {
        padding: "0.75rem 1.5rem",
        fontSize: "1.25rem",
      },
    };

    // Get the current variant style
    const currentVariant = variantStyles[variant as ButtonVariant] || variantStyles.default;

    // Build button style with hover and active states
    const buttonStyle = {
      cursor: disabled ? "not-allowed" : "pointer",
      borderRadius: "0.25rem",
      fontWeight: 500,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      opacity: disabled ? 0.7 : 1,
      width: fullWidth ? "100%" : undefined,
      transition: "background-color 0.2s, border-color 0.2s, transform 0.1s",
      // Base variant styles
      ...currentVariant,
      // Apply hover styles if hovered
      ...(isHovered.value && !disabled ? currentVariant.hover : {}),
      // Apply active styles if pressed
      ...(isActive.value && !disabled ? currentVariant.active : {}),
      // Apply transform effect on active
      ...(isActive.value && !disabled ? { transform: "translateY(1px)" } : {}),
      // Apply custom styles
      ...style,
    };

    // Prepare content including icon if present
    let content = [];

    // Add icon and content based on position
    if (icon && iconPosition === "left") {
      content.push(icon);
      if (children) {
        content.push(h("span", { style: { marginLeft: "0.5rem" } }, children));
      }
    } else if (icon && iconPosition === "right") {
      if (children) {
        content.push(h("span", { style: { marginRight: "0.5rem" } }, children));
      }
      content.push(icon);
    } else {
      // No icon or invalid position, just use children
      content = children
        ? Array.isArray(children)
          ? children
          : [children]
        : [];
    }

    // Create button element with hover event handlers
    return h(
      "button",
      {
        type,
        disabled,
        onClick,
        style: buttonStyle,
        className,
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave,
        onMouseDown: handleMouseDown,
        onMouseUp: handleMouseUp,
        ...rest,
      },
      ...content
    );
  },
});

export default Button;
