import type { Model } from "../Model.ts"
import type { Rune } from "../Rune.ts"
import { context } from "../state/Context.ts"
import { ModelRegistry } from "../state/ModelRegistry.ts"

export interface model extends Generator<Rune<never>, void> {}

export function* model(model: Model): model {
  const state = context.get()
  const modelRegistry = state.getOrInit(ModelRegistry.make)
  modelRegistry.register(model)
}
