import type { Handler } from "./Handler.ts"
import type { Message } from "./Message.ts"
import { ModelRegistry } from "./ModelRegistry.ts"
import type { Tool } from "./Tool.ts"

export interface Context {
  readonly handler: Handler | undefined
  readonly models: ModelRegistry
  readonly messages: Array<Message>
  readonly tools: Set<Tool>

  clone(): Context
}

export function Context(context?: Omit<Context, "clone">): Context {
  return {
    handler: context?.handler,
    models: context?.models.clone() ?? new ModelRegistry(),
    messages: [],
    tools: new Set(context?.tools),

    clone(): Context {
      return {
        handler: this.handler,
        models: this.models.clone(),
        messages: [...this.messages],
        tools: new Set(this.tools),
        clone: this.clone,
      }
    },
  }
}
