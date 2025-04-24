import { assert as assert_ } from "liminal-util"
import { AsyncLocalStorage } from "node:async_hooks"
import { MessageRegistry } from "./MessageRegistry.ts"
import { ModelRegistry } from "./ModelRegistry.ts"

export interface AgentContextConfig {
  index: number
  handler: ((event: any) => void) | undefined
  models: ModelRegistry
  messages: MessageRegistry
  parent: AgentContext | undefined
}

export interface AgentContext extends AgentContextConfig {
  controller: AbortController
  getLocal: <T>(factory: ContextValueFactory<T>) => T
  child(): AgentContext
}

export function AgentContext(config: AgentContextConfig): AgentContext {
  const locals = new WeakMap<ContextValueFactory, unknown>()
  return {
    handler: config?.handler,
    models: config.models ?? ModelRegistry(),
    messages: config.messages ?? MessageRegistry(),
    index: config.index,
    parent: config.parent,
    controller: new AbortController(),
    getLocal: (factory) => {
      if (locals.has(factory)) {
        return locals.get(factory) as never
      }
      const value = factory()
      locals.set(factory, value)
      return value
    },
    child() {
      return AgentContext({
        index: config.index + 1,
        handler: config.handler,
        models: config.models.clone(),
        messages: MessageRegistry(),
        parent: this,
      })
    },
  }
}

export namespace AgentContext {
  export const storage = new AsyncLocalStorage<AgentContext>()

  export function get(): AgentContext {
    const context = storage.getStore()
    assert_(context)
    return context
  }
}

export type ContextValueFactory<V = any> = (initial?: V) => V
