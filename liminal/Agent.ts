import { Fiber } from "./Fiber.ts"
import type { EventRune, Rune } from "./Rune.ts"
import type { Runic } from "./Runic.ts"
import { Scheduler } from "./Scheduler.ts"
import { StateMap } from "./StateMap.ts"

export interface Agent<_Y extends Rune, T> extends PromiseLike<T> {}

export interface AgentConfig<_Y extends Rune, _T> {
  handler: (event: EventRune) => void
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
      Scheduler.enqueue(() => root.step(undefined))
      return root.promise.then(onfulfilled, onrejected)
    },
  }
}
