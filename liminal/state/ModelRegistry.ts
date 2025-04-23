import type { Model } from "../Model.ts"

/** An intrusive list for storing `Model`s. */
export class ModelRegistry {
  static make(modelRegistry?: ModelRegistry) {
    const instance = new ModelRegistry()
    if (modelRegistry) {
      for (let node = modelRegistry.head; node; node = node.next) {
        instance.register(node.model)
      }
    }
    return instance
  }

  declare head?: ModelRegistryNode | undefined
  declare tail?: ModelRegistryNode | undefined

  clone(): ModelRegistry {
    const clone = new ModelRegistry()
    for (let node = this?.head; node; node = node.next) {
      clone.register(node.model)
    }
    return clone
  }

  peek(): Model | undefined {
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

  remove(node: ModelRegistryNode): void {
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
}

export interface ModelRegistryNode {
  prev: ModelRegistryNode | undefined
  model: Model
  next?: ModelRegistryNode | undefined
}
