import { assert, isIterableLike } from "liminal-util"
import { Context } from "../Context.ts"
import { Fiber } from "../Fiber.ts"
import { HandlerContext } from "../Handler.ts"
import { MessageRegistry, MessageRegistryContext } from "../MessageRegistry.ts"
import { ModelRegistry, ModelRegistryContext } from "../ModelRegistry.ts"
import { type Rune } from "../Rune.ts"
import { Runic } from "../Runic.ts"
import type { StrandConfig } from "../StrandConfig.ts"
import { ToolRegistry, ToolRegistryContext } from "../ToolRegistry.ts"
import { rune } from "./rune.ts"

export interface strand<Y extends Rune, T> extends Iterable<Y, T>, PromiseLike<T> {}

export function strand<X extends Runic>(
  runic: X,
  config?: StrandConfig<Runic.T<X>, Rune.E<Runic.Y<X>>>,
): strand<Runic.Y<X>, Runic.T<X>>
export function strand<XA extends Array<Runic>>(
  runics: XA,
  config?: StrandConfig<{ [I in keyof XA]: Runic.T<XA[I]> }, Rune.E<Runic.Y<XA[number]>>>,
): strand<Runic.Y<XA[number]> | Rune<never>, { [I in keyof XA]: Runic.T<XA[I]> }>
export function strand<XR extends Record<keyof any, Runic>>(
  runics: XR,
  config?: StrandConfig<{ [K in keyof XR]: Runic.T<XR[K]> }, Rune.E<Runic.Y<XR[keyof XR]>>>,
): strand<Runic.Y<XR[keyof XR]> | Rune<never>, { [K in keyof XR]: Runic.T<XR[K]> }>
export function strand(
  value: Runic | Array<Runic> | Record<keyof any, Runic>,
  config?: StrandConfig,
): strand<Rune, any> {
  return {
    *[Symbol.iterator](): Generator<Rune, any> {
      const parent = yield* Fiber
      if (Array.isArray(value)) {
        const fibers = value.map((runic) => context().run(() => new Fiber(runic, { parent })))
        return yield* rune(() => Promise.all(fibers.map((fiber) => fiber.resolution())), "strand")
      } else if (typeof value === "object" && !isIterableLike(value)) {
        const fibers = Object.values(value).map((runic) => context().run(() => new Fiber(runic, { parent })))
        return yield* rune(() => {
          const keys = Object.keys(value)
          return Promise
            .all(fibers.map((fiber) => fiber.resolution()))
            .then((resolved) => resolved.map((value, i) => [keys[i], value]))
            .then(Object.fromEntries)
        }, "strand")
      }
      const fiber = context().run(() => new Fiber(value, { parent }))
      return yield* rune(() => fiber.resolution(), "strand")
    },
    then(onfulfilled, onrejected) {
      return new Fiber(this).resolution().then(onfulfilled, onrejected)
    },
  }

  function context() {
    const current = Context.get()
    assert(current)
    const context = current.fork()
    if (config) {
      if ("handler" in config) {
        context.set(HandlerContext, config.handler)
      }
      if ("models" in config) {
        context.set(ModelRegistryContext, config.models?.clone() ?? new ModelRegistry())
      }
      if ("messages" in config) {
        context.set(MessageRegistryContext, config.messages?.clone() ?? new MessageRegistry())
      }
      if ("tools" in config) {
        context.set(ToolRegistryContext, config.tools?.clone() ?? new ToolRegistry())
      }
    }
    return context
  }
}
