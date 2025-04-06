import type { Action } from "../Action"
import { fork } from "../actions/fork.ts"
import { getMessages } from "../actions/getMessages.ts"
import { setMessages } from "../actions/setMessages.ts"
import type { Message } from "../Message.ts"

export function* reduceMessages<K extends keyof any, Y extends Action>(
  key: K,
  reducer: (message: Message) => Iterable<Y, void>,
) {
  const messages = yield* fork(key, function*() {
    const messages = yield* getMessages()
    while (messages.length) {
      const current = messages.pop()!
      yield* reducer(current)
    }
    return yield* getMessages()
  })
  yield* setMessages(() => messages)
}
