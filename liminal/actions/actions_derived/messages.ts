import type { AssistantContent, UserContent } from "../../Message.ts"
import { normalizeTaggableArgs, type TaggableArgs } from "../../util/Taggable.ts"
import { appendMessage } from "../appendMessage.ts"

export function user(...args: TaggableArgs<[content: UserContent]>) {
  const [content] = normalizeTaggableArgs(...args)
  return appendMessage("user", content)
}

export function system(...args: TaggableArgs<[content: string]>) {
  const [content] = normalizeTaggableArgs(...args)
  return appendMessage("system", content)
}

export function assistant(...args: TaggableArgs<[content: AssistantContent]>) {
  const [content] = normalizeTaggableArgs(...args)
  return appendMessage("assistant", content)
}
