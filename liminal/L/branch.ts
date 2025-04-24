import { AgentContext } from "../AgentContext.ts"
import { run } from "../run.ts"
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
  if (Array.isArray(value)) {
    const runners = value.map((runic) => {
      const context = AgentContext.get().child()
      return () => run(runic, context)
    })
    return yield* rune(() => Promise.all(runners.map((runner) => runner())))
  } else if (typeof value === "object") {
    const runners = Object.entries(value).map(([key, runic]) => {
      const context = AgentContext.get().child()
      return async () => [key, await run(runic, context)]
    })
    return yield* rune(() => Promise.all(runners.map((runner) => runner())).then(Object.fromEntries))
  }
  const context = AgentContext.get().child()
  return yield* rune(() => run(typeof value === "function" ? value() : value, context))
}
