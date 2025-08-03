import * as Effect from "effect/Effect"
import { flow, identity } from "effect/Function"
import * as Option from "effect/Option"
import * as PubSub from "effect/PubSub"
import type { LEvent } from "./LEvent.ts"
import type { Sequence } from "./Sequence.ts"
import { sequence } from "./sequence_.ts"
import { Strand } from "./Strand.ts"

/** Isolate the effect with a new strand in context. */
export const branch: Sequence<never, Strand> = flow(
  sequence,
  Effect.provideServiceEffect(
    Strand,
    Effect.gen(function*() {
      const parent = yield* Strand
      return Strand.of({
        parent: Option.some(parent),
        system: Option.map(parent.system, identity),
        events: yield* PubSub.unbounded<LEvent>(),
        messages: parent.messages.slice(),
        tools: parent.tools.slice(),
      })
    }),
  ),
)
