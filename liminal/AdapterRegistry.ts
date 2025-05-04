import type { Adapter } from "./Adapter.ts"
import { LiminalAssertionError } from "./LiminalAssertionError.ts"

/**
 * An intrusive doubly-linked list for storing `Model`s.
 * Provides efficient insertion, removal, and lookups.
 */
export class AdapterRegistry {
  declare head?: ModelRegistryNode | undefined
  declare tail?: ModelRegistryNode | undefined

  /** Returns the most recently registered model */
  peek() {
    return this.tail?.adapter
  }

  /** Ensure */
  ensure(): Adapter {
    LiminalAssertionError.assert(
      this.tail,
      "No conversation adapter registered. Use `L.focus` to focus a conversation adapter.",
    )
    return this.tail.adapter
  }

  /**
   * Registers a new model and returns the created node
   * @param value The model to register
   */
  register(value: Adapter): ModelRegistryNode {
    const node: ModelRegistryNode = {
      prev: this.tail,
      adapter: value,
    }
    if (this.tail) {
      this.tail.next = node
    } else {
      this.head = node
    }
    this.tail = node
    return node
  }

  /** Remove a model from the registry. */
  remove(node: ModelRegistryNode) {
    if (node.prev) {
      node.prev.next = node.next
    }
    if (node.next) {
      node.next.prev = node.prev
    }
    if (node === this.head) {
      this.head = node.next
    }
    if (node === this.tail) {
      this.tail = node.prev
    }
    node.prev = undefined
    delete node.next
  }

  /** Creates a deep copy of this registry. */
  clone() {
    const instance = new AdapterRegistry()
    for (let node = this.head; node; node = node.next) {
      if (node.adapter) {
        instance.register(node.adapter)
      }
    }
    return instance
  }
}

export interface ModelRegistryNode {
  prev: ModelRegistryNode | undefined
  adapter: Adapter
  next?: ModelRegistryNode | undefined
}
