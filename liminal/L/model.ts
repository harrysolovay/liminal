import { AgentContext } from "../AgentContext.ts"
import { ModelRegistered } from "../LEvent.ts"
import type { Model } from "../Model.ts"
import type { Rune } from "../Rune.ts"
import { emit } from "./emit.ts"

export interface model extends Generator<Rune<ModelRegistered>, void> {}

export function* model(model: Model): model {
  const { models } = AgentContext.get()
  models.register(model)
  yield* emit(new ModelRegistered(model))
}
