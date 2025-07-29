import * as AiError from "@effect/ai/AiError"
import * as AiInput from "@effect/ai/AiInput"
import * as AiLanguageModel from "@effect/ai/AiLanguageModel"
import * as AiToolkit from "@effect/ai/AiToolkit"
import * as Effect from "effect/Effect"
import * as Schema from "effect/Schema"
import * as Strand from "./Strand.ts"
import { isTemplateStringsArray } from "./util/isTemplateStringsArray.ts"

export const user: {
  (template: TemplateStringsArray, ...substitutions: Array<unknown>): Effect.Effect<void, never, Strand.Strand>
  (message: string): Effect.Effect<void, never, Strand.Strand>
  (a0: TemplateStringsArray | string, ...aRest: Array<unknown>): Effect.Effect<void, never, Strand.Strand>
} = Effect.fnUntraced(function*(a0, ...aRest) {
  const { messages, onMessage } = yield* Strand.Strand
  const text = isTemplateStringsArray(a0) ? String.raw({ raw: a0 }, ...aRest) : a0
  const message = new AiInput.UserMessage({
    parts: [new AiInput.TextPart({ text })],
  })
  yield* onMessage(message)
  messages.push(message)
})

export const messages: Effect.Effect<Array<AiInput.Message>, never, Strand.Strand> = Effect.map(
  Strand.Strand,
  ({ messages }) => messages,
)

export const setMessages: (
  messages: Iterable<AiInput.Message>,
) => Effect.Effect<Array<AiInput.Message>, never, Strand.Strand> = Effect.fnUntraced(
  function*(messages: Iterable<AiInput.Message>) {
    const strand = yield* Strand.Strand
    const { messages: prev } = strand
    strand.messages = [...messages]
    return prev
  },
)

export const assistant: Effect.Effect<
  string,
  AiError.AiError,
  AiLanguageModel.AiLanguageModel | Strand.Strand
> = Effect.gen(function*() {
  const model = yield* AiLanguageModel.AiLanguageModel
  const { system, messages, tools } = yield* Strand.Strand
  const response = yield* model.generateText({
    system,
    prompt: messages,
    toolkit: AiToolkit.make(...tools ?? []) as never,
  })
  const { text } = response
  yield* append(text)
  return text
})

export const assistantStruct: <O, I extends Record<string, unknown>>(
  schema: Schema.Schema<O, I, never>,
) => Effect.Effect<O, AiError.AiError, AiLanguageModel.AiLanguageModel | Strand.Strand> = Effect.fnUntraced(
  function*(schema) {
    const model = yield* AiLanguageModel.AiLanguageModel
    const { system, messages } = yield* Strand.Strand
    const response = yield* model.generateObject({
      system,
      schema,
      prompt: messages,
    })
    const { value, text } = response
    yield* append(text)
    return value
  },
)

const append = Effect.fnUntraced(function*(text: string) {
  const { messages, onMessage } = yield* Strand.Strand
  const message = new AiInput.AssistantMessage({
    parts: [new AiInput.TextPart({ text })],
  })
  yield* onMessage(message)
  messages.push(message)
})
