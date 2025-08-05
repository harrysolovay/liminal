import * as Effect from "effect/Effect"
import type { Sequence } from "./util/Sequence"

export const sequence: Sequence = (...steps) =>
  Effect.all(steps, {
    concurrency: 1,
  }).pipe(
    Effect.map((v: Array<never>) => v.pop()!) as never,
  )
