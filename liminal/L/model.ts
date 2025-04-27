import { ModelRegistered } from "../LEvent.ts"
import type { Model } from "../Model.ts"
import { ModelRegistryContext } from "../ModelRegistry.ts"
import type { Rune } from "../Rune.ts"
import { event } from "./event.ts"

export interface model extends Generator<Rune<ModelRegistered>, Model> {}

export function* model(model: Model): model {
  const registry = ModelRegistryContext.getOrInit()
  registry.register(model)
  yield* event(new ModelRegistered(model))
  return model
}
