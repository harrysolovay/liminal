import * as Effect from "effect/Effect"
import * as Option from "effect/Option"
import * as PubSub from "effect/PubSub"
import { append } from "./append.ts"
import { clear } from "./clear.ts"
import { Strand } from "./Conversation.ts"
import { type LEvent, MessagesReduced } from "./LEvent.ts"
import { strand } from "./strand.ts"

/** Sequentially reduce the current strand's messages in chronological order. */
export const reduce: <E, R, E1, R1>(reducer: Effect.Effect<Effect.Effect<void, E1, R1>, E, R>) => Effect.Effect<
  void,
  E | E1,
  R | R1 | Strand
> = Effect.fnUntraced(function*(reducer) {
  const parent = yield* Strand
  if (!parent.messages.length || parent.messages.length === 1) return
  const [m0, m1, ...mRest] = parent.messages
  let prelude = yield* Effect
    .gen(function*() {
      yield* append(m0!, m1!)
      return yield* reducer
    })
    .pipe(strand)
  while (mRest.length) {
    prelude = yield* Effect
      .gen(function*() {
        yield* prelude
        yield* append(mRest.pop()!)
        return yield* reducer
      })
      .pipe(strand)
  }
  const temp = Strand.of({
    parent: Option.some(yield* Strand),
    events: yield* PubSub.unbounded<LEvent>(),
    system: Option.none(),
    messages: [],
  })

  yield* prelude.pipe(Effect.provideService(Strand, temp))
  const previous = yield* clear
  yield* append(...temp.messages)
  yield* parent.events.publish(
    MessagesReduced.make({
      previous,
      messages: temp.messages,
    }),
  )
  return
})

/** Use a reducer to create a stream, the events of which can be handled with the rolling context of the reducer. */
// export const roll = <E, R, E1, R1>(_reducer: Reducer<E, R, E1, R1>): Stream.Stream<void, E, R> => {
//   throw 0
// }
