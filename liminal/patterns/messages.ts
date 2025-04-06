import type { Action } from "../Action.ts"
import { appendMessage } from "../actions/AppendMessage.ts"
import type { MessageAppendedEvent } from "../events/MessageAppendedEvent.ts"
import type { AssistantContent, AssistantMessage, SystemMessage, UserContent, UserMessage } from "../Message.ts"
import { normalizeTaggableArgs, type TaggableArgs } from "../util/Taggable.ts"

export function user(...args: TaggableArgs<[content: UserContent]>): Generator<
  Action<"append_message", {
    Entry: never
    Event: MessageAppendedEvent<UserMessage>
    Throw: never
  }>,
  void
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
  void
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
  void
> {
  const [content] = normalizeTaggableArgs(...args)
  return appendMessage({
    role: "assistant",
    content,
  })
}
