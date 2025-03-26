export class Model<K extends string = string, C extends Capability = Capability> {
  static *language<K extends string>(key: K): Generator<Model<K, "language">, undefined> {
    return yield {
      kind: "Model",
      key,
      capability: "language",
    }
  }

  static *embedding<K extends string>(key: K): Generator<Model<K, "embedding">, undefined> {
    return yield {
      kind: "Model",
      key,
      capability: "embedding",
    }
  }

  readonly kind = "Model"
  readonly key: K
  readonly capability: C
  constructor(key: K, capability: C) {
    this.key = key
    this.capability = capability
  }
}

export type Capability = "language" | "embedding"

export interface ModelEvent<K extends string = string, C extends Capability = Capability> {
  type: "Model"
  key: K
  capability: C
}
