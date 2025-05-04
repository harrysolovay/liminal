import { AdapterRegistry } from "./AdapterRegistry.ts"
import type { Handler } from "./Handler.ts"
import type { Message } from "./Message.ts"
import type { Tool } from "./Tool.ts"

/**
 * Context represents the execution environment for a Strand.
 *
 * It holds all the stateful components needed during strand execution:
 * - Message history.
 * - Event handler for processing events.
 * - Model registry for tracking available language models.
 * - Available tools for model-driven function calling.
 */
export interface Context {
  /** Event handler for processing events during strand execution. */
  readonly handler: Handler | undefined
  /** Registry of available models for inference. */
  readonly adapters: AdapterRegistry
  /** Accumulated message history. */
  readonly messages: Array<Message>
  /** Set of tools available to the models. */
  readonly tools: Set<Tool>
  /** Creates a copy of the current `Context` for child strands. */
  clone(): Context
}

/**
 * Factory function to create a new Context.
 * @param context Optional base context from which to initialize.
 * @returns A newly created Context.
 */
export function Context(context?: Omit<Context, "clone">): Context {
  return {
    handler: context?.handler,
    adapters: context?.adapters?.clone() ?? new AdapterRegistry(),
    messages: [...(context?.messages ?? [])],
    tools: new Set(context?.tools),
    clone(): Context {
      return {
        handler: this.handler,
        adapters: this.adapters.clone(),
        messages: [...this.messages],
        tools: new Set(this.tools),
        clone: this.clone,
      }
    },
  }
}
