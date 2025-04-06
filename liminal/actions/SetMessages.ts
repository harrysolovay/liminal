import { Action, type EventBase } from "../Action.ts"
import type { Actor } from "../Actor.ts"
import type { Message } from "../Message.ts"
import { isPropertyKey } from "../util/isPropertyKey.ts"
import type { PromiseOr } from "../util/PromiseOr.ts"
import type { ChildEvent } from "./actions_common.ts"

export function setMessages(
  setter: (messages: Array<Message>) => PromiseOr<Array<Message>>,
): Generator<
  Action<"set_messages", {
    Entry: never
    Event: MessagesSetEvent
    Throw: never
  }>,
  Array<Message>
>
export function setMessages<K extends keyof any, Y extends Action>(
  key: K,
  setter: (messages: Array<Message>) => Actor<Y, Array<Message>>,
): Generator<
  Action<"set_messages", {
    Entry: Y[""]["Entry"]
    Event: MessagesSetEvent | ChildEvent<"set_messages", K, Y[""]["Event"], Array<Message>>
    Throw: never
  }>,
  Array<Message>
>
export function* setMessages(
  setterOrKey: keyof any | ((messages: Array<Message>) => PromiseOr<Array<Message>>),
  maybeSetter?: (messages: Array<Message>) => Actor<Action, Array<Message>>,
): Generator<Action<"set_messages">, Array<Message>> {
  return yield Action<never>()("set_messages", async (scope) => {
    if (isPropertyKey(setterOrKey)) {
      const setterScope = scope.fork("set_messages", setterOrKey)
      const reduced = await setterScope.reduce(maybeSetter!([...scope.messages]))
      const { value } = reduced
      setterScope.event({
        type: "returned",
        value,
      })
      setterScope.event({
        type: "messages_set",
        messages: value,
      })
      return {
        ...scope,
        messages: value,
        nextArg: scope.messages,
      }
    }
    const messages = await setterOrKey([...scope.messages])
    return {
      ...scope,
      messages,
      nextArg: scope.messages,
    }
  })
}

export interface MessagesSetEvent extends EventBase<"messages_set"> {
  messages: Array<Message>
}
