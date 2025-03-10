// packages/components/src/ui/Button.ts
import { component, h } from '@bloxi/core';
import { ButtonProps } from '../types';

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
  name: 'Button',
  
  setup(props) {
    return props;
  },
  
  render(props) {
    const { 
      children, 
      onClick,
      className = '',
      style = {},
      disabled = false,
      type = 'button',
      variant = 'default' as keyof typeof variantStyles,
      size = 'md' as keyof typeof sizeStyles,
      fullWidth = false,
      icon,
      iconPosition = 'left',
      ...rest 
    } = props;
    
    // Style maps for variants and sizes
    const variantStyles = {
      default: {
        backgroundColor: '#f9fafb',
        color: '#111827',
        border: '1px solid #d1d5db'
      },
      primary: {
        backgroundColor: '#3b82f6',
        color: '#ffffff',
        border: 'none'
      },
      secondary: {
        backgroundColor: '#6b7280',
        color: '#ffffff',
        border: 'none'
      },
      danger: {
        backgroundColor: '#ef4444',
        color: '#ffffff',
        border: 'none'
      },
      success: {
        backgroundColor: '#10b981',
        color: '#ffffff',
        border: 'none'
      },
      warning: {
        backgroundColor: '#f59e0b',
        color: '#ffffff',
        border: 'none'
      },
      info: {
        backgroundColor: '#3b82f6',
        color: '#ffffff',
        border: 'none'
      }
    };
    
    const sizeStyles = {
      xs: {
        padding: '0.25rem 0.5rem',
        fontSize: '0.75rem'
      },
      sm: {
        padding: '0.375rem 0.75rem',
        fontSize: '0.875rem'
      },
      md: {
        padding: '0.5rem 1rem',
        fontSize: '1rem'
      },
      lg: {
        padding: '0.625rem 1.25rem',
        fontSize: '1.125rem'
      },
      xl: {
        padding: '0.75rem 1.5rem',
        fontSize: '1.25rem'
      }
    };
    
    // Build button style
    const buttonStyle = {
      cursor: disabled ? 'not-allowed' : 'pointer',
      borderRadius: '0.25rem',
      fontWeight: 500,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      opacity: disabled ? 0.7 : 1,
      width: fullWidth ? '100%' : undefined,
      ...(variantStyles[variant as keyof typeof variantStyles] || variantStyles.default),
      ...(sizeStyles[size as keyof typeof sizeStyles]),
      ...style
    };
    
    // Prepare content including icon if present
    let content = [];
    
    // Add icon and content based on position
    if (icon && iconPosition === 'left') {
      content.push(icon);
      if (children) {
        content.push(h('span', { style: { marginLeft: '0.5rem' } }, children));
      }
    } else if (icon && iconPosition === 'right') {
      if (children) {
        content.push(h('span', { style: { marginRight: '0.5rem' } }, children));
      }
      content.push(icon);
    } else {
      // No icon or invalid position, just use children
      content = children ? (Array.isArray(children) ? children : [children]) : [];
    }
    
    // Create button element
    return h('button', {
      type,
      disabled,
      onClick,
      style: buttonStyle,
      className,
      ...rest
    }, ...content);
  }
});

export default Button;