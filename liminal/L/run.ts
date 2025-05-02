import { Context } from "../Context.ts"
import type { Definition } from "../Definition.ts"
import type { Handler } from "../Handler.ts"
import type { Message } from "../Message.ts"
import { ModelRegistry } from "../ModelRegistry.ts"
import type { Rune } from "../Rune.ts"
import { Strand } from "../Strand.ts"
import type { Tool } from "../Tool.ts"

/** Configuration options for running a definition. */
export interface RunConfig<Y extends Rune<any>> {
  handler?: Handler<Y> | undefined
  models?: ModelRegistry | undefined
  messages?: Array<Message> | undefined
  tools?: Set<Tool> | undefined
  signal?: AbortSignal | undefined
}

export function run<Y extends Rune<any>, T>(definition: Definition<Y, T>, config?: RunConfig<Y>): Strand<Y, T> {
  const context = Context({
    handler: config?.handler,
    models: config?.models ?? new ModelRegistry(),
    messages: config?.messages ?? [],
    tools: config?.tools ?? new Set(),
  })
  return new Strand(definition, {
    signal: config?.signal,
    ...config && { context },
  })
}
