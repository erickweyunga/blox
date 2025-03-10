import { StateSubscribers } from "./state";
import { scheduleUpdate } from "../engine/renderer";
import {
  setCurrentInstance,
  getCurrentInstance,
  clearCurrentInstance,
} from "../component/lifecycle";

/**
 * Effect function type with dependencies tracking
 */
export type EffectFn = {
  (): void;
  _isEffect: boolean;
  _dependencies: Set<StateSubscribers>;
  _cleanup?: () => void;
  _instance?: any; // Component instance this effect belongs to
};

/**
 * Store for tracking active effects
 */
let activeEffect: EffectFn | null = null;
const effectStack: EffectFn[] = [];

// Re-export lifecycle instance management
export { setCurrentInstance, getCurrentInstance, clearCurrentInstance };

/**
 * Track the current effect as dependent on the given subscribers
 */
export function trackEffect(subscribers: StateSubscribers): void {
  if (activeEffect) {
    // Register this state as a dependency of the active effect
    subscribers.add(activeEffect);

    // Register this subscription to be cleaned up when the effect is re-run
    activeEffect._dependencies.add(subscribers);
  }
}

/**
 * Trigger all effects subscribed to the state
 */
// Add this to the beginning of triggerEffects function
export function triggerEffects<T>(subscribers: StateSubscribers): void {
  console.log('🔄 triggerEffects called with', subscribers.size, 'subscribers');
  
  // Collect all component instances that need updates
  const componentInstances = new Set<any>();
  
  // Run effects in a new Set to avoid issues if set changes during iteration
  const effects = new Set(subscribers);
  effects.forEach(effect => {
    console.log('  ▶️ Running effect', effect._instance ? 'for component' : 'standalone');
    
    // Schedule component update if this effect belongs to a component
    if (effect._instance) {
      componentInstances.add(effect._instance);
    }
    
    // Run the effect
    effect();
  });
  
  // Schedule updates for affected components
  componentInstances.forEach(instance => {
    console.log('  📅 Scheduling update for component', instance.def.name);
    if (instance) {
      scheduleUpdate(instance);
    }
  });
}

/**
 * Effect options interface
 */
export interface EffectOptions {
  instance?: any;
  lazy?: boolean;
}

/**
 * Creates a reactive effect that re-runs when dependencies change
 * @param fn Effect function to run
 * @param options Options for the effect
 * @returns Cleanup function
 */
export function effect(
  fn: () => void,
  options: EffectOptions = {}
): () => void {
  // Create effect function with tracking properties
  const effectFn: EffectFn = () => {
    // Clean up existing tracked dependencies
    cleanupEffect(effectFn);

    // Set this effect as active during execution
    activeEffect = effectFn;
    effectStack.push(effectFn);

    try {
      // Run the effect
      fn();
    } finally {
      // Remove from active tracking
      effectStack.pop();
      activeEffect = effectStack[effectStack.length - 1] || null;
    }
  };

  // Mark as effect and setup tracking
  effectFn._isEffect = true;
  effectFn._dependencies = new Set();

  // Associate with component instance if provided
  if (options.instance) {
    effectFn._instance = options.instance;
  } else {
    // Try to get current instance from setup context
    const currentInstance = getCurrentInstance();
    if (currentInstance) {
      effectFn._instance = currentInstance;
    }
  }

  // Run effect immediately unless lazy is true
  if (!options.lazy) {
    effectFn();
  }

  // Return cleanup function
  return () => {
    cleanupEffect(effectFn);
    if (effectFn._cleanup) {
      effectFn._cleanup();
    }
  };
}

/**
 * Clean up an effect's dependencies
 */
function cleanupEffect(effectFn: EffectFn): void {
  // Remove this effect from all tracked dependencies
  effectFn._dependencies.forEach((deps) => {
    deps.delete(effectFn);
  });

  // Clear tracked dependencies
  effectFn._dependencies.clear();
}

/**
 * Creates a computed effect that only re-runs when dependencies change and its value is accessed
 * @param getter Function to compute the value
 * @returns Computed result
 */
export function computed<T>(getter: () => T): { value: T } {
  let value: T;
  let dirty = true;

  const runner = effect(
    () => {
      value = getter();
      dirty = false;
    },
    { lazy: true }
  );

  return {
    get value() {
      if (dirty) {
        runner();
      }
      trackEffect(new Set([runner as unknown as EffectFn]));
      return value;
    },
  };
}
