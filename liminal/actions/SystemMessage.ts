import type { Spec } from "../Spec.ts"
import { dedent } from "../util/dedent.ts"
import { isTemplateStringsArray } from "../util/isTemplateStringsArray.ts"
import { ActionBase, type ActionEventBase } from "./actions_base.ts"

export interface SystemMessage<S extends Spec = Spec> extends ActionBase<"system_message", S> {
  content: string
}

export function* system(
  ...[raw, ...substitutions]: [content: string] | [raw: TemplateStringsArray, ...substitutions: Array<string>]
): Generator<
  SystemMessage<{
    Entry: never
    Event: SystemMessagedEvent
  }>,
  void
> {
  const content = isTemplateStringsArray(raw) ? dedent(String.raw(raw, ...substitutions)) : raw
  return yield ActionBase("system_message", {
    content,
    reduce(scope) {
      scope.events.emit({
        type: "system_messaged",
        content,
      })
      return scope.spread({
        messages: [...scope.messages, this as never],
        next: undefined,
      })
    },
  })
}

export interface SystemMessagedEvent extends ActionEventBase<"system_messaged"> {
  content: string
}
