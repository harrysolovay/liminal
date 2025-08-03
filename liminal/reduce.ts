import * as Effect from "effect/Effect"
import { append } from "./append.ts"
import { clear } from "./clear.ts"
import { Strand } from "./Strand.ts"
import { strand } from "./strand_.ts"

/** Sequentially reduce the current strand's messages in chronological order. */
export const reduce: <E, R, E1, R1>(
  reducer: Effect.Effect<Effect.Effect<void, E1, R1>, E, R>,
) => Effect.Effect<
  void,
  E | E1,
  R | R1 | Strand
> = Effect.fnUntraced(function*(reducer) {
  const parent = yield* Strand
  if (!parent.messages.length || parent.messages.length === 1) return
  const [m0, m1, ...mRest] = parent.messages
  let acc = yield* strand(
    append(m0!, m1!),
    reducer,
  )
  while (mRest.length) {
    acc = yield* strand(
      acc,
      append(mRest.pop()!),
      reducer,
    )
  }
  yield* clear
  yield* acc
  return
})
