import type { AgentConfig } from "./AgentConfig.ts"
import type { LEvent } from "./events/LEvent.ts"
import type { Message } from "./Message.ts"
import { ModelRegistry } from "./ModelRegistry.ts"
import { normalizeRunic, type RuneIterator, type Runic } from "./Runic.ts"

export interface Agent<T = any, E extends LEvent = LEvent> extends PromiseLike<T>, AsyncIterable<E, T> {
  E: E
  T: T
  index: number
  iterator: RuneIterator
  signal: AbortSignal
  status: AgentStatus<T>
  messages: Array<Message>
  models: ModelRegistry
  resolve(value: T): void
  reject(reason?: unknown): void
}

export type AgentStatus<T> = {
  type: "pending"
  promise: Promise<T>
} | {
  type: "resolved"
  resolution: T
} | {
  type: "rejected"
  rejection: unknown
}

let nextIndex = 0

export function Agent<X extends Runic>(runic: X, config?: AgentConfig): Agent<Runic.T<X>, Runic.Y<X>["event"]> {
  const iterator = normalizeRunic(runic)
  const controller = new AbortController()
  const { promise, reject, resolve } = Promise.withResolvers<Runic.T<X>>()
  return {
    index: nextIndex++,
    iterator,
    signal: controller.signal,
    status: {
      type: "pending",
      promise,
    },
    messages: config?.messages ?? [],
    models: new ModelRegistry(config?.models),
    reject,
    resolve,
    then,
    [Symbol.asyncIterator]: createIterator,
  } satisfies Omit<Agent, "T" | "E"> as never
}

function then<X extends Runic>(this: X): PromiseLike<Runic.T<X>> {
  throw 0
}

async function* createIterator() {
  throw 0
}
