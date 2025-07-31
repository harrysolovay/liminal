import * as AiInput from "@effect/ai/AiInput"
import * as Effect from "effect/Effect"
import { MessageAppended } from "./LEvent.ts"
import * as Strand from "./Strand.ts"
import { isTemplateStringsArray } from "./util/isTemplateStringsArray.ts"

/** Append a user message to the conversation. */
export const user: {
  (template: TemplateStringsArray, ...substitutions: Array<unknown>): Effect.Effect<void, never, Strand.Strand>
  (message: string): Effect.Effect<void, never, Strand.Strand>
  (a0: TemplateStringsArray | string, ...aRest: Array<unknown>): Effect.Effect<void, never, Strand.Strand>
} = Effect.fnUntraced(function*(a0, ...aRest) {
  const { messages, events } = yield* Strand.Strand
  const text = isTemplateStringsArray(a0) ? String.raw({ raw: a0 }, ...aRest) : a0
  const message = new AiInput.UserMessage({
    parts: [new AiInput.TextPart({ text })],
  })
  yield* events.publish(MessageAppended.make({ message }))
  messages.push(message)
})
