import type { FiberConfig } from "../Fiber.ts"
import { run } from "../run.ts"
import { type Rune } from "../Rune.ts"
import type { Runic } from "../Runic.ts"
import { context } from "../state/Context.ts"
import { rune } from "./rune.ts"
import { self } from "./self.ts"

export interface branch<Y extends Rune, T> extends Generator<Y, T> {}

export function branch<X extends Runic>(runic: X): branch<Runic.Y<X>, Runic.T<X>>
export function branch<XA extends Array<Runic>>(
  runics: XA,
): branch<Runic.Y<XA[number]> | Rune<never>, { [I in keyof XA]: Runic.T<XA[I]> }>
export function branch<XR extends Record<keyof any, Runic>>(
  runics: XR,
): branch<Runic.Y<XR[keyof XR]> | Rune<never>, { [K in keyof XR]: Runic.T<XR[K]> }>
export function* branch(value: Runic | Array<Runic> | Record<keyof any, Runic>): branch<Rune, any> {
  const parent = yield* self
  const { globals } = parent
  if (Array.isArray(value)) {
    const runners = value.map((runic) => {
      const state = context.get()
      const fiberConfig: FiberConfig = {
        T: null!,
        globals,
        state,
      }
      return () => run(runic, fiberConfig)
    })
    return yield* rune(() => Promise.all(runners.map((runner) => runner())))
  } else if (typeof value === "object") {
    const runners = Object.entries(value).map(([key, runic]) => {
      const state = context.get()
      const fiberConfig: FiberConfig = {
        T: null!,
        globals,
        state,
      }
      return async () => [key, await run(runic, fiberConfig)]
    })
    return yield* rune(() => Promise.all(runners.map((runner) => runner())).then(Object.fromEntries))
  }
  const state = context.get()
  const fiberConfig: FiberConfig = {
    T: null!,
    globals,
    state,
  }
  return yield* rune(() => run(typeof value === "function" ? value() : value, fiberConfig))
}
