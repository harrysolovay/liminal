import { type LEvent, MessageAppended } from "../LEvent.ts"
import type { ContentPart, Message, MessageRole } from "../Message.ts"
import type { Rune } from "../Rune.ts"
import { event } from "./event.ts"
import { messages } from "./messages.ts"

export function* message(role: MessageRole, content: Array<ContentPart>): Generator<Rune<LEvent>, void> {
  const messageRegistry = yield* messages
  const message: Message = { role, content }
  yield* event(new MessageAppended(message))
  messageRegistry.append(message)
}
