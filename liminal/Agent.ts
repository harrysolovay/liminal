import { Context } from "./Context.ts"
import { Fiber } from "./Fiber.ts"
import { HandlerContext } from "./Handler.ts"
import { MessageRegistry, MessageRegistryContext } from "./MessageRegistry.ts"
import { ModelRegistry, ModelRegistryContext } from "./ModelRegistry.ts"
import { type Rune } from "./Rune.ts"
import type { Runic } from "./Runic.ts"

export interface AgentConfig<T, E> {
  handler?: ((this: Fiber<T>, event: E) => void) | undefined
  models?: ModelRegistry
  messages?: MessageRegistry
  signal?: AbortSignal | undefined
}

export interface Agent<out T, out E> extends PromiseLike<T> {
  T: T
  E: E
}

export function Agent<Y extends Rune, T>(
  runic: Runic<Y, T>,
  config?: AgentConfig<T, Rune.E<Y>>,
): Agent<T, Rune.E<Y>> {
  return {
    then(onfulfilled, onrejected) {
      return new Context([
        [HandlerContext, config?.handler],
        [ModelRegistryContext, config?.models ?? new ModelRegistry()],
        [MessageRegistryContext, config?.messages ?? new MessageRegistry()],
      ])
        .run(() => new Fiber(runic).resolution().then(onfulfilled, onrejected))
    },
  } satisfies Omit<Agent<T, Rune.E<Y>>, "E" | "T"> as never
}
