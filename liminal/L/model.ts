import { Context } from "../Context.ts"
import type { Model } from "../Model.ts"
import type { Rune } from "../Rune.ts"
import { ModelRegistry } from "../state/ModelRegistry.ts"

export interface model extends Generator<Rune<never>, void> {}

export function* model(model: Model): model {
  const modelRegistry = Context.getOrInit(ModelRegistry.make)
  modelRegistry.register(model)
}
