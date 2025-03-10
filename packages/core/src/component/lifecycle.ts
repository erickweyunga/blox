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

// Current component being set up
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
export function onMount(callback: () => void): void {
  if (!currentInstance) {
    console.warn("onMount called outside of component setup");
    return;
  }

  const originalMounted = currentInstance.lifecycle.mounted;
  currentInstance.lifecycle.mounted = () => {
    originalMounted();
    callback();
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

  const originalUnmounted = currentInstance.lifecycle.unmounted;
  currentInstance.lifecycle.unmounted = () => {
    originalUnmounted();
    callback();
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

  const originalUpdated = currentInstance.lifecycle.updated;
  currentInstance.lifecycle.updated = () => {
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
