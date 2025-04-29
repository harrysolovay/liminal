import type { Context } from "../Context.ts"
import type { Definition } from "../Definition.ts"
import type { LEvent } from "../LEvent.ts"
import type { Rune } from "../Rune.ts"
import { Strand } from "../Strand.ts"
import { continuation } from "./continuation.ts"
import { reflect } from "./reflect.ts"

export function all<A extends Array<Definition>>(
  definitions: A,
  context?: Context,
): Generator<Rune<LEvent> | Definition.Y<A[number]>, { [I in keyof A]: Definition.T<A[I]> }>
export function all<A extends Record<keyof any, Definition>>(
  definitions: A,
  context?: Context,
): Generator<Rune<LEvent> | Definition.Y<A[keyof A]>, { [K in keyof A]: Definition.T<A[K]> }>
export function* all<A extends Array<Definition> | Record<keyof any, Definition>>(
  definitions: A,
  context?: Context,
): Generator<Rune<any>, any> {
  const parent = yield* reflect
  const strands: Array<Strand> = []
  for (const definition of Array.isArray(definitions) ? definitions : Object.values(definitions)) {
    strands.push(new Strand(definition, { parent, context }))
  }
  const results = yield* continuation("join", () => Promise.all(strands.map((strand) => strand.then())))
  if (Array.isArray(definitions)) {
    return results
  }
  const keys = Object.keys(definitions)
  return Object.fromEntries(results.map((result, i) => [keys[i], result]))
}
