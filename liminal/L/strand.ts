import { isIterableLike } from "liminal-util"
import { Config } from "../Config.ts"
import { Fiber } from "../Fiber.ts"
import { type AnyRune, type Rune } from "../Rune.ts"
import { Runic } from "../Runic.ts"
import { continuation } from "./continuation.ts"
import { self } from "./self.ts"

export interface Strand<Y extends AnyRune, T> extends Iterable<Y, T>, PromiseLike<T> {}

export function strand<X extends Runic>(
  runic: X,
  config?: Config<Runic.T<X>, Rune.E<Runic.Y<X>>>,
): Strand<Runic.Y<X>, Runic.T<X>>
export function strand<XA extends Array<Runic>>(
  runics: XA,
  config?: Config<{ [I in keyof XA]: Runic.T<XA[I]> }, Rune.E<Runic.Y<XA[number]>>>,
): Strand<Runic.Y<XA[number]> | Rune<never>, { [I in keyof XA]: Runic.T<XA[I]> }>
export function strand<XR extends Record<keyof any, Runic>>(
  runics: XR,
  config?: Config<{ [K in keyof XR]: Runic.T<XR[K]> }, Rune.E<Runic.Y<XR[keyof XR]>>>,
): Strand<Runic.Y<XR[keyof XR]> | Rune<never>, { [K in keyof XR]: Runic.T<XR[K]> }>
export function strand(
  value: Runic | Array<Runic> | Record<keyof any, Runic>,
  config?: Config,
): Strand<Rune, any> {
  return {
    *[Symbol.iterator](): Generator<Rune, any> {
      const parent = yield* self
      if (Array.isArray(value)) {
        const nextFibers = value.map((runic) =>
          new Fiber(runic, {
            parent,
            context: Config.toContext(parent.context, config),
          })
        )
        return yield* continuation(() => Promise.all(nextFibers.map((fiber) => fiber.resolution())), "strand")
      } else if (typeof value === "object" && !isIterableLike(value)) {
        const nextFibers = Object.values(value).map((runic) =>
          new Fiber(runic, {
            parent,
            context: Config.toContext(parent.context, config),
          })
        )
        return yield* continuation(() => {
          const keys = Object.keys(value)
          return Promise
            .all(nextFibers.map((fiber) => fiber.resolution()))
            .then((resolved) => resolved.map((value, i) => [keys[i], value]))
            .then(Object.fromEntries)
        }, "strand")
      }
      const nextFiber = new Fiber(value, {
        parent,
        context: Config.toContext(parent.context, config),
      })
      return yield* continuation(() => nextFiber.resolution(), "strand")
    },
    then(onfulfilled, onrejected) {
      return new Fiber(this, {
        context: Config.toContext(undefined, config),
      }).resolution().then(onfulfilled, onrejected)
    },
  }
}
