import { StateSubscribers } from "./state";

/**
 * Effect function type with dependencies tracking
 */
export type EffectFn = {
  (): void;
  _isEffect: boolean;
  _dependencies: Set<StateSubscribers>;
  _cleanup?: () => void;
};

/**
 * Store for tracking active effects
 */
let activeEffect: EffectFn | null = null;
const effectStack: EffectFn[] = [];

/**
 * Flag to track if rendering is scheduled
 */
let renderScheduled = false;

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
 * Schedule a DOM update
 */
function scheduleRender() {
  if (!renderScheduled) {
    renderScheduled = true;
    requestAnimationFrame(() => {
      // This would call into the renderer to update the DOM
      // For now we'll just reset the flag
      renderScheduled = false;
    });
  }
}

/**
 * Trigger all effects subscribed to the state
 */
export function triggerEffects(subscribers: StateSubscribers): void {
  // Run effects in a new Set to avoid issues if set changes during iteration
  const effects = new Set(subscribers);
  effects.forEach((effect) => effect());

  // Schedule a render update
  scheduleRender();
}

/**
 * Creates a reactive effect that re-runs when dependencies change
 * @param fn Effect function to run
 * @returns Cleanup function
 */
export function effect(fn: () => void): () => void {
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

  // Run effect immediately
  effectFn();

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
 * Run an effect once at component initialization (similar to React's useEffect with empty deps)
 * @param fn Effect function to run once
 */
export function onMount(fn: () => void | (() => void)): void {
  if (!activeEffect) {
    console.warn("onMount called outside of component setup");
    return;
  }

  const cleanup = fn();
  if (typeof cleanup === "function") {
    activeEffect._cleanup = cleanup;
  }
}

/**
 * Set up an effect to run when component is unmounted
 * @param fn Cleanup function to run on unmount
 */
export function onUnmount(fn: () => void): void {
  if (!activeEffect) {
    console.warn("onUnmount called outside of component setup");
    return;
  }

  const originalCleanup = activeEffect._cleanup;
  activeEffect._cleanup = () => {
    if (originalCleanup) originalCleanup();
    fn();
  };
}
