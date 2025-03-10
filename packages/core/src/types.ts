/**
 * VNode Types
 */
export type VNodeType = string | symbol;

/**
 * VNode Properties Interface
 */
export interface VNodeProps {
  [key: string]: any;
  children?: VNode[];
  _bloxi?: {
    key?: string | number;
    ref?: any;
    events?: Record<string, EventListener>;
    component?: any;
    props?: Record<string, any>;
  };
}

/**
 * Virtual DOM Node
 */
export interface VNode {
  type: VNodeType;
  props: VNodeProps;
  children: VNode[];
  key?: string | number;
}

/**
 * DOM node instance tracking
 */
export interface DOMInstance {
  domNode: Node;
  vNode: VNode;
  componentInstance?: ComponentInstance;
  childInstances: DOMInstance[];
}

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
export interface ComponentFactory<P = Record<string, any>> {
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
  props: Record<string, any>;

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

  /** Flag for scheduling updates */
  needsUpdate: boolean;
}

/**
 * Component lifecycle hooks interface
 */
export interface LifecycleHooks {
  /** Called before the component mounts */
  beforeMount: () => void;

  /** Called after the component has mounted */
  mounted: () => void;

  /** Called before the component updates */
  beforeUpdate: () => void;

  /** Called after the component has updated */
  updated: () => void;

  /** Called before the component unmounts */
  beforeUnmount: () => void;

  /** Called after the component has unmounted */
  unmounted: () => void;
}
