import type { Handler } from "./Handler.ts"
import type { Message } from "./Message.ts"
import { ModelRegistry } from "./ModelRegistry.ts"
import type { Rune } from "./Rune.ts"
import type { Tool } from "./Tool.ts"

export interface ContextConfig<Y extends Rune<any> = Rune<any>> {
  handler?: Handler<Rune.E<Y>> | undefined
  models?: ModelRegistry | undefined
  messages?: Array<Message> | undefined
  tools?: Set<Tool> | undefined
  signal?: AbortSignal | undefined
}

export class Context {
  declare handler?: Handler | undefined
  declare models: ModelRegistry
  declare messages: Array<Message>
  declare tools: Set<Tool>
  declare signal?: AbortSignal | undefined

  constructor(config?: ContextConfig) {
    if (config?.handler) {
      this.handler = config.handler
    }
    if (config?.models) {
      this.models = config.models.clone()
    } else {
      this.models = new ModelRegistry()
    }
    if (config?.messages) {
      this.messages = [...config.messages]
    } else {
      this.messages = []
    }
    if (config?.tools) {
      this.tools = new Set(config.tools)
    }
    if (config?.signal) {
      this.signal = config.signal
    }
  }

  inheritance(): Context {
    return new Context({
      handler: this.handler,
      models: this.models.clone(),
      messages: [...this.messages],
    })
  }
}
