import { Fiber } from "./Fiber.ts"
import type { Rune } from "./Rune.ts"
import type { Runic } from "./Runic.ts"
import { Scheduler } from "./Scheduler.ts"
import { StateMap } from "./StateMap.ts"

export interface Agent<_Y extends Rune, T> extends PromiseLike<T> {}

export interface AgentConfig<Y extends Rune, _T> {
  handler: (event: Y) => void
}

export function Agent<Y extends Rune, T>(runic: Runic<Y, T>, _config?: AgentConfig<Y, T>): Agent<Y, T> {
  return {
    then(onfulfilled, onrejected) {
      const root = Fiber(runic, new StateMap())
      Scheduler.enqueue(() => root.step(undefined))
      return root.promise.then(onfulfilled, onrejected)
    },
  }
}
