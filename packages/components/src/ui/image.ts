import { component, h, state } from "@bloxi/core";
import { ImageProps } from "../types";

/**
 * Image - Enhanced image component
 *
 * An image component with support for object-fit, lazy loading, and fallback content
 *
 * @example
 * ```tsx
 * <Image
 *   src="/path/to/image.jpg"
 *   alt="Description"
 *   width="300px"
 *   height="200px"
 *   fit="cover"
 * />
 * ```
 */
export const Image = component<ImageProps>({
  name: "Image",

  setup(props) {
    // Track loading state
    const hasError = state(false);

    // Handle error
    const handleError = () => {
      hasError.value = true;
    };

    return {
      ...props,
      hasError,
      handleError,
    };
  },

  render(props) {
    const {
      src,
      alt = "",
      style = {},
      className = "",
      width,
      height,
      fit = "cover",
      position,
      loading,
      fallback,
      hasError,
      handleError,
      ...rest
    } = props;

    // If there's an error and a fallback is provided, show the fallback
    if (hasError.value && fallback) {
      return fallback;
    }

    // Build image style
    const imageStyle = {
      objectFit: fit,
      ...(position && { objectPosition: position }),
      ...(width !== undefined && { width }),
      ...(height !== undefined && { height }),
      ...style,
    };

    // Create image element
    return h("img", {
      src,
      alt,
      loading,
      style: imageStyle,
      className,
      onError: handleError,
      ...rest,
    });
  },
});

export default Image;
