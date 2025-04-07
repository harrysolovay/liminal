import type { Action } from "../../Action.ts"
import type { MessageAppendedEvent } from "../../events/MessageAppendedEvent.ts"
import type { MessageRemovedEvent } from "../../events/MessageRemovedEvent.ts"
import type { AssistantContent, AssistantMessage, SystemMessage, UserContent, UserMessage } from "../../Message.ts"
import { normalizeTaggableArgs, type TaggableArgs } from "../../util/Taggable.ts"
import { appendMessage } from "../appendMessage.ts"

export function user(...args: TaggableArgs<[content: UserContent]>): Generator<
  Action<"append_message", {
    Entry: never
    Event: MessageAppendedEvent<UserMessage>
    Throw: never
  }>,
  Generator<
    Action<"remove_message", {
      Entry: never
      Event: MessageRemovedEvent
      Throw: never
    }>,
    void
  >
> {
  const [content] = normalizeTaggableArgs(...args)
  return appendMessage({
    role: "user",
    content,
  })
}

export function system(...args: TaggableArgs<[content: string]>): Generator<
  Action<"append_message", {
    Entry: never
    Event: MessageAppendedEvent<SystemMessage>
    Throw: never
  }>,
  Generator<
    Action<"remove_message", {
      Entry: never
      Event: MessageRemovedEvent
      Throw: never
    }>,
    void
  >
> {
  const [content] = normalizeTaggableArgs(...args)
  return appendMessage({
    role: "system",
    content,
  })
}

export function assistant(...args: TaggableArgs<[content: AssistantContent]>): Generator<
  Action<"append_message", {
    Entry: never
    Event: MessageAppendedEvent<AssistantMessage>
    Throw: never
  }>,
  Generator<
    Action<"remove_message", {
      Entry: never
      Event: MessageRemovedEvent
      Throw: never
    }>,
    void
  >
> {
  const [content] = normalizeTaggableArgs(...args)
  return appendMessage({
    role: "assistant",
    content,
  })
}
