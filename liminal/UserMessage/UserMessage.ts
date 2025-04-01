import { ActionBase } from "../Action/ActionBase.ts"
import { type GetScope, getScope } from "../GetScope/GetScope.ts"
import type { JSONValue } from "../JSON/JSONValue.ts"
import type { Spec } from "../Spec.ts"
import { assert } from "../util/assert.ts"
import { isTemplateStringsArray } from "../util/isTemplateStringsArray.ts"
import type { UserContent } from "./UserContent.ts"
import type { UserMessagedEvent } from "./UserMessageEvent.ts"

export interface UserMessage<S extends Spec = Spec> extends ActionBase<"user_message", S> {
  content: UserContent
}

export function* user<S extends Array<keyof any> = []>(
  ...[raw, ...substitutions]: [content: UserContent] | [raw: TemplateStringsArray, ...substitutions: S]
): Generator<
  | GetScope
  | UserMessage<{
    Field: {
      [K in Extract<S[number], symbol>]: JSONValue
    }
    Event: UserMessagedEvent
  }>,
  void
> {
  if (isTemplateStringsArray(raw)) {
    const { args } = yield* getScope()
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
    })
  }
  return yield ActionBase("user_message", {
    content: raw,
  })
}
