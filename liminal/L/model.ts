import type { Model } from "../Model.ts"
import type { Rune } from "../Rune.ts"
import { ModelRegistry } from "../states/ModelRegistry.ts"
import { state } from "./state.ts"

export interface model extends Generator<Rune, void> {}

export function* model(model: Model): model {
  const [modelRegistry] = yield* state(ModelRegistry)
  modelRegistry.register(model)
}
