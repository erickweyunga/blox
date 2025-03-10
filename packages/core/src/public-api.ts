// Re-export only what's needed for the public API
// This creates a clean separation between internal implementation and public interface

import { component, ComponentOptions, ComponentFactory } from './component/component';
import { state, effect, State } from './reactivity/state';
import { computed, ComputedState } from './reactivity/computed';
import { onMount, onUpdate, onUnmount } from './component/lifecycle';
import { render } from './engine/renderer';
import { createVNode, VNode, VNodeProps, VNodeType } from './engine/vdom';

// Public API exports
export {
  // Component API
  component,
  
  // State management
  state,
  computed,
  effect,
  
  // Lifecycle hooks
  onMount,
  onUpdate,
  onUnmount,
  
  // Rendering
  render,
  
  // Types
  type ComponentOptions,
  type ComponentFactory,
  type State,
  type ComputedState,
  type VNode,
  type VNodeProps,
  type VNodeType
};

// h function is an alias for createVNode that follows JSX conventions
export function h(
  type: string | symbol,
  props: Record<string, any> | null,
  ...children: any[]
): VNode {
  // Normalize props
  const normalizedProps = props || {};
  
  // Return a virtual node
  return createVNode(type, normalizedProps, children);
}

// Framework version
export const VERSION = '0.1.0';