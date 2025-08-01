import { Message } from "@effect/ai/AiInput"
import * as Effect from "effect/Effect"
import * as PubSub from "effect/PubSub"
import { append } from "./append.ts"
import { LEvent, MessagesReduced } from "./LEvent.ts"
import type { Reduce } from "./Reducer1.ts"
import { Strand } from "./Strand.ts"
import { unsafeSet } from "./unsafeSet.ts"
import type * as YieldUnwrap from "./YieldUnwrap.ts"

/** Reduce the current strand's messages. */
export const reduce: <Y extends YieldUnwrap.Any, E1, R1>(
  reducer: Reduce<Y, E1, R1>,
) => Effect.Effect<
  void,
  YieldUnwrap.E<Y> | E1,
  YieldUnwrap.R<Y> | R1 | Strand
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
  const messages: Array<Message> = []
  yield* prelude.pipe(Effect.provideService(
    Strand,
    Strand.of({
      messages,
      events: yield* PubSub.unbounded<LEvent>(),
    }),
  ))
  const previous = yield* unsafeSet(messages)
  yield* strand.events.publish(
    MessagesReduced.make({ previous, messages }),
  )
  return
})
