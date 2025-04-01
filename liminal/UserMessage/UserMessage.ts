import { ActionBase } from "../Action/ActionBase.ts"
import type { Spec } from "../Spec.ts"
import { isTemplateStringsArray } from "../util/isTemplateStringsArray.ts"
import type { UserContent } from "./UserContent.ts"
import type { UserMessagedEvent } from "./UserMessageEvent.ts"

export interface UserMessage<S extends Spec = Spec> extends ActionBase<"user_message", S> {
  content: UserContent
}

export function* user(
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
