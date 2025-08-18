import * as Effect from "effect/Effect"
import type { Sequencer } from "../util/Sequencer.ts"
import { Prev } from "./Prev.ts"

export const sequence: Sequencer = Effect.fnUntraced(function*(...steps) {
  let acc: unknown
  while (steps.length) {
    const current = steps.shift()!
    acc = yield* current.pipe(Effect.provideService(Prev, acc))
  }
  return acc
}) as never
