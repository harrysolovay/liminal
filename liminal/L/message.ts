import { type LEvent, MessageAppended } from "../LEvent.ts"
import type { ContentPart, Message, MessageRole } from "../Message.ts"
import { MessageRegistryContext } from "../MessageRegistry.ts"
import type { Rune } from "../Rune.ts"
import { event } from "./event.ts"

export function* message(role: MessageRole, content: Array<ContentPart>): Generator<Rune<LEvent>, void> {
  const messageRegistry = MessageRegistryContext.getOrInit()
  const message: Message = { role, content }
  yield* event(new MessageAppended(message))
  messageRegistry.append(message)
}
