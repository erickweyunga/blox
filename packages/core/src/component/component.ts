import { createComponentVNode, VNode } from '../engine/vdom';
import { effect, unwrapState } from '../reactivity/state';
import { createLifecycleHooks, LifecycleHooks } from './lifecycle';

/**
 * Component setup function type
 */
export type SetupFn<P = any, S = any> = (props: P) => S;

/**
 * Component render function type
 */
export type RenderFn<S = any> = (setupResult: S) => VNode;

/**
 * Component options
 */
export interface ComponentOptions<P = any, S = any> {
  /** Component name */
  name: string;
  
  /** Setup function that initializes state and behavior */
  setup?: SetupFn<P, S>;
  
  /** Render function that returns the virtual DOM */
  render: RenderFn<S>;
  
  /** Lifecycle hooks */
  hooks?: Partial<LifecycleHooks>;
}

/**
 * Component factory function
 */
export interface ComponentFactory<P = any> {
  (props?: P): VNode;
  displayName: string;
}

/**
 * Internal component instance
 */
export interface ComponentInstance<S = any> {
  /** Component definition */
  def: ComponentOptions;
  
  /** Current props */
  props: any;
  
  /** Setup result with state and methods */
  setupResult: S;
  
  /** Last rendered vnode */
  vnode: VNode | null;
  
  /** Lifecycle hooks for this instance */
  lifecycle: LifecycleHooks;
  
  /** Effect cleanup function */
  cleanup: (() => void) | null;
  
  /** Whether component is mounted */
  isMounted: boolean;
}

/**
 * Component registry to store global components
 */
export const componentRegistry = new Map<string, ComponentFactory>();

/**
 * Create a component definition
 */
export function component<P = any, S = any>(
  options: ComponentOptions<P, S>
): ComponentFactory<P> {
  if (!options.name) {
    throw new Error('Component must have a name');
  }
  
  // Create the component factory function
  const componentFactory: ComponentFactory<P> = (props?: P) => {
    // Return a component vnode
    return createComponentVNode(options, props as Record<string, any>);
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
  // parentElement: HTMLElement | null
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
    isMounted: false
  };
  
  // Set up the component
  if (componentDef.setup) {
    // Run the setup function to get state and methods
    instance.setupResult = componentDef.setup(componentProps);
  } else {
    instance.setupResult = {} as any;
  }
  
  // Setup reactive rendering
  const renderEffect = () => {
    try {
      // Call beforeUpdate or beforeMount
      if (instance.isMounted) {
        lifecycle.beforeUpdate();
      } else {
        lifecycle.beforeMount();
      }
      
      // Get the rendered vnode by calling the render function with setup result
      const rawSetupResult = Object.keys(instance.setupResult || {}).reduce((acc, key) => {
        // Unwrap any state values to their raw values
        acc[key] = unwrapState(instance.setupResult[key]);
        return acc;
      }, {} as Record<string, any>);
      
      // Render the component
      const newVNode = componentDef.render(rawSetupResult);
      
      // Store the vnode for diffing
      instance.vnode = newVNode;
      
      // Call mounted or updated
      if (!instance.isMounted) {
        instance.isMounted = true;
        // Schedule mounted call after DOM is updated
        Promise.resolve().then(() => lifecycle.mounted());
      } else {
        // Schedule updated call after DOM is updated
        Promise.resolve().then(() => lifecycle.updated());
      }
      
      return newVNode;
    } catch (error) {
      console.error(`Error rendering component ${componentDef.name}:`, error);
      throw error;
    }
  };
  
  // Set up effect for reactivity
  instance.cleanup = effect(renderEffect);
  
  return instance;
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