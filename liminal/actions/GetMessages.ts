import type { Message } from "../Message.ts"
import { ActionBase } from "./actions_base.ts"

export interface GetMessages extends ActionBase<"get_messages", never> {}

export function* getMessages(): Generator<GetMessages, Array<Message>> {
  return yield ActionBase("get_messages", {
    reduce(scope) {
      return scope.spread({ next: [...scope.messages] })
    },
  })
}
