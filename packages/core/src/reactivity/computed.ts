import { State, state } from "./state";
import { effect } from "./effect";

/**
 * Computed state interface - a readonly reactive value derived from other state
 */
export interface ComputedState<T> extends Omit<State<T>, "value"> {
  /** The computed value (readonly) */
  readonly value: T;
}

/**
 * Create a computed reactive value that updates automatically when dependencies change
 *
 * @param getter Function that computes the derived value
 * @returns A readonly reactive state object
 */
export function computed<T>(getter: () => T): ComputedState<T> {
  // Internal state to store the computed value
  const result = state<T | null>(null);

  // Flag to track if computation is dirty
  let dirty = true;

  // Last computed value
  let value: T;

  // Create effect to automatically update when dependencies change
  effect(() => {
    if (!dirty) return;
    value = getter();
    result.value = value;
    dirty = false;
  });

  // Create a subscriber that marks as dirty when dependencies change
  const subscriber = () => {
    dirty = true;
  };

  // Add the subscriber to result's subscribers
  result._subscribers.add(subscriber as any);

  // Define the computed object with readonly value
  const computedObject: ComputedState<T> = {
    subscribe: result.subscribe,
    _isState: true,
    _subscribers: result._subscribers,

    // Readonly value getter
    get value() {
      if (dirty) {
        value = getter();
        result.value = value;
        dirty = false;
      }
      return value;
    },
  };

  return computedObject;
}
