import {
  VNode,
  isComponentVNode,
  // isTextVNode,
  COMPONENT_SYMBOL,
  TEXT_SYMBOL,
} from "./vdom";
import {
  mountComponent,
  unmountComponent,
  ComponentInstance,
} from "../component/component";

/**
 * DOM node instance tracking
 */
interface DOMInstance {
  domNode: Node;
  vNode: VNode;
  componentInstance?: ComponentInstance;
  childInstances: DOMInstance[];
}

// Root instance for the application
let rootInstance: DOMInstance | null = null;

/**
 * Render a virtual DOM tree to a DOM container
 */
export function render(vnode: VNode, container: HTMLElement): void {
  // Compare with previous render
  const prevInstance = rootInstance;
  const nextInstance = reconcile(container, prevInstance, vnode);

  // Store the new instance as the root
  rootInstance = nextInstance;
}

/**
 * Reconcile virtual DOM with actual DOM
 */
function reconcile(
  parentDom: Node,
  instance: DOMInstance | null,
  vnode: VNode | null
): DOMInstance | null {
  // No previous instance, create a new one
  if (instance === null) {
    if (!vnode) return null;

    // Create new DOM instance
    const newInstance = createDOMInstance(vnode, parentDom);
    return newInstance;
  }

  // No new vnode, remove the DOM node
  if (vnode === null) {
    unmountDOMInstance(instance);
    parentDom.removeChild(instance.domNode);
    return null;
  }

  // Both exist, update if needed
  if (instance.vNode.type === vnode.type) {
    // Same type, update in place
    updateDOMInstance(instance, vnode);
    return instance;
  } else {
    // Different types, replace completely
    const newInstance = createDOMInstance(vnode, parentDom);

    // Replace the old node
    if (instance.domNode.parentNode) {
      unmountDOMInstance(instance);
      parentDom.replaceChild(newInstance.domNode, instance.domNode);
    }

    return newInstance;
  }
}

/**
 * Create a new DOM instance from a vnode
 */
function createDOMInstance(vnode: VNode, parentDom: Node | null): DOMInstance {
  let domNode: Node;
  let componentInstance: ComponentInstance | undefined;
  let childInstances: DOMInstance[] = [];

  // Handle different vnode types
  if (vnode.type === TEXT_SYMBOL) {
    // Text node
    domNode = document.createTextNode(String(vnode.props.nodeValue || ""));
  } else if (vnode.type === COMPONENT_SYMBOL) {
    // Component node
    componentInstance = mountComponent(
      vnode
      // parentDom as HTMLElement
    );
    const renderedVNode = componentInstance.vnode;

    if (!renderedVNode) {
      throw new Error("Component did not render a valid vnode");
    }

    // Create DOM for rendered vnode
    const childInstance = createDOMInstance(renderedVNode, parentDom);
    domNode = childInstance.domNode;
    childInstances = [childInstance];
  } else {
    // Regular DOM element
    domNode = document.createElement(vnode.type as string);

    // Set attributes and properties
    setDOMAttributes(domNode as HTMLElement, vnode);

    // Create children
    childInstances = vnode.children.map((childVNode) => {
      const childInstance = createDOMInstance(childVNode, domNode);
      domNode.appendChild(childInstance.domNode);
      return childInstance;
    });
  }

  // Only append to parent if provided
  if (parentDom && !isComponentVNode(vnode)) {
    parentDom.appendChild(domNode);
  }

  // Create and return the instance
  return {
    domNode,
    vNode: vnode,
    componentInstance,
    childInstances,
  };
}

/**
 * Update a DOM instance with a new vnode
 */
function updateDOMInstance(instance: DOMInstance, newVNode: VNode): void {
  // Handle different node types
  if (instance.vNode.type === TEXT_SYMBOL && newVNode.type === TEXT_SYMBOL) {
    // Update text node
    if (instance.vNode.props.nodeValue !== newVNode.props.nodeValue) {
      (instance.domNode as Text).nodeValue = String(
        newVNode.props.nodeValue || ""
      );
    }
  } else if (
    instance.vNode.type === COMPONENT_SYMBOL &&
    newVNode.type === COMPONENT_SYMBOL
  ) {
    // Update component
    if (instance.componentInstance) {
      // Update component props
      instance.componentInstance.props = newVNode.props._bloxi?.props || {};

      // The component will re-render automatically through its effect
      const renderedVNode = instance.componentInstance.vnode;

      if (renderedVNode && instance.childInstances.length > 0) {
        // Update the DOM for the rendered output
        updateDOMInstance(instance.childInstances[0], renderedVNode);
      }
    }
  } else {
    // Regular DOM element
    const domElement = instance.domNode as HTMLElement;

    // Diff and update attributes
    updateDOMAttributes(domElement, instance.vNode, newVNode);

    // Update children using reconciliation
    updateChildren(domElement, instance.childInstances, newVNode.children);
  }

  // Update the stored vnode
  instance.vNode = newVNode;
}

