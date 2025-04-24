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
  const parent = yield* rune((fiber) => fiber)
  if (Array.isArray(value)) {
    const fibers = value.map((runic) => context.clone().run(() => Fiber(runic, parent)))
    return yield* rune(() => Promise.all(fibers.map(({ resolve }) => resolve())))
  } else if (typeof value === "object") {
    const entries = Object.entries(value)
    const fibers = entries.map(([_key, runic]) => context.clone().run(() => Fiber(runic, parent)))
    return yield* rune(() =>
      Promise
        .all(fibers.map(({ resolve }, i) => resolve().then((value) => [entries[i]![0], value])))
        .then(Object.fromEntries)
    )
  }
  const fiber = context.clone().run(() => Fiber(typeof value === "function" ? value() : value, parent))
  return yield* rune(() => fiber.resolve())
}
