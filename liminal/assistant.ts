import { AiInput, AiLanguageModel } from "@effect/ai"
import type { AiError } from "@effect/ai/AiError"
import { Effect, Option, Ref, type Schema } from "effect"
import { _emit } from "./_emit.ts"
import { Handler, MessagesRef, System, Toolkit } from "./Context.ts"
import { InferenceRequested, Inferred } from "./LEvent.ts"

export const assistant: {
  (): Effect.Effect<string, AiError, AiLanguageModel.AiLanguageModel | MessagesRef | System | Handler>
  <O, I>(
    schema: Schema.Schema<O, I, never>,
  ): Effect.Effect<O, AiError, AiLanguageModel.AiLanguageModel | MessagesRef | System | Handler>
} = Effect.fn(function*(schema?: Schema.Schema<any>) {
  yield* _emit(new InferenceRequested())
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
    yield* _emit(new Inferred({ response }))
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
  yield* _emit(new Inferred({ response }))
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
