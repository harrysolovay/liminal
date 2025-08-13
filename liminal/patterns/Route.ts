import * as Effect from "effect/Effect"
import * as Schema from "effect/Schema"
import * as L from "../L/L.ts"
import { Thread } from "../Thread.ts"

export const byDescription: <R extends Record<string, Effect.All.EffectAny>>(routes: R) => Effect.Effect<
  Effect.Effect.Success<R[keyof R]>,
  ([R[keyof R]] extends [never] ? never : Effect.Effect.Error<R[keyof R]>),
  ([R[keyof R]] extends [never] ? never : Effect.Effect.Context<R[keyof R]>) | Thread
> = Effect.fnUntraced(function*(routes) {
  const descriptions = Object.keys(routes)
  const description = yield* L.branch(
    L.user`
      Which of the following descriptions best matches the current conversation?

      - ${descriptions.join("\n -")}
    `,
    L.assistantSchema(Schema.Literal(...descriptions)),
  )
  return yield* routes[description]!
})
