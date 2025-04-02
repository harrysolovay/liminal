import type { Scope } from "../Scope.ts"
import type { Spec } from "../Spec.ts"
import { assert } from "../util/assert.ts"
import { isTemplateStringsArray } from "../util/isTemplateStringsArray.ts"
import type { JSONValue } from "../util/JSONValue.ts"
import { ActionBase, type ActionEventBase } from "./actions_base.ts"
import type { FilePart, ImagePart, TextPart } from "./content_part.ts"
import { getScope } from "./GetScope.ts"

export type UserContent = string | Array<TextPart | ImagePart | FilePart>

export interface UserMessage<S extends Spec = Spec> extends ActionBase<"user_message", S> {
  content: UserContent
}

export function* user<S extends Array<keyof any> = []>(
  ...[raw, ...substitutions]: [content: UserContent] | [raw: TemplateStringsArray, ...substitutions: S]
): Generator<
  UserMessage<{
    Entry: [Extract<S[number], symbol>, JSONValue]
    Event: UserMessagedEvent
  }>,
  void
> {
  if (isTemplateStringsArray(raw)) {
    const { args } = yield* getScope() as Generator<never, Scope>
    const pieces = substitutions.map((substitution) => {
      if (typeof substitution === "string" || typeof substitution === "number") {
        return substitution
      }
      const arg: JSONValue = args[substitution]
      assert(arg !== undefined)
      return typeof arg === "string" ? arg : JSON.stringify(arg)
    })
    return yield ActionBase("user_message", {
      content: String.raw(raw, pieces),
      reduce(scope) {
        return reduceUserMessage(this as never, scope)
      },
    })
  }
  return yield ActionBase("user_message", {
    content: raw,
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
