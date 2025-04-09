import { Action } from "../Action.ts"
import type { Actor } from "../Actor.ts"
import type { MessagesSet } from "../events/MessagesSet.ts"
import type { Message } from "../Message.ts"
import type { Spec } from "../Spec.ts"
import { isPropertyKey } from "../util/isPropertyKey.ts"
import type { JSONKey } from "../util/JSONKey.ts"
import type { PromiseOr } from "../util/PromiseOr.ts"

export function setMessages(
  setter: (messages: Array<Message>) => PromiseOr<Array<Message>>,
): Generator<
  Action<
    "set_messages",
    Spec.Make<{
      Event: MessagesSet
    }>
  >,
  Array<Message>
>
export function setMessages<K extends JSONKey, Y extends Action>(
  key: K,
  setter: (messages: Array<Message>) => Actor<Y, Array<Message>>,
): Generator<
  Action<
    "set_messages",
    Spec.Make<{
      Event: MessagesSet
      Child: [K, Y[""]]
      Entry: Y[""]["Entry"]
      Value: Array<Message>
    }>
  >,
  Array<Message>
>
export function* setMessages(
  setterOrKey: JSONKey | ((messages: Array<Message>) => PromiseOr<Array<Message>>),
  maybeSetter?: (messages: Array<Message>) => Actor<Action, Array<Message>>,
): Generator<Action<"set_messages">, Array<Message>> {
  return yield Action("set_messages", async (scope) => {
    if (isPropertyKey(setterOrKey)) {
      const setterScope = scope.fork("set_messages", [setterOrKey])
      const reduced = await setterScope.reduce(maybeSetter!([...scope.messages]))
      const { value } = reduced
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
