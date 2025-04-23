import type { FiberConfig, FiberInfo } from "./Fiber.ts"
import { run } from "./run.ts"
import type { Rune, RuneKey } from "./Rune.ts"
import type { Runic } from "./Runic.ts"

export interface Agent<out T, out E> extends PromiseLike<T> {
  T: T
  E: E
}

export function Agent<Y extends Rune, T>(runic: Runic<Y, T>, config?: AgentConfig<Y, T>): Agent<T, Rune.E<Y>> {
  return {
    then(onfulfilled, onrejected) {
      return run(runic, {
        T: null!,
        globals: {
          handler: config?.handler ?? (() => {}),
        },
        signal: config?.signal,
      }).then(onfulfilled, onrejected)
    },
  } satisfies Omit<Agent<T, Rune.E<Y>>, "E" | "T"> as never
}

export interface AgentConfig<Y extends Rune, _T> {
  handler: (event: Y[RuneKey], info: FiberInfo) => void
  signal?: AbortSignal
}
