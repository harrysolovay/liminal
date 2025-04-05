import { type AppendMessage, appendMessage, type MessageAppendedEvent } from "../actions/AppendMessage.ts"
import type { AssistantContent, AssistantMessage, SystemMessage, UserContent, UserMessage } from "../Message.ts"
import { normalizeTaggableArgs, type TaggableArgs } from "../util/Taggable.ts"

export function user(...args: TaggableArgs<[content: UserContent]>): Generator<
  AppendMessage<{
    Entry: never
    Event: MessageAppendedEvent<UserMessage>
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
  AppendMessage<{
    Entry: never
    Event: MessageAppendedEvent<SystemMessage>
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
  AppendMessage<{
    Entry: never
    Event: MessageAppendedEvent<AssistantMessage>
  }>,
  void
> {
  const [content] = normalizeTaggableArgs(...args)
  return appendMessage({
    role: "assistant",
    content,
  })
}
