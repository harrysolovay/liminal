import * as Effect from "effect/Effect"
import type { Sequencer } from "./util/Sequencer.ts"

export const sequence: Sequencer = (...steps) =>
  Effect.all(steps, {
    concurrency: 1,
  }).pipe(
    Effect.map((v: Array<never>) => v.pop()!) as never,
  )
