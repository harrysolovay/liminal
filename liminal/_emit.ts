import { Effect, Option } from "effect"
import { Handler } from "./Context.ts"
import { LEvent } from "./LEvent.ts"

export const _emit = Effect.fn(function*(event: typeof LEvent.Type) {
  const handlerOption = yield* Effect.serviceOption(Handler)
  yield* Option.match(handlerOption, {
    *onSome(handler) {
      const effect = handler?.(event)
      if (effect) {
        yield* effect as Effect.Effect<void>
      }
    },
    *onNone() {},
  })
})
