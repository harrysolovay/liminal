import { type AppendMessage, appendMessage, type MessageAppendedEvent } from "../actions/AppendMessage.ts"
import type {
  AssistantContent,
  AssistantMessage,
  Message,
  SystemMessage,
  UserContent,
  UserMessage,
} from "../Message.ts"
import { applyTemplateWithIndentation } from "../util/fixTemplateStrings.ts"
import { isTemplateStringsArray } from "../util/isTemplateStringsArray.ts"

export function user(...args: MessageArgs<UserContent>): Generator<
  AppendMessage<{
    Entry: never
    Event: MessageAppendedEvent<UserMessage>
  }>,
  void
> {
  return common("user", ...args)
}

export function system(...args: MessageArgs<string>): Generator<
  AppendMessage<{
    Entry: never
    Event: MessageAppendedEvent<SystemMessage>
  }>,
  void
> {
  return common("system", ...args)
}

export function assistant(...args: MessageArgs<AssistantContent>): Generator<
  AppendMessage<{
    Entry: never
    Event: MessageAppendedEvent<AssistantMessage>
  }>,
  void
> {
  return common("assistant", ...args)
}

function common<M extends Message>(
  role: M["role"],
  ...[raw, ...substitutions]: MessageArgs<M["content"]>
): Generator<
  AppendMessage<{
    Entry: never
    Event: MessageAppendedEvent<M>
  }>
> {
  const content = isTemplateStringsArray(raw)
    ? applyTemplateWithIndentation(raw, ...substitutions)
    : raw
  return appendMessage({ role, content } as M)
}

export type MessageArgs<C> = [content: C] | [raw: TemplateStringsArray, ...substitutions: Array<string>]
