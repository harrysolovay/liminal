import { Action } from "../Action.ts"
import type { Agent } from "../Agent.ts"
import type { MessagesSet } from "../events/MessagesSet.ts"
import type { Message } from "../Message.ts"
import type { Spec } from "../Spec.ts"
import { isPropertyKey } from "../util/isPropertyKey.ts"
import type { JSONKey } from "../util/JSONKey.ts"
import type { PromiseOr } from "../util/PromiseOr.ts"
import { type getScope, scope } from "./scope.ts"

interface messages extends Iterable<getScope, Set<Message>> {
  (
    setter: (messages: Array<Message>) => PromiseOr<Array<Message>>,
  ): Generator<Action<"set_messages", Spec.Make<{ Event: MessagesSet }>>, Array<Message>>
  <K extends JSONKey, Y extends Action>(
    key: K,
    setter: (messages: Array<Message>) => Agent<Y, void>,
  ): Generator<
    Action<
      "set_messages",
      Spec.Make<{ Event: MessagesSet; Child: [K, Y[""]]; Entry: Y[""]["Entry"]; Value: Array<Message> }>
    >,
    Array<Message>
  >
}

export const messages: messages = Object.assign(messages_, {
  *[Symbol.iterator]() {
    const scope_ = yield* scope
    return scope_.messages
  },
}) as never

function* messages_(
  setterOrKey: JSONKey | ((messages: Array<Message>) => PromiseOr<Array<Message>>),
  maybeSetter?: (messages: Array<Message>) => Agent<Action, void>,
): Generator<Action<"set_messages">, Array<Message>> {
  return yield Action("set_messages", async (scope) => {
    if (isPropertyKey(setterOrKey)) {
      const setterScope = scope.fork("set_messages", [setterOrKey])
      const reduced = await setterScope.reduce(maybeSetter!([...scope.messages]))
      const { messages } = reduced
      setterScope.event({
        type: "messages_set",
        messages: [...messages],
      })
      return {
        ...scope,
        messages,
        nextArg: scope.messages,
      }
    }
    const messages = new Set(await setterOrKey([...scope.messages]))
    return {
      ...scope,
      messages,
      nextArg: scope.messages,
    }
  })
}
Object.defineProperty(messages_, "name", { value: "messages" })
