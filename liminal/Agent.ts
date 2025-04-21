import { Fiber } from "./Fiber.ts"
import type { Handler } from "./Handler.ts"
import type { Rune } from "./Rune.ts"
import type { Runic } from "./Runic.ts"

export interface Agent<out Y extends Rune, out T> extends PromiseLike<T> {
  Y: Y
  T: T
}

export function Agent<Y extends Rune, T>(runic: Runic<Y, T>, config?: AgentConfig<Y, T>): Agent<Y, T> {
  return {
    then(onfulfilled, onrejected) {
      const root = Fiber(
        {
          handler: config?.handler ?? (() => {}),
        },
        runic,
      )
      return root.run().then(onfulfilled, onrejected)
    },
  } satisfies Omit<Agent<Y, T>, "Y" | "T"> as never
}

export interface AgentConfig<Y extends Rune, _T> {
  handler: Handler<Y extends Rune<infer E> ? E : never>
}
