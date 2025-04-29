import type { LEvent } from "../LEvent.ts"
import { ModelRegistered } from "../LEvent.ts"
import type { Model } from "../Model.ts"
import type { Rune } from "../Rune.ts"
import { emit } from "./emit.ts"
import { reflect } from "./reflect.ts"

export function* model(model: Model): Generator<Rune<LEvent>, Model> {
  const { context: { models } } = yield* reflect
  models.register(model)
  yield* emit(new ModelRegistered(model))
  return model
}
