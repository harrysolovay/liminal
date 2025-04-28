import type { Model } from "./Model.ts"

/** An intrusive list for storing `Model`s. */
export class ModelRegistry {
  declare head?: ModelRegistryNode | undefined
  declare tail?: ModelRegistryNode | undefined

  peek() {
    return this.tail?.model
  }

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
    node.prev = node.next = undefined
  }

  clone() {
    const instance = new ModelRegistry()
    for (let node = this.head; node; node = node.next) {
      instance.register(node.model)
    }
    return instance
  }
}

export interface ModelRegistryNode {
  prev: ModelRegistryNode | undefined
  model: Model
  next?: ModelRegistryNode | undefined
}
