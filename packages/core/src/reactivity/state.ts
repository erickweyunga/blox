// packages/core/src/reactivity/state.ts

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
 * Subscribers set for state changes
 */
export type StateSubscribers = Set<EffectFn>;

/**
 * State interface - the public API for reactive state
 */
export interface State<T> {
  /** Get the current value */
  value: T;

  /** Subscribe to state changes */
  subscribe: (callback: () => void) => () => void;

  /** Internal property to identify state objects */
  _isState: boolean;

  /** Internal property to access subscribers */
  _subscribers: StateSubscribers;
}

/**
 * Create a reactive state value
 *
 * @param initialValue The initial state value
 * @returns A reactive state object
 */
export function state<T>(initialValue: T): State<T> {
  // All subscribers to this state
  const subscribers: StateSubscribers = new Set();

  // Current value
  let internalValue = initialValue;

  // Create the reactive state object
  const stateObject: State<T> = {
    // Allow manually subscribing to changes
    subscribe(callback: () => void) {
      const wrappedCallback = () => callback();
      wrappedCallback._isEffect = true;
      wrappedCallback._dependencies = new Set();

      subscribers.add(wrappedCallback as EffectFn);

      // Return unsubscribe function
      return () => {
        subscribers.delete(wrappedCallback as EffectFn);
      };
    },

    // Internal properties
    _isState: true,
    _subscribers: subscribers,

    // Need to use getter/setter to track dependencies
    get value() {
      trackEffect(subscribers);
      return internalValue;
    },

    set value(newValue: T) {
      if (Object.is(internalValue, newValue)) return;
      internalValue = newValue;
      triggerEffects(subscribers);
    },
  };

  return stateObject;
}

/**
 * Check if a value is a State object
 */
export function isState<T>(value: any): value is State<T> {
  return Boolean(value && value._isState);
}

/**
 * Get the raw value from a state object or return the value if it's not a state
 */
export function unwrapState<T>(possibleState: State<T> | T): T {
  return isState(possibleState) ? possibleState.value : possibleState;
}

/**
 * Track the current effect as dependent on the given subscribers
 */
export function trackEffect<T>(subscribers: StateSubscribers): void {
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
export function triggerEffects<T>(subscribers: StateSubscribers): void {
  // Run effects in a new Set to avoid issues if set changes during iteration
  const effects = new Set(subscribers);
  effects.forEach((effect) => effect());
}

// Export from effect.ts (simplified for this example)
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
