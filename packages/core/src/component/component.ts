import { createComponentVNode } from "../engine/vdom";
import {
  effect,
  setCurrentInstance,
  clearCurrentInstance,
} from "../reactivity/effect";
import {
  ComponentFactory,
  ComponentInstance,
  ComponentOptions,
  VNode,
} from "../types";
import { createLifecycleHooks } from "./lifecycle";

/**
 * Component registry to store global components
 */
export const componentRegistry = new Map<string, ComponentFactory<any>>();

/**
 * Create a component definition
 */
export function component<
  P extends Record<string, any> = Record<string, any>,
  S = any
>(options: ComponentOptions<P, S>): ComponentFactory<P> {
  if (!options.name) {
    throw new Error("Component must have a name");
  }

  // Create the component factory function
  const componentFactory: ComponentFactory<P> = (props = {} as P) => {
    // Return a component vnode
    return createComponentVNode(options, props);
  };

  // Set display name for debugging
  componentFactory.displayName = options.name;

  // Register component globally
  componentRegistry.set(options.name, componentFactory);

  return componentFactory;
}

/**
 * Mount a component instance
 */
export function mountComponent(
  componentVNode: VNode,
  parentElement: HTMLElement | null = null
): ComponentInstance {
  const componentDef = componentVNode.props._bloxi?.component;
  const componentProps = componentVNode.props._bloxi?.props || {};

  // Create lifecycle hooks for this instance
  const lifecycle = createLifecycleHooks(componentDef.hooks || {});

  // Create component instance
  const instance: ComponentInstance = {
    def: componentDef,
    props: componentProps,
    setupResult: null,
    vnode: null,
    lifecycle,
    cleanup: null,
    isMounted: false,
    needsUpdate: false,
  };

  // Set up the component
  if (componentDef.setup) {
    // Set current instance for lifecycle hooks
    setCurrentInstance(instance);

    try {
      // Run the setup function to get state and methods
      instance.setupResult = componentDef.setup(componentProps);
    } finally {
      // Reset current instance
      clearCurrentInstance();
    }
  } else {
    instance.setupResult = {} as any;
  }

  // Create the render effect - this is the key to reactivity
  const renderEffect = () => {
    try {
      // Call lifecycle hooks
      if (instance.isMounted) {
        lifecycle.beforeUpdate();
      } else {
        lifecycle.beforeMount();
      }

      // IMPORTANT: We directly pass the setupResult to render
      // without unwrapping state values to maintain reactivity
      const newVNode = componentDef.render(instance.setupResult);

      // Store the vnode for diffing
      instance.vnode = newVNode;

      // Reset the update flag
      instance.needsUpdate = false;

      // Call mounted or updated hooks after DOM update
      if (!instance.isMounted) {
        instance.isMounted = true;
        queueMicrotask(() => lifecycle.mounted());
      } else {
        queueMicrotask(() => lifecycle.updated());
      }

      return newVNode;
    } catch (error) {
      console.error(`Error rendering component ${componentDef.name}:`, error);
      throw error;
    }
  };

  // Set up effect for reactivity
  instance.cleanup = effect(renderEffect, { instance });

  return instance;
}

/**
 * Update a component instance with new props
 */
export function updateComponent(
  instance: ComponentInstance,
  newProps: Record<string, any>
): void {
  console.log('🔄 updateComponent called for', instance.def.name);
  
  // Skip update if props haven't changed
  if (JSON.stringify(instance.props) === JSON.stringify(newProps)) {
    console.log('  ⏭️ Skipping update - props unchanged');
    return;
  }
  
  // Update props
  console.log('  ✏️ Updating props');
  instance.props = newProps;
  
  // Mark for update
  instance.needsUpdate = true;
  
  // Force a re-render
  console.log('  🔄 Forcing re-render');
  if (instance.cleanup) {
    const oldCleanup = instance.cleanup;
    
    try {
      // Create a new render effect
      const newRenderEffect = () => {
        console.log('    📄 Re-rendering with updated props');
        return instance.def.render(instance.setupResult);
      };
      
      // Re-create the effect
      instance.cleanup = effect(newRenderEffect, { instance });
      
      // Clean up old effect
      oldCleanup();
      
      console.log('  ✅ Re-render complete');
    } catch (err) {
      console.error('  ❌ Error in re-render:', err);
    }
  } else {
    console.log('  ⚠️ No cleanup function - cannot re-render');
  }
}

/**
 * Unmount a component instance
 */
export function unmountComponent(instance: ComponentInstance): void {
  // Call beforeUnmount lifecycle hook
  instance.lifecycle.beforeUnmount();

  // Clean up the effect
  if (instance.cleanup) {
    instance.cleanup();
    instance.cleanup = null;
  }

  // Call unmounted lifecycle hook
  instance.lifecycle.unmounted();
}
