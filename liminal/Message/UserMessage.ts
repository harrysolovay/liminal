import { ActionBase } from "../Action/ActionBase.js"
import type { Spec } from "../Spec.js"
import { isTemplateStringsArray } from "../util/isTemplateStringsArray.js"
import type { UserContent } from "./UserContent.js"
import type { UserMessagedEvent } from "./UserMessageEvent.js"

export interface UserMessage<S extends Spec = Spec> extends ActionBase<"user_message", S> {
  content: UserContent
}

export function* User(
  ...[raw, ...substitutions]: [content: UserContent] | [raw: TemplateStringsArray, ...substitutions: Array<string>]
): Generator<
  UserMessage<{
    LanguageModel: never
    EmbeddingModel: never
    Event: UserMessagedEvent
  }>,
  void
> {
  return yield ActionBase("user_message", {
    content: isTemplateStringsArray(raw) ? String.raw(raw, ...substitutions) : raw,
  })
}
