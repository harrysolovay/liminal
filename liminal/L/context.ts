import { Context } from "../Context.ts"
import { reflect } from "./reflect.ts"

export function* context(partial: Partial<Omit<Context, "clone">>) {
  const { context } = yield* reflect
  return Context({
    handler: partial.handler ?? context.handler,
    messages: partial.messages ?? context.messages,
    models: partial.models ?? context.models,
    tools: partial.tools ?? context.tools,
  })
}
