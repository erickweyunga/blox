import { isComponentVNode, COMPONENT_SYMBOL, TEXT_SYMBOL } from "./vdom";
import {
  mountComponent,
  unmountComponent,
  updateComponent,
} from "../component/component";

// Root instance for the application
let rootInstance: DOMInstance | null = null;

// Flag to track if a render is scheduled
let isRenderScheduled = false;

// Queue of instances that need updating
const updateQueue: Set<ComponentInstance> = new Set();

/**
 * Schedule a render update
 */
export function scheduleUpdate(instance: ComponentInstance): void {
  // Add to update queue
  updateQueue.add(instance);

  // Schedule render if not already scheduled
  if (!isRenderScheduled) {
    isRenderScheduled = true;

    queueMicrotask(() => {
      processUpdates();
    });
  }
}

/**
 * Process all queued updates
 */
function processUpdates(): void {
  console.log("📋 Processing updates for", updateQueue.size, "components");
  isRenderScheduled = false;

  // Create a stable snapshot of components to update
  const instances = Array.from(updateQueue);
  updateQueue.clear();

  // Process each instance
  instances.forEach((instance) => {
    console.log(
      "  🔄 Processing update for component",
      instance.def.name,
      "mounted:",
      instance.isMounted
    );

    // Skip if instance is no longer mounted
    if (!instance.isMounted) {
      console.log("    ❌ Skipping unmounted component");
      return;
    }

    // Check if vnode exists
    console.log("    📄 Current vnode:", instance.vnode ? "exists" : "missing");

    // Force re-render
    if (instance.cleanup) {
      console.log("    🧹 Cleaning up previous effect");
      // Call cleanup function to remove previous effect
      const oldCleanup = instance.cleanup;
      instance.cleanup = null;
      try {
        oldCleanup();
      } catch (err) {
        console.error("      ❌ Error in cleanup:", err);
      }

      try {
        // Create a new render effect function
        console.log("    🔄 Creating new render effect");
        const newRenderEffect = () => {
          console.log("      📄 Rendering component", instance.def.name);
          const newVNode = instance.def.render(instance.setupResult);
          console.log("      🔄 New vnode created:", newVNode ? "yes" : "no");
          instance.vnode = newVNode;
          console.log("      ✅ Render complete");
          return newVNode;
        };

        // Re-create the effect
        console.log("    🔧 Setting up new effect for component");
        instance.cleanup = effect(newRenderEffect, { instance });
      } catch (err) {
        console.error("      ❌ Error in rendering:", err);
      }
    } else {
      console.log("    ⚠️ No cleanup function found for component");
    }
  });
}

