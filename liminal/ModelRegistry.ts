import type { Model } from "./Model.ts"

/**
 * An intrusive doubly-linked list for storing `Model`s.
 * Provides efficient insertion, removal, and lookups.
 */
export class ModelRegistry {
  declare head?: ModelRegistryNode | undefined
  declare tail?: ModelRegistryNode | undefined

  /** Returns the most recently registered model */
  peek() {
    return this.tail?.model
  }

  /**
   * Registers a new model and returns the created node
   * @param value The model to register
   */
  register(value: Model): ModelRegistryNode {
    const node: ModelRegistryNode = {
      prev: this.tail,
      model: value,
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
    const instance = new ModelRegistry()
    for (let node = this.head; node; node = node.next) {
      if (node.model) {
        instance.register(node.model)
      }
    }
    return instance
  }
}

export interface ModelRegistryNode {
  prev: ModelRegistryNode | undefined
  model: Model
  next?: ModelRegistryNode | undefined
}
