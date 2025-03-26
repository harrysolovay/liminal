import { ActionBase } from "./ActionBase.js"
import type { EventBase } from "./event_common.js"

export class Model<K extends string = string, C extends Capability = Capability> implements ActionBase<"Model"> {
  declare Model: never
  declare Event: never

  static *language<K extends string>(key: K): Generator<Model<K, "language">, undefined> {
    return yield ActionBase("Model", {
      key,
      capability: "language",
    })
  }

  static *embedding<K extends string>(key: K): Generator<Model<K, "embedding">, undefined> {
    return yield ActionBase("Model", {
      key,
      capability: "embedding",
    })
  }

  readonly action = "Model"
  readonly key: K
  readonly capability: C
  constructor(key: K, capability: C) {
    this.key = key
    this.capability = capability
  }
}

export type Capability = "language" | "embedding"

export interface ModelEvent<K extends string = string, C extends Capability = Capability> extends EventBase<"Model"> {
  key: K
  capability: C
}
