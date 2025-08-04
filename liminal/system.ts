import * as Effect from "effect/Effect"
import * as Option from "effect/Option"
import { Strand } from "./Strand.ts"
import { normalize, type TaggableNullable } from "./util/Taggable.ts"

export const system: TaggableNullable<Effect.Effect<Option.Option<string>, never, Strand>> = Effect.fnUntraced(
  function*(a0, ...aRest) {
    const conversation = yield* Strand
    const { system } = conversation
    conversation.system = a0 ? Option.some(normalize(a0, aRest)) : Option.none()
    return system
  },
)