// Import effect from reactivity
import { effect } from "../reactivity/effect";
import { ComponentInstance, DOMInstance, VNode } from "../types";

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
  console.log(
    "🔄 Reconciling:",
    instance ? instance.vNode.type.toString() : "null",
    "to",
    vnode ? vnode.type.toString() : "null"
  );

  // No previous instance, create a new one
  if (instance === null) {
    if (!vnode) return null;

    console.log("  🆕 Creating new DOM instance");
    // Create new DOM instance
    const newInstance = createDOMInstance(vnode, parentDom);
    return newInstance;
  }

  // No new vnode, remove the DOM node
  if (vnode === null) {
    console.log("  🗑️ Removing DOM instance");
    unmountDOMInstance(instance);

    // Critical fix: Only remove if it's a child of the parent
    if (instance.domNode.parentNode === parentDom) {
      parentDom.removeChild(instance.domNode);
    }
    return null;
  }

  // Both exist, update if needed
  if (instance.vNode.type === vnode.type) {
    // Same type, update in place
    console.log("  🔄 Updating existing DOM instance in place");
    updateDOMInstance(instance, vnode);
    return instance;
  } else {
    // Different types, replace completely
    console.log("  🔄 Replacing DOM instance with new type");
    const newInstance = createDOMInstance(vnode, parentDom);

    // Replace the old node
    if (instance.domNode.parentNode) {
      unmountDOMInstance(instance);

      try {
        // Critical fix: Only replace if it's a child of the parent
        if (instance.domNode.parentNode === parentDom) {
          parentDom.replaceChild(newInstance.domNode, instance.domNode);
        } else {
          console.log("  ⚠️ Cannot replace node: not a child of parent");
          // Append the new instance instead
          parentDom.appendChild(newInstance.domNode);
        }
      } catch (err) {
        console.error("  ❌ Error replacing node:", err);
        // Fallback: append the new node
        parentDom.appendChild(newInstance.domNode);
      }
    } else {
      // If old node isn't in the DOM, just append the new one
      console.log("  📎 Old node not in parent, appending new node");
      parentDom.appendChild(newInstance.domNode);
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
    componentInstance = mountComponent(vnode, parentDom as HTMLElement);
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
  console.log(
    "🔄 updateDOMInstance called for type:",
    typeof newVNode.type === "symbol" ? newVNode.type.toString() : newVNode.type
  );

  // Check if this is a component node
  if (
    instance.vNode.type === COMPONENT_SYMBOL &&
    newVNode.type === COMPONENT_SYMBOL
  ) {
    console.log("🧩 Updating component instance");
    if (instance.componentInstance) {
      // Get the latest rendered vnode
      const renderedVNode = instance.componentInstance.vnode;
      console.log("📑 Component rendered vnode exists:", !!renderedVNode);

      // Check children
      if (instance.childInstances.length > 0) {
        console.log(
          "👶 Child instances count:",
          instance.childInstances.length
        );
      } else {
        console.log("⚠️ No child instances found for component");
      }

      // Update the DOM for the rendered output
      if (renderedVNode && instance.childInstances.length > 0) {
        console.log("🔄 Updating child DOM instance with rendered vnode");
        updateDOMInstance(instance.childInstances[0], renderedVNode);
      }
    }
  } else if (
    instance.vNode.type !== COMPONENT_SYMBOL &&
    newVNode.type !== COMPONENT_SYMBOL
  ) {
    console.log("📌 Updating regular DOM element of type:", newVNode.type);

    // Log children
    console.log("👶 Children count:", newVNode.children.length);

    // Check if node is actually in the DOM
    if (instance.domNode.parentNode) {
      console.log("✅ DOM node is in the document");
    } else {
      console.log("❌ DOM node is NOT in the document");
    }

    // Update children
    updateChildren(
      instance.domNode as HTMLElement,
      instance.childInstances,
      newVNode.children
    );
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
  // Add debug logs
  console.log(
    "🔄 Updating children",
    "current DOM children:",
    childInstances.length,
    "new virtual children:",
    childVNodes.length
  );

  const newChildInstances: DOMInstance[] = [];
  const maxLength = Math.max(childInstances.length, childVNodes.length);

  // Process each index
  for (let i = 0; i < maxLength; i++) {
    const childInstance = i < childInstances.length ? childInstances[i] : null;
    const childVNode = i < childVNodes.length ? childVNodes[i] : null;

    // Log each child update
    console.log(
      `  Child ${i}:`,
      childInstance ? "exists in DOM" : "new",
      childVNode ? "exists in vDOM" : "removed"
    );

    // Special case: If childInstance exists but childVNode is null, we need to REMOVE the DOM node
    if (childInstance && !childVNode) {
      console.log(`  🗑️ Removing child ${i} from DOM`);
      unmountDOMInstance(childInstance);

      // Critical fix: Remove the actual DOM node from the parent
      if (childInstance.domNode.parentNode === parentDom) {
        parentDom.removeChild(childInstance.domNode);
      }
      continue; // Skip to next child
    }

    // Special case: If childVNode exists but childInstance is null, create a new DOM node
    if (!childInstance && childVNode) {
      console.log(`  🆕 Creating new child ${i} for DOM`);
      const newChildInstance = createDOMInstance(childVNode, parentDom);

      // Critical fix: Make sure the new DOM node is appended to the parent
      if (!parentDom.contains(newChildInstance.domNode)) {
        parentDom.appendChild(newChildInstance.domNode);
      }

      newChildInstances.push(newChildInstance);
      continue; // Skip to next child
    }

    // Both exist, so reconcile normally
    if (childInstance && childVNode) {
      console.log(`  🔄 Reconciling child ${i}`);
      const newChildInstance = reconcile(parentDom, childInstance, childVNode);

      if (newChildInstance) {
        // Make sure the DOM node is actually in the parent (critical fix)
        if (!parentDom.contains(newChildInstance.domNode)) {
          console.log(`  📎 Appending child ${i} to parent`);
          parentDom.appendChild(newChildInstance.domNode);
        }
        newChildInstances.push(newChildInstance);
      }
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
