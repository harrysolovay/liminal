import type { Model } from "./Model.ts"

export interface ModelRegistry {
  head?: ModelRegistryNode | undefined
  tail?: ModelRegistryNode | undefined
  peek(): Model | undefined
  register(value: Model): ModelRegistryNode
  remove(node: ModelRegistryNode): void
  clone(): ModelRegistry
}

/** An intrusive list for storing `Model`s. */
export function ModelRegistry(models?: Array<Model>): ModelRegistry {
  if (models) {
    const instance = ModelRegistry()
    for (const model of models) {
      instance.register(model)
    }
    return instance
  }
  return {
    peek() {
      return this.tail?.model
    },
    register(value) {
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
    },
    remove(node) {
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
      node.prev = node.next = undefined
    },
    clone() {
      const instance = ModelRegistry()
      for (let node = this.head; node; node = node.next) {
        instance.register(node.model)
      }
      return instance
    },
  }
}

export interface ModelRegistryNode {
  prev: ModelRegistryNode | undefined
  model: Model
  next?: ModelRegistryNode | undefined
}
