import * as Effect from "effect/Effect"
import * as Option from "effect/Option"
import * as PubSub from "effect/PubSub"
import type { Last } from "./_Tuple.ts"
import { Strand } from "./Conversation.ts"
import type { LEvent } from "./LEvent.ts"

/** Isolate the effect with a new strand in context. */
export const branch: <L extends Array<Effect.All.EffectAny>>(...steps: L) => Effect.Effect<
  [L] extends [] ? void
    : [Last<L>] extends [Effect.Effect<infer A, infer _E, infer _R>] ? A
    : never,
  [L[number]] extends [never] ? never : [L[number]] extends [Effect.Effect<infer _A, infer E, infer _R>] ? E : never,
  | ([L[number]] extends [never] ? never : [L[number]] extends [Effect.Effect<infer _A, infer _E, infer R>] ? R : never)
  | Strand
> = (...steps) =>
  Effect.gen(function*() {
    if (!steps.length) return
    let current = yield* steps.pop()!
    while (steps.length) {
      current = yield* steps.pop()!
    }
    return current
  }).pipe(
    Effect.provideServiceEffect(
      Strand,
      Effect.gen(function*() {
        const parent = yield* Strand
        return Strand.of({
          parent: Option.some(parent),
          system: Option.none(),
          events: yield* PubSub.unbounded<LEvent>(),
          messages: [],
        })
      }),
    ),
  )
