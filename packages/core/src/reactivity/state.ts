import { EffectFn, trackEffect, triggerEffects } from './effect';

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
      
      // Use queueMicrotask to batch updates for better performance
      queueMicrotask(() => {
        triggerEffects(subscribers);
      });
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
 * Batch multiple state changes together to optimize rendering
 * @param fn Function containing multiple state changes
 */
export function batch(fn: () => void): void {
  // Setup batching
  let batchingActive = true;
  try {
    fn();
  } finally {
    // Complete batching and trigger updates
    batchingActive = false;
  }
}