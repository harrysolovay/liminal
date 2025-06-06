import { AiInput, AiResponse } from "@effect/ai"
import { Schema } from "effect"

export const LEventId = Symbol.for("liminal/LEvent")
export type LEventId = typeof LEventId

export class MessageAppended extends Schema.Class<MessageAppended>("liminal/MessageAppended")({
  message: AiInput.Message,
}) {
  readonly [LEventId]: LEventId = LEventId
}

export class InferenceRequested extends Schema.Class<InferenceRequested>("liminal/InferenceRequested")({}) {
  readonly [LEventId]: LEventId = LEventId
}

export class Inferred extends Schema.Class<Inferred>("liminal/Inferred")({
  response: AiResponse.AiResponse,
}) {
  readonly [LEventId]: LEventId = LEventId
}

export type LEvent = typeof LEvent.Type
export const LEvent: Schema.Union<[
  typeof MessageAppended,
  typeof InferenceRequested,
  typeof Inferred,
]> = Schema.Union(MessageAppended, InferenceRequested, Inferred)
