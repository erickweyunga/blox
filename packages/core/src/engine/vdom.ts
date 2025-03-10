/**
 * VNode Types
 */
export type VNodeType = string | symbol;

/**
 * Symbol used to identify component vnodes
 */
export const COMPONENT_SYMBOL = Symbol("bloxi.component");

/**
 * Symbol used to identify text vnodes
 */
export const TEXT_SYMBOL = Symbol("bloxi.text");

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
 * Create a Virtual DOM node
 */
export function createVNode(
  type: VNodeType,
  props: VNodeProps = {},
  children: (VNode | string | number | null | undefined)[] = []
): VNode {
  // Process children, converting primitives to text nodes
  const processedChildren = children
    .filter((child): child is VNode | string | number => child != null)
    .map((child) =>
      typeof child === "string" || typeof child === "number"
        ? createTextVNode(child)
        : child
    );

  const node: VNode = {
    type,
    props: { ...props },
    children: processedChildren,
    key: props._bloxi?.key,
  };

  return node;
}

/**
 * Create a text VNode
 */
export function createTextVNode(text: string | number): VNode {
  return {
    type: TEXT_SYMBOL,
    props: { nodeValue: String(text) },
    children: [],
  };
}

/**
 * Create a component VNode
 */
export function createComponentVNode(
  componentDef: any,
  props: Record<string, any> = {},
  children: (VNode | string | number)[] = []
): VNode {
  return createVNode(
    COMPONENT_SYMBOL,
    {
      ...props,
      _bloxi: {
        component: componentDef,
        props: props,
      },
    },
    children
  );
}

/**
 * Check if a value is a VNode
 */
export function isVNode(value: any): value is VNode {
  return (
    value &&
    typeof value === "object" &&
    "type" in value &&
    "props" in value &&
    "children" in value
  );
}

/**
 * Check if a VNode is a text node
 */
export function isTextVNode(vnode: VNode): boolean {
  return vnode.type === TEXT_SYMBOL;
}

/**
 * Check if a VNode is a component node
 */
export function isComponentVNode(vnode: VNode): boolean {
  return vnode.type === COMPONENT_SYMBOL;
}
