import { LifecycleHooks } from "../types";

// Current component instance being set up
let currentInstance: any = null;

/**
 * Set the current component instance during setup
 */
export function setCurrentInstance(instance: any): void {
  currentInstance = instance;
}

/**
 * Clear the current component instance after setup
 */
export function clearCurrentInstance(): void {
  currentInstance = null;
}

/**
 * Get the current component instance
 */
export function getCurrentInstance(): any {
  return currentInstance;
}

/**
 * Hook for component mounting
 */
export function onMount(callback: () => void | (() => void)): void {
  if (!currentInstance) {
    console.warn("onMount called outside of component setup");
    return;
  }

  // Get current lifecycle hooks
  const { lifecycle } = currentInstance;
  const originalMounted = lifecycle.mounted;

  // Replace with enhanced hook that calls the original then our callback
  lifecycle.mounted = () => {
    originalMounted();
    const cleanup = callback();

    // If the callback returns a cleanup function, register it
    if (typeof cleanup === "function") {
      const originalBeforeUnmount = lifecycle.beforeUnmount;
      lifecycle.beforeUnmount = () => {
        cleanup();
        originalBeforeUnmount();
      };
    }
  };
}

/**
 * Hook for component unmounting
 */
export function onUnmount(callback: () => void): void {
  if (!currentInstance) {
    console.warn("onUnmount called outside of component setup");
    return;
  }

  // Get current lifecycle hooks
  const { lifecycle } = currentInstance;
  const originalBeforeUnmount = lifecycle.beforeUnmount;

  // Replace with enhanced hook
  lifecycle.beforeUnmount = () => {
    callback();
    originalBeforeUnmount();
  };
}

/**
 * Hook for component updating
 */
export function onUpdate(callback: () => void): void {
  if (!currentInstance) {
    console.warn("onUpdate called outside of component setup");
    return;
  }

  // Get current lifecycle hooks
  const { lifecycle } = currentInstance;
  const originalUpdated = lifecycle.updated;

  // Replace with enhanced hook
  lifecycle.updated = () => {
    originalUpdated();
    callback();
  };
}

/**
 * Create lifecycle hooks object with default no-op functions
 */
export function createLifecycleHooks(
  hooks: Partial<LifecycleHooks> = {}
): LifecycleHooks {
  return {
    beforeMount: hooks.beforeMount || (() => {}),
    mounted: hooks.mounted || (() => {}),
    beforeUpdate: hooks.beforeUpdate || (() => {}),
    updated: hooks.updated || (() => {}),
    beforeUnmount: hooks.beforeUnmount || (() => {}),
    unmounted: hooks.unmounted || (() => {}),
  };
}
