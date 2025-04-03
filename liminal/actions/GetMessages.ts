import { ActionBase } from "./actions_base.ts"
import type { Message } from "./messages.ts"

export interface GetMessages extends ActionBase<"get_messages", never> {}

export function* getMessages(): Generator<GetMessages, Array<Message>> {
  return yield ActionBase("get_messages", {
    reduce(scope) {
      return scope.spread({ next: [...scope.messages] })
    },
  })
}
