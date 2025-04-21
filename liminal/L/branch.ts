import { Fiber } from "../Fiber.ts"
import { type Rune } from "../Rune.ts"
import type { Runic } from "../Runic.ts"
import { all } from "./all.ts"
import { fork } from "./fork.ts"
import { join } from "./join.ts"
import { self } from "./self.ts"

export interface branch<Y extends Rune, T> extends Generator<Y, T> {}

export function branch<Y extends Rune, T>(runic: Runic<Y, T>): branch<Y | Rune<never>, T>
export function branch<XA extends Array<Runic>>(
  runics: XA,
): branch<Runic.Y<XA[number]> | Rune<never>, { [I in keyof XA]: Runic.T<XA[I]> }>
export function branch<XR extends Record<keyof any, Runic>>(
  runics: XR,
): branch<Runic.Y<XR[keyof XR]> | Rune<never>, { [K in keyof XR]: Runic.T<XR[K]> }>
export function* branch(value: Runic | Array<Runic> | Record<keyof any, Runic>): branch<Rune, any> {
  const { globals, state } = yield* self
  if (Array.isArray(value)) {
    const fibers = value.map((runic) => Fiber(globals, runic, state))
    return yield* join(yield* all(...fibers))
  } else if (typeof value === "object") {
    const fibers = Object.values(value).map((runic) => Fiber(globals, runic, state))
    const resolved = yield* join(yield* all(...fibers))
    return Object.fromEntries(Object.keys(value).map((key, i) => [key, resolved[i]]))
  }
  const fiber = yield* fork(typeof value === "function" ? value() : value as Runic, state.clone())
  return yield* join(fiber)
}
