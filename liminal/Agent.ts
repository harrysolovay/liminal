import { AgentContext } from "./AgentContext.ts"
import { MessageRegistry } from "./MessageRegistry.ts"
import { ModelRegistry } from "./ModelRegistry.ts"
import { run } from "./run.ts"
import type { Rune } from "./Rune.ts"
import type { Runic } from "./Runic.ts"

export interface AgentConfig<E> {
  handler?: ((event: E) => void) | undefined
  models?: ModelRegistry
  messages?: MessageRegistry
  signal?: AbortSignal | undefined
}

export interface Agent<out T, out E> extends PromiseLike<T> {
  T: T
  E: E
}

let nextIndex = 0

export function Agent<Y extends Rune, T>(
  runic: Runic<Y, T>,
  config?: AgentConfig<Rune.E<Y>>,
): Agent<T, Rune.E<Y>> {
  return {
    then(onfulfilled, onrejected) {
      return run(
        runic,
        AgentContext({
          index: nextIndex++,
          handler: config?.handler,
          models: config?.models ?? ModelRegistry(),
          messages: config?.messages ?? MessageRegistry(),
          parent: undefined,
        }),
      ).then(onfulfilled, onrejected)
    },
  } satisfies Omit<Agent<T, Rune.E<Y>>, "E" | "T"> as never
}
