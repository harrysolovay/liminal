import type { Context } from "../Context.ts"
import { Definition } from "../Definition.ts"
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
): Generator<Rune<any>, any> { // TODO: although it's somewhat irrelevant, type this
  const parent = yield* reflect
  const strands: Array<Strand> = []
  for (const definition of Array.isArray(definitions) ? definitions : Object.values(definitions)) {
    strands.push(
      new Strand(definition, {
        parent,
        context: context?.clone() ?? parent.context.clone(),
      }),
    )
  }
  const results = yield* continuation("all", () => Promise.all(strands))
  if (Array.isArray(strands)) return results
  const keys = Object.keys(strands)
  return Object.fromEntries(results.map((result, i) => [keys[i], result]))
}
