import * as AiInput from "@effect/ai/AiInput"
import * as Effect from "effect/Effect"
import * as Option from "effect/Option"
import * as PubSub from "effect/PubSub"
import type { YieldWrap } from "effect/Utils"
import { append } from "./append.ts"
import { LEvent, MessagesReduced } from "./LEvent.ts"
import { Strand } from "./Strand.ts"
import { set } from "./unsafeSet.ts"

/** Reduce the current strand's messages. */
export const reduce: <Y extends YieldWrap<Effect.Effect<any, any, any>>, A, E, R>(
  reducer: () => Generator<Y, Effect.Effect<Option.Option<A>, E, R>, never>,
) => Effect.Effect<
  void,
  ([Y] extends [never] ? never : [Y] extends [YieldWrap<Effect.Effect<infer _A, infer E, infer _R>>] ? E : never) | E,
  | Strand
  | ([Y] extends [never] ? never : [Y] extends [YieldWrap<Effect.Effect<infer _A, infer _E, infer R>>] ? R : never)
  | R
> = Effect.fnUntraced(function*(reducer) {
  const strand = yield* Strand
  if (!strand.messages.length || strand.messages.length === 1) return
  const [m0, m1, ...mRest] = strand.messages
  let prelude = yield* Effect
    .gen(function*() {
      yield* append(m0!, m1!)
      return yield* Effect.gen(reducer)
    })
    .pipe(
      Effect.provide(Strand.new()),
    )
  while (mRest.length) {
    prelude = yield* Effect
      .gen(function*() {
        yield* prelude
        yield* append(mRest.pop()!)
        return yield* Effect.gen(reducer)
      })
      .pipe(
        Effect.provide(Strand.new()),
      )
  }
  const messages: Array<AiInput.Message> = []
  yield* prelude.pipe(Effect.provideService(
    Strand,
    Strand.of({
      messages,
      events: yield* PubSub.unbounded<LEvent>(),
    }),
  ))
  const previous = yield* set(messages)
  yield* strand.events.publish(
    MessagesReduced.make({ previous, messages }),
  )
  return
})
