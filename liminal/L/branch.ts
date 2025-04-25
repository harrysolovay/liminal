import { Context } from "../Context.ts"
import { Fiber } from "../Fiber.ts"
import { type Rune } from "../Rune.ts"
import type { Runic } from "../Runic.ts"
import { rune } from "./rune.ts"

export interface branch<Y extends Rune, T> extends Generator<Y, T> {}

export function branch<X extends Runic>(runic: X): branch<Runic.Y<X>, Runic.T<X>>
export function branch<XA extends Array<Runic>>(
  runics: XA,
): branch<Runic.Y<XA[number]> | Rune<never>, { [I in keyof XA]: Runic.T<XA[I]> }>
export function branch<XR extends Record<keyof any, Runic>>(
  runics: XR,
): branch<Runic.Y<XR[keyof XR]> | Rune<never>, { [K in keyof XR]: Runic.T<XR[K]> }>
export function* branch(value: Runic | Array<Runic> | Record<keyof any, Runic>): branch<Rune, any> {
  const context = Context.ensure()
  const parent = yield* rune
  if (Array.isArray(value)) {
    const fibers = value.map((runic) => context.clone().run(() => parent.fork(runic)))
    return yield* rune(() => Fiber.allResolutions(fibers))
  } else if (typeof value === "object") {
    const fibers = Object.values(value).map((runic) => context.clone().run(() => parent.fork(runic)))
    return yield* rune(async () => {
      const keys = Object.keys(value)
      return await Fiber
        .allResolutions(fibers)
        .then((resolved) => resolved.map((value, i) => [keys[i], value]))
        .then(Object.fromEntries)
    })
  }
  const fiber = context.clone().run(() => parent.fork(typeof value === "function" ? value() : value))
  return yield* rune(() => fiber.resolution())
}
