import type { Spec } from "../Spec.js"
import { ActionBase } from "./ActionBase.js"
import type { EventBase } from "./event_common.js"
import type { FilePart, ReasoningPart, RedactedReasoningPart, TextPart, ToolCallPart } from "./content_part.js"

export interface AssistantMessage<S extends Spec = Spec> extends ActionBase<"AssistantMessage", S> {
  content: AssistantContent
}

export type AssistantContent =
  | string
  | Array<TextPart | FilePart | ReasoningPart | RedactedReasoningPart | ToolCallPart>

export interface AssistantMessageEvent extends EventBase<"AssistantMessage"> {
  // TODO: serialized version – perhaps a `Serialized<T>`
  content: AssistantContent
}

export function* AssistantMessage(content: AssistantContent): Generator<
  AssistantMessage<{
    LanguageModel: never
    EmbeddingModel: never
    Event: AssistantMessageEvent
  }>,
  void
> {
  return yield ActionBase("AssistantMessage", { content })
}
