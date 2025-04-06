import type { Action } from "../Action.ts"
import type { Actor } from "../Actor.ts"
import type { Message } from "../Message.ts"
import type { Spec } from "../Spec.ts"
import { isPropertyKey } from "../util/isPropertyKey.ts"
import type { PromiseOr } from "../util/PromiseOr.ts"
import { ActionBase, type EventBase } from "./actions_base.ts"
import type { ChildEvent } from "./actions_common.ts"

export interface SetMessages<S extends Spec = Spec> extends ActionBase<"set_messages", S> {}

export function setMessages(
  setter: (messages: Array<Message>) => PromiseOr<Array<Message>>,
): Generator<
  SetMessages<{
    Entry: never
    Event: MessagesSetEvent
  }>,
  Array<Message>
>
export function setMessages<K extends keyof any, Y extends Action>(
  key: K,
  setter: (messages: Array<Message>) => Actor<Y, Array<Message>>,
): Generator<
  SetMessages<{
    Entry: Y[""]["Entry"]
    Event: MessagesSetEvent | ChildEvent<"set_messages", K, Y[""]["Event"], Array<Message>>
  }>,
  Array<Message>
>
export function* setMessages(
  setterOrKey: keyof any | ((messages: Array<Message>) => PromiseOr<Array<Message>>),
  maybeSetter?: (messages: Array<Message>) => Actor<Action, Array<Message>>,
): Generator<SetMessages, Array<Message>> {
  return yield ActionBase("set_messages", {
    async reduce(scope) {
      if (isPropertyKey(setterOrKey)) {
        const setterScope = scope.fork("set_messages", setterOrKey)
        setterScope.event({ type: "entered" })
        const reduced = await setterScope.reduce(maybeSetter!([...scope.messages]))
        const { value } = reduced
        setterScope.event({
          type: "exited",
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
    },
  })
}

export interface MessagesSetEvent extends EventBase<"messages_set"> {
  messages: Array<Message>
}
