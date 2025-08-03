import * as Effect from "effect/Effect"
import * as Option from "effect/Option"
import { normalize, type TaggableNullable } from "./_Taggable.ts"
import { Strand } from "./Conversation.ts"

export const system: TaggableNullable<Effect.Effect<Option.Option<string>, never, Strand>> = Effect.fnUntraced(
  function*(a0, ...aRest) {
    const conversation = yield* Strand
    const { system } = conversation
    conversation.system = a0 ? Option.some(normalize(a0, aRest)) : Option.none()
    return system
  },
)
