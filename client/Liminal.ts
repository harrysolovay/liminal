import { L, type Type } from "../core/mod.ts"
import { isTemplateStringsArray } from "../util/isTemplateStringsArray.ts"
import { type PromiseOr, recombine } from "../util/mod.ts"
import type { Adapter, Provider } from "./Adapter.ts"
import type { Tool } from "./Tool.ts"

export interface Liminal<P extends Provider> {
  (...texts: Array<number | string | P["I" | "O"]>): Liminal<P>
  (template: TemplateStringsArray, ...values: Array<number | string>): Liminal<P>

  adapter: Adapter<P>
  messages: Array<P["I" | "O"]>

  type(config?: ValueConfig<P>): Promise<Type<unknown, never>>
  value: <T>(type: Type<T, never>, config?: ValueConfig<P>) => Promise<T>
  map: (f: (messages: Array<P["I" | "O"]>) => Array<P["I" | "O"]>) => Liminal<P>
}

export interface ValueConfig<P extends Provider> {
  model?: P["M"]
  options?: P["E"]
  tools?: Record<string, Tool>
}

export function Liminal<P extends Provider>(
  adapter: Adapter<P>,
  options?: LiminalOptions<P>,
): Liminal<P> {
  const messages = options?.messages ?? []
  return Object.assign($, {
    adapter,
    messages,
    type,
    value,
    map,
  })

  function $(this: Liminal<P>, ...texts: Array<number | string | P["I" | "O"]>): Liminal<P>
  function $(
    this: Liminal<P>,
    template: TemplateStringsArray,
    ...values: Array<number | string>
  ): Liminal<P>
  function $(this: Liminal<P>, ...args: Array<unknown>): Liminal<P> {
    const [e0, ...rest] = args
    if (isTemplateStringsArray(e0)) {
      messages.push(adapter.formatInput(recombine(e0, rest)))
    } else {
      args.forEach((arg) => {
        messages.push(
          typeof arg === "string"
            ? adapter.formatInput(arg)
            : typeof arg === "number"
            ? adapter.formatInput(arg.toString())
            : arg,
        )
      })
    }
    return this
  }

  function type(config?: ValueConfig<P>): Promise<Type<unknown, never>> {
    return value(L.MetaType, config)
  }

  function value<T>(type: Type<T, never>, config?: ValueConfig<P>): Promise<T> {
    type = adapter.transform?.(type) ?? type
    return adapter.complete({
      type,
      messages,
      model: config?.model,
    }).then((message) => {
      messages.push(message)
      return type.deserialize(adapter.unwrapOutput(message))
    })
  }

  function map(f: (messages: Array<P["I" | "O"]>) => Array<P["I" | "O"]>): Liminal<P> {
    return Liminal(adapter, {
      ...options ?? {},
      messages: f(messages),
    })
  }
}

export interface LiminalOptions<P extends Provider> extends ValueConfig<P> {
  messages?: Array<P["I" | "O"]>
  onMessage?: (message: P["I" | "O"]) => PromiseOr<void>
  tools?: Record<string, Tool>
}
