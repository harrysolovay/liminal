import { Fiber } from "./Fiber.ts"
import type { Rune } from "./Rune.ts"
import type { Runic } from "./Runic.ts"
import { StateMap } from "./StateMap.ts"

export interface Agent<_Y extends Rune, T> extends PromiseLike<T> {}

export interface AgentConfig<_Y extends Rune, _T> {
  handler: (event: Rune) => void
}

export function Agent<Y extends Rune, T>(runic: Runic<Y, T>, config?: AgentConfig<Y, T>): Agent<Y, T> {
  return {
    then(onfulfilled, onrejected) {
      const root = Fiber(
        {
          handler: config?.handler ?? (() => {}),
        },
        runic,
        new StateMap(),
      )
      return root.promise.then(onfulfilled, onrejected)
    },
  }
}
