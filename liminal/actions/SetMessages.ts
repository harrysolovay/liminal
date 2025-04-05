import type { Action } from "../Action.ts"
import type { Actor } from "../Actor.ts"
import type { Message } from "../Message.ts"
import { Scope } from "../Scope.ts"
import type { Spec } from "../Spec.ts"
import { isPropertyKey } from "../util/isPropertyKey.ts"
import type { PromiseOr } from "../util/PromiseOr.ts"
import { ActionBase, type ActionEventBase } from "./actions_base.ts"
import type { ChildEvent } from "./actions_common.ts"

export interface SetMessages<S extends Spec = Spec> extends ActionBase<"set_messages", S> {}

export function setMessages(
  setter: (messages: Array<Message>) => PromiseOr<Array<Message>>,
): Generator<
  SetMessages<{
    Entry: never
    Event: MessagesSetEvent
  }>,
  void
>
export function setMessages<K extends keyof any, Y extends Action>(
  key: K,
  setter: (messages: Array<Message>) => Actor<Y, Array<Message>>,
): Generator<
  SetMessages<{
    Entry: Y[""]["Entry"]
    Event: MessagesSetEvent | ChildEvent<"set_messages", K, Y[""]["Event"], Array<Message>>
  }>,
  void
>
export function* setMessages(
  setterOrKey: keyof any | ((messages: Array<Message>) => PromiseOr<Array<Message>>),
  maybeSetter?: (messages: Array<Message>) => Actor<Action, Array<Message>>,
): Generator<SetMessages, void> {
  return yield ActionBase("set_messages", {
    async reduce(scope) {
      if (isPropertyKey(setterOrKey)) {
        const events = scope.events.child((event) => ({
          type: "event_propagated",
          scopeType: "set_messages",
          scope: setterOrKey,
          event,
        }))
        events.emit({
          type: "entered",
        })
        const setterScope = await new Scope(
          "set_messages",
          scope.args,
          setterOrKey,
          events,
          scope.runInfer,
          scope.runEmbed,
        ).reduce(maybeSetter!([...scope.messages]))
        const { result } = setterScope
        events.emit({
          type: "exited",
          result,
        })
        events.emit({
          type: "messages_set",
          messages: result,
        })
        return scope.spread({
          messages: result,
          next: undefined,
          children: [...scope.children, setterScope],
        })
      }
      const messages = await setterOrKey([...scope.messages])
      return scope.spread({
        next: undefined,
        messages,
      })
    },
  })
}

export interface MessagesSetEvent extends ActionEventBase<"messages_set"> {
  messages: Array<Message>
}
