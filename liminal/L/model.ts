import { assert } from "liminal-util"
import type { LEvent } from "../LEvent.ts"
import { ModelRegistered } from "../LEvent.ts"
import type { Model } from "../Model.ts"
import type { Rune } from "../Rune.ts"
import { current } from "./current.ts"
import { emit } from "./emit.ts"

export function* model(model: Model): Generator<Rune<LEvent>, Model> {
  const { config: { context } } = yield* current
  assert(context)
  const { models } = context
  models.register(model)
  yield* emit(new ModelRegistered(model))
  return model
}
