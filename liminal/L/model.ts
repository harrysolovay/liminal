import { ModelRegistered } from "../LEvent.ts"
import type { Model } from "../Model.ts"
import type { Rune } from "../Rune.ts"
import { event } from "./event.ts"
import { models } from "./models.ts"

export function* model(model: Model): Generator<Rune<ModelRegistered>, Model> {
  const modelRegistry = yield* models
  modelRegistry.register(model)
  yield* event(new ModelRegistered(model))
  return model
}
