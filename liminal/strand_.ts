import * as Effect from "effect/Effect"
import { flow } from "effect/Function"
import { sequence } from "./sequence.ts"
import { Strand } from "./Strand.ts"
import { type Sequence } from "./util/Sequence.ts"

/** Isolate the effect with a new strand in context. */
export const strand: Sequence<Strand> = flow(
  sequence,
  Effect.provide(Strand.layer()),
)
