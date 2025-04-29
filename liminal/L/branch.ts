import type { Definition } from "../Definition.ts"
import type { LEvent } from "../LEvent.ts"
import type { Rune } from "../Rune.ts"
import { Strand } from "../Strand.ts"
import { current } from "./current.ts"
import { join } from "./join.ts"

export function* branch<Y extends Rune<any>, T>(
  definition: Definition<Y, T>,
): Generator<Rune<LEvent> | Y, T> {
  const parent = yield* current
  const strand = new Strand(definition, {
    parent,
    context: parent.config.context?.inheritance(),
  })
  const [result] = yield* join(strand)
  return result
}

export namespace branch {
  export function* all<A extends Array<Definition>>(
    definitions: A,
  ): Generator<Rune<LEvent> | Definition.Y<A[number]>, { [I in keyof A]: Definition.T<A[I]> }> {
    const parent = yield* current
    const strands: Array<Strand> = []
    for (const definition of Object.values(definitions)) {
      strands.push(
        new Strand(definition, {
          parent,
          context: parent.config.context?.inheritance(),
        }),
      )
    }
    return (yield* join(...strands)) as never
  }

  export function* entries<A extends Record<keyof any, Definition>>(
    definitions: A,
  ): Generator<Rune<LEvent> | Definition.Y<A[keyof A]>, { [K in keyof A]: Definition.T<A[K]> }> {
    const parent = yield* current
    const strands: Array<Strand> = []
    for (const definition of Object.values(definitions)) {
      strands.push(
        new Strand(definition, {
          parent,
          context: parent.config.context?.inheritance(),
        }),
      )
    }
    const results = yield* join(...strands)
    return Object.fromEntries(Object.keys(definitions).map((key, index) => [key, results[index]])) as never
  }
}
