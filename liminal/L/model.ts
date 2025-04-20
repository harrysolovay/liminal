import type { Model } from "../Model.ts"
import type { StateRune } from "../Rune.ts"
import { ModelRegistry } from "../states/ModelRegistry.ts"
import { state } from "./state.ts"

export function* model(model: Model): Generator<StateRune, void> {
  const [modelRegistry] = yield* state(ModelRegistry)
  modelRegistry.register(model)
}
