import type { AiError } from "@effect/ai/AiError"
import * as AiInput from "@effect/ai/AiInput"
import * as AiLanguageModel from "@effect/ai/AiLanguageModel"
import * as Effect from "effect/Effect"
import * as Option from "effect/Option"
import * as Ref from "effect/Ref"
import type * as Schema from "effect/Schema"
import { MessagesRef, System, Toolkit } from "./Context.ts"

export const assistant: {
  (): Effect.Effect<string, AiError, AiLanguageModel.AiLanguageModel | MessagesRef | System>
  <O, I>(
    schema: Schema.Schema<O, I, never>,
  ): Effect.Effect<O, AiError, AiLanguageModel.AiLanguageModel | MessagesRef | System>
} = Effect.fn(function*(schema?: Schema.Schema<any>) {
  const model = yield* AiLanguageModel.AiLanguageModel
  const messagesRef = yield* MessagesRef
  const toolkitOption = yield* Effect.serviceOption(Toolkit)
  const prompt = yield* Ref.get(messagesRef)
  const system = yield* System
  if (schema) {
    const response = yield* model.generateObject({
      system,
      schema,
      prompt,
    })
    const { value, text } = response
    yield* appendMessage(text)
    return value
  }
  const response = yield* model.generateText({
    system,
    prompt,
    ...Option.isSome(toolkitOption)
      ? toolkitOption.value
        ? { toolkit: toolkitOption.value }
        : {}
      : {},
  })
  const { text } = response
  yield* appendMessage(text)
  return text

  function* appendMessage(text: string) {
    yield* Ref.update(messagesRef, (prev) => [
      ...prev,
      new AiInput.AssistantMessage({
        parts: [new AiInput.TextPart({ text })],
      }),
    ])
  }
})
