import * as Effect from "effect/Effect"
import * as Schema from "effect/Schema"
import { assistantSchema } from "../assistantSchema.ts"
import { branched } from "../branched.ts"
import { Thread } from "../ThreadInitial.ts"
import { user } from "../user.ts"

export const byDescription: <R extends Record<string, Effect.All.EffectAny>>(routes: R) => Effect.Effect<
  Effect.Effect.Success<R[keyof R]>,
  ([R[keyof R]] extends [never] ? never : Effect.Effect.Error<R[keyof R]>),
  ([R[keyof R]] extends [never] ? never : Effect.Effect.Context<R[keyof R]>) | Thread
> = Effect.fnUntraced(function*(routes) {
  const descriptions = Object.keys(routes)
  const description = yield* branched(
    user`
      Which of the following descriptions best matches the current conversation?

      - ${descriptions.join("\n -")}
    `,
    assistantSchema(Schema.Literal(...descriptions)),
  )
  return yield* routes[description]!
})
