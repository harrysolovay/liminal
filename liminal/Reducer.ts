import * as Effect from "effect/Effect"
import type { Pipeable } from "effect/Pipeable"
import * as PubSub from "effect/PubSub"
import * as Stream from "effect/Stream"
import type { Covariant } from "effect/Types"
import { append } from "./append.ts"
import { clear } from "./clear.ts"
import { type LEvent, MessagesReduced } from "./LEvent.ts"
import { Strand } from "./Strand.ts"

export const ReducerTypeId: unique symbol = Symbol.for("liminal/Reducer")
export type ReducerTypeId = typeof ReducerTypeId

export interface Reducer<E, R, E1, R1> extends Reducer.Variance<E, R, E1, R1>, Pipeable {
  effect: Effect.Effect<Effect.Effect<void, E1, R1>, E, R>
}

export namespace Reducer {
  export interface Variance<out E, out R, out E1, out R1> {
    readonly [ReducerTypeId]: VarianceStruct<E, R, E1, R1>
  }

  export interface VarianceStruct<out E, out R, out E1, out R1> {
    readonly _E: Covariant<E>
    readonly _R: Covariant<R>
    readonly _E1: Covariant<E1>
    readonly _R1: Covariant<R1>
  }

  /** Reduce the current strand's messages. */
  export const apply: <E, R, E1, R1>(reducer: Reducer<E, R, E1, R1>) => Effect.Effect<
    void,
    E | E1,
    R | R1 | Strand
  > = Effect.fnUntraced(function*(reducer) {
    const strand = yield* Strand
    if (!strand.messages.length || strand.messages.length === 1) return
    const [m0, m1, ...mRest] = strand.messages
    let prelude = yield* Effect
      .gen(function*() {
        yield* append(m0!, m1!)
        return yield* reducer.effect
      })
      .pipe(
        Effect.provide(Strand.new()),
      )
    while (mRest.length) {
      prelude = yield* Effect
        .gen(function*() {
          yield* prelude
          yield* append(mRest.pop()!)
          return yield* reducer.effect
        })
        .pipe(
          Effect.provide(Strand.new()),
        )
    }
    const temp = Strand.make({
      events: yield* PubSub.unbounded<LEvent>(),
    })
    yield* prelude.pipe(Effect.provideService(Strand, temp))
    const previous = yield* clear
    yield* append(...temp.messages)
    yield* strand.events.publish(
      MessagesReduced.make({
        previous,
        messages: temp.messages,
      }),
    )
    return
  })

  /** Use a reducer to create a stream, the events of which can be handled with the rolling context of the reducer. */
  export const roll = <E, R, E1, R1>(_reducer: Reducer<E, R, E1, R1>): Stream.Stream<void, E, R> => {
    throw 0
  }
}
