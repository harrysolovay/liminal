import * as Effect from "effect/Effect"
import { flow } from "effect/Function"
import * as Option from "effect/Option"
import * as PubSub from "effect/PubSub"
import { ab, type Sequence } from "./internal/Sequence.ts"
import type { LEvent } from "./LEvent.ts"
import { Strand } from "./Strand.ts"

/** Isolate the effect with a new strand in context. */
export const strand: Sequence<Strand> = flow(
  ab,
  Effect.provideServiceEffect(
    Strand,
    Effect.gen(function*() {
      return Strand.of({
        parent: yield* Effect.serviceOption(Strand),
        events: yield* PubSub.unbounded<LEvent>(),
        system: Option.none(),
        messages: [],
        tools: [],
      })
    }),
  ),
)