/**
 * Set DOM attributes from vnode props
 */
function setDOMAttributes(element: HTMLElement, vnode: VNode): void {
  const props = vnode.props;

  // Process each prop
  Object.keys(props).forEach((key) => {
    // Skip special props or children
    if (key === "children" || key === "_bloxi") return;

    const value = props[key];

    // Event handlers
    if (key.startsWith("on") && typeof value === "function") {
      const eventName = key.slice(2).toLowerCase();
      element.addEventListener(eventName, value);
    }
    // Style object
    else if (key === "style" && typeof value === "object") {
      Object.assign(element.style, value);
    }
    // Class name string
    else if (key === "className") {
      element.setAttribute("class", value);
    }
    // Other attributes
    else if (typeof value !== "function") {
      if (value === true) {
        element.setAttribute(key, "");
      } else if (value !== false && value != null) {
        element.setAttribute(key, String(value));
      }
    }
  });
}

/**
 * Update DOM attributes based on vnode changes
 */
function updateDOMAttributes(
  element: HTMLElement,
  oldVNode: VNode,
  newVNode: VNode
): void {
  const oldProps = oldVNode.props;
  const newProps = newVNode.props;

  // Remove old props that are no longer present
  Object.keys(oldProps).forEach((key) => {
    if (key === "children" || key === "_bloxi") return;

    // Skip if prop still exists in new props
    if (key in newProps) return;

    const value = oldProps[key];

    // Remove event listener
    if (key.startsWith("on") && typeof value === "function") {
      const eventName = key.slice(2).toLowerCase();
      element.removeEventListener(eventName, value);
    }
    // Remove attribute
    else if (key !== "children" && key !== "style") {
      element.removeAttribute(key === "className" ? "class" : key);
    }
  });

  // Set new or changed props
  Object.keys(newProps).forEach((key) => {
    if (key === "children" || key === "_bloxi") return;

    const oldValue = oldProps[key];
    const newValue = newProps[key];

    // Skip if values haven't changed
    if (oldValue === newValue) return;

    // Update event listener
    if (key.startsWith("on") && typeof newValue === "function") {
      const eventName = key.slice(2).toLowerCase();
      if (typeof oldValue === "function") {
        element.removeEventListener(eventName, oldValue);
      }
      element.addEventListener(eventName, newValue);
    }
    // Update style object
    else if (key === "style" && typeof newValue === "object") {
      // Reset styles first if objects are different
      if (typeof oldValue !== "object" || oldValue === null) {
        element.removeAttribute("style");
      }
      Object.assign(element.style, newValue);
    }
    // Update className
    else if (key === "className") {
      element.setAttribute("class", newValue);
    }
    // Update other attributes
    else if (typeof newValue !== "function") {
      if (newValue === true) {
        element.setAttribute(key, "");
      } else if (newValue !== false && newValue != null) {
        element.setAttribute(key, String(newValue));
      } else {
        element.removeAttribute(key);
      }
    }
  });
}

/**
 * Update child elements through reconciliation
 */
function updateChildren(
  parentDom: HTMLElement,
  childInstances: DOMInstance[],
  childVNodes: VNode[]
): DOMInstance[] {
  const newChildInstances: DOMInstance[] = [];
  const maxLength = Math.max(childInstances.length, childVNodes.length);

  // Process each index
  for (let i = 0; i < maxLength; i++) {
    const childInstance = i < childInstances.length ? childInstances[i] : null;
    const childVNode = i < childVNodes.length ? childVNodes[i] : null;

    // Reconcile this child
    const newChildInstance = reconcile(parentDom, childInstance, childVNode);

    if (newChildInstance) {
      newChildInstances.push(newChildInstance);
    }
  }

  return newChildInstances;
}

/**
 * Unmount a DOM instance and its children
 */
function unmountDOMInstance(instance: DOMInstance): void {
  // Unmount component if this is a component instance
  if (instance.componentInstance) {
    unmountComponent(instance.componentInstance);
  }

  // Recursively unmount children
  instance.childInstances.forEach(unmountDOMInstance);
}
