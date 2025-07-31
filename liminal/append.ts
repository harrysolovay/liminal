import * as AiInput from "@effect/ai/AiInput"
import * as Effect from "effect/Effect"
import { MessageAppended, MessagesConcatenated } from "./LEvent.ts"
import { Strand } from "./Strand.ts"

export const append: (...messages: Array<AiInput.Message>) => Effect.Effect<void, never, Strand> = Effect.fnUntraced(
  function*(...messages) {
    const strand = yield* Strand
    strand.messages.push(...messages)
    if (messages.length === 1) {
      yield* strand.events.publish(MessageAppended.make({ message: messages[0]! }))
    } else {
      yield* strand.events.publish(MessagesConcatenated.make({ messages }))
    }
  },
)
