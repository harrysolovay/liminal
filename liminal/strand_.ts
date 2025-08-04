import * as Effect from "effect/Effect"
import { flow } from "effect/Function"
import * as Option from "effect/Option"
import * as PubSub from "effect/PubSub"
import type { LEvent } from "./LEvent.ts"
import { sequence } from "./sequence.ts"
import { Strand } from "./Strand.ts"
import { type Sequence } from "./util/Sequence.ts"

/** Isolate the effect with a new strand in context. */
export const strand: Sequence<Strand> = flow(
  sequence,
  Effect.provideServiceEffect(
    Strand,
    Effect.gen(function*() {
      return Strand.of({
        parent: yield* Effect.serviceOption(Strand),
        events: yield* PubSub.unbounded<LEvent>(),
        system: Option.none(),
        messages: [],
        tools: new Set(),
      })
    }),
  ),
)
