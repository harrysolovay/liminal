import type { Rune } from "../Rune.ts"
import { type Runic, unwrapRunic } from "../Runic.ts"
import { MessageRegistry } from "../state/MessageRegistry.ts"
import { ModelRegistry } from "../state/ModelRegistry.ts"
import { StateMap } from "../StateMap.ts"
import { fork } from "./fork.ts"
import { join } from "./join.ts"
import { states } from "./states.ts"

export function* branch<Y extends Rune, T>(runic: Runic<Y, T>): Generator<Rune | Y, T> {
  const [models, messages] = yield* states(ModelRegistry, MessageRegistry)
  const fiber = yield* fork(
    unwrapRunic(runic),
    new StateMap([
      [ModelRegistry, models.clone()],
      [MessageRegistry, messages.clone()],
    ]),
  )
  const [resolved] = yield* join(fiber)
  return resolved
}
