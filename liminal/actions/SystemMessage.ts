import type { Spec } from "../Spec.ts"
import { normalizeTemplateArgs } from "../util/normalizeTemplateArgs.ts"
import { ActionBase, type ActionEventBase } from "./actions_base.ts"

export interface SystemMessage<S extends Spec = Spec> extends ActionBase<"system_message", S> {
  content: string
}

export function* system(
  ...args: [content: string] | [raw: TemplateStringsArray, ...substitutions: Array<string>]
): Generator<
  SystemMessage<{
    Entry: never
    Event: SystemMessagedEvent
  }>,
  void
> {
  const content = normalizeTemplateArgs(...args)
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
