import { VNode } from "../types";

/**
 * Diff operation types
 */
export type DiffOperationType =
  | "REPLACE"
  | "UPDATE_TEXT"
  | "SET_PROP"
  | "REMOVE_PROP"
  | "REORDER_CHILDREN"
  | "REPLACE_CHILD"
  | "ADD_CHILD"
  | "REMOVE_CHILD";

/**
 * Diff operation structure
 */
export interface DiffOperation {
  type: DiffOperationType;
  path?: number[];
  key?: string;
  value?: any;
  oldValue?: any;
  node?: VNode | null;
  index?: number;
  fromIndex?: number;
  toIndex?: number;
}

/**
 * Compare two virtual DOM trees and calculate differences
 */
export function diff(
  oldVNode: VNode | null,
  newVNode: VNode | null
): DiffOperation[] {
  return diffHelper(oldVNode, newVNode, []);
}

/**
 * Recursive diffing function with path tracking
 */
function diffHelper(
  oldVNode: VNode | null,
  newVNode: VNode | null,
  path: number[]
): DiffOperation[] {
  // Handle null cases
  if (oldVNode === null && newVNode === null) {
    return [];
  }

  if (oldVNode === null) {
    return [
      {
        type: "REPLACE",
        path,
        node: newVNode,
      },
    ];
  }

  if (newVNode === null) {
    return [
      {
        type: "REMOVE_CHILD",
        path: path.slice(0, -1),
        index: path[path.length - 1],
      },
    ];
  }

  // Different node types, replace entirely
  if (oldVNode.type !== newVNode.type) {
    return [
      {
        type: "REPLACE",
        path,
        node: newVNode,
      },
    ];
  }

  const operations: DiffOperation[] = [];

  // Check for text node updates
  if (
    oldVNode.type === Symbol("bloxi.text") &&
    newVNode.type === Symbol("bloxi.text")
  ) {
    if (oldVNode.props.nodeValue !== newVNode.props.nodeValue) {
      operations.push({
        type: "UPDATE_TEXT",
        path,
        value: newVNode.props.nodeValue,
      });
    }
    return operations;
  }

  // Diff properties
  const propOperations = diffProps(oldVNode.props, newVNode.props, path);
  operations.push(...propOperations);

  // Diff children
  const childOperations = diffChildren(
    oldVNode.children,
    newVNode.children,
    path
  );
  operations.push(...childOperations);

  return operations;
}

/**
 * Compare properties between nodes
 */
function diffProps(
  oldProps: Record<string, any>,
  newProps: Record<string, any>,
  path: number[]
): DiffOperation[] {
  const operations: DiffOperation[] = [];

  // Check for removed or changed props
  Object.keys(oldProps).forEach((key) => {
    // Skip special and reserved props
    if (key === "children" || key === "_bloxi") return;

    // Prop was removed
    if (!(key in newProps)) {
      operations.push({
        type: "REMOVE_PROP",
        path,
        key,
      });
    }
    // Prop value changed
    else if (oldProps[key] !== newProps[key]) {
      operations.push({
        type: "SET_PROP",
        path,
        key,
        value: newProps[key],
        oldValue: oldProps[key],
      });
    }
  });

  // Check for new props
  Object.keys(newProps).forEach((key) => {
    // Skip special and reserved props
    if (key === "children" || key === "_bloxi") return;

    // New prop added
    if (!(key in oldProps)) {
      operations.push({
        type: "SET_PROP",
        path,
        key,
        value: newProps[key],
      });
    }
  });

  return operations;
}

/**
 * Compare children arrays between nodes
 */
function diffChildren(
  oldChildren: VNode[],
  newChildren: VNode[],
  parentPath: number[]
): DiffOperation[] {
  const operations: DiffOperation[] = [];

  // Simple child diffing (could be optimized with key-based reconciliation)
  const maxLength = Math.max(oldChildren.length, newChildren.length);

  for (let i = 0; i < maxLength; i++) {
    const childPath = [...parentPath, i];
    const oldChild = i < oldChildren.length ? oldChildren[i] : null;
    const newChild = i < newChildren.length ? newChildren[i] : null;

    const childOperations = diffHelper(oldChild, newChild, childPath);
    operations.push(...childOperations);
  }

  return operations;
}
