import type { ForkRune, JoinRune, Rune, StateRune } from "../Rune.ts"
import { type Runic } from "../Runic.ts"
import { StateMap } from "../StateMap.ts"
import { MessageRegistry } from "../states/MessageRegistry.ts"
import { ModelRegistry } from "../states/ModelRegistry.ts"
import { fork } from "./fork.ts"
import { join } from "./join.ts"
import { state } from "./state.ts"

export interface branch<Y extends Rune, T> extends Generator<ForkRune | JoinRune | StateRune | Y, T> {}

export function* branch<Y extends Rune, T>(runic: Runic<Y, T>): branch<Y, T> {
  const [models, messages] = yield* state(ModelRegistry, MessageRegistry)
  const fiber = yield* fork(
    runic,
    new StateMap([
      [ModelRegistry, models.clone()],
      [MessageRegistry, messages.clone()],
    ]),
  )
  const [resolved] = yield* join(fiber)
  return resolved
}
