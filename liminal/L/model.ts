import { assert } from "liminal-util"
import { ModelRegistered } from "../LEvent.ts"
import type { Model } from "../Model.ts"
import { ModelRegistryContext } from "../ModelRegistry.ts"
import type { Rune } from "../Rune.ts"
import { emit } from "./emit.ts"

export interface model extends Generator<Rune<ModelRegistered>, void> {}

export function* model(model: Model): model {
  const registry = ModelRegistryContext.get()
  assert(registry)
  registry.register(model)
  yield* emit(new ModelRegistered(model))
}
