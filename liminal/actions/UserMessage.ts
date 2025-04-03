import type { Scope } from "../Scope.ts"
import type { Spec } from "../Spec.ts"
import { normalizeTemplateArgs } from "../util/normalizeTemplateArgs.ts"
import { ActionBase, type ActionEventBase } from "./actions_base.ts"
import type { FilePart, ImagePart, TextPart } from "./content_part.ts"

export type UserContent = string | Array<TextPart | ImagePart | FilePart>

export interface UserMessage<S extends Spec = Spec> extends ActionBase<"user_message", S> {
  content: UserContent
}

export function* user(
  ...args: [content: UserContent] | [raw: TemplateStringsArray, ...substitutions: Array<string>]
): Generator<
  UserMessage<{
    Entry: never
    Event: UserMessagedEvent
  }>,
  void
> {
  return yield ActionBase("user_message", {
    content: normalizeTemplateArgs(...args),
    reduce(scope) {
      return reduceUserMessage(this as never, scope)
    },
  })
}

function reduceUserMessage(action: UserMessage, scope: Scope) {
  scope.events.emit({
    type: "user_messaged",
    content: action.content,
  })
  return scope.spread({
    messages: [...scope.messages, action],
    next: undefined,
  })
}

export interface UserMessagedEvent extends ActionEventBase<"user_messaged"> {
  // TODO: serialized version – perhaps a `Serialized<T>`
  content: UserContent
}
