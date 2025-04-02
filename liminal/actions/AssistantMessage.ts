import type { Spec } from "../Spec.ts"
import { isTemplateStringsArray } from "../util/isTemplateStringsArray.ts"
import { ActionBase, type ActionEventBase } from "./actions_base.ts"
import type { FilePart, ReasoningPart, RedactedReasoningPart, TextPart, ToolCallPart } from "./content_part.ts"

export interface AssistantMessage<S extends Spec = Spec> extends ActionBase<"assistant_message", S> {
  content: AssistantContent
}

export function* assistant(
  ...[raw, ...substitutions]: [content: AssistantContent] | [raw: TemplateStringsArray, ...substitutions: Array<string>]
): Generator<
  AssistantMessage<{
    Field: never
    Event: AssistantMessagedEvent
  }>,
  void
> {
  const content = isTemplateStringsArray(raw) ? String.raw(raw, ...substitutions) : raw
  return yield ActionBase("assistant_message", {
    content,
    reduce(scope) {
      scope.events.emit({
        type: "assistant_messaged",
        content,
      })
      return scope.spread({
        messages: [...scope.messages, this as never],
        next: undefined,
      })
    },
  })
}

export type AssistantContent =
  | string
  | Array<TextPart | FilePart | ReasoningPart | RedactedReasoningPart | ToolCallPart>

export interface AssistantMessagedEvent extends ActionEventBase<"assistant_messaged"> {
  // TODO: serialized version – perhaps a `Serialized<T>`
  content: AssistantContent
}
