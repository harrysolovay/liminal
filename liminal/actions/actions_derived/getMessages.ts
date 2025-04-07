import { Action } from "../../Action.ts"
import type { Message } from "../../Message.ts"

export function* getMessages(): Generator<Action<"get_messages">, Array<Message>> {
  return yield Action("get_messages", (scope) => ({
    ...scope,
    nextArg: [...scope.messages],
  }))
}
