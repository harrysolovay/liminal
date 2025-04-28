import { Context } from "./Context.ts"
import type { Fiber } from "./Fiber.ts"
import type { Handler } from "./Handler.ts"
import { handlers } from "./L/handlers.ts"
import { messages } from "./L/messages.ts"
import { models } from "./L/models.ts"
import { signal } from "./L/signal.ts"
import { tools } from "./L/tools.ts"
import type { Message } from "./Message.ts"
import { ModelRegistry } from "./ModelRegistry.ts"
import type { Tool } from "./Tool.ts"

export interface Config<T = any, E = any> {
  handler?: ((this: Fiber<T>, event: E) => void) | undefined
  models?: ModelRegistry | undefined
  messages?: Array<Message>
  tools?: Set<Tool> | undefined
  signal?: AbortSignal | undefined
}

export namespace Config {
  export function toContext(parent?: Context, config?: Config): Context {
    const context = parent?.fork() ?? new Context()
    if (config) {
      if (config.handler) {
        context.set(handlers, new Set<Handler>([config.handler]))
      }
      if (config.models) {
        context.set(models, config.models)
      }
      if (config.messages) {
        context.set(messages, new Set(config.messages))
      }
      if (config.tools) {
        context.set(tools, config.tools)
      }
      if (config.signal) {
        context.set(signal, config.signal)
      }
    }
    return context
  }
}
