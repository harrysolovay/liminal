import { LEvent, MessageAppended } from "../LEvent.ts"
import type { Content, Message, MessageRole } from "../Message.ts"
import type { Rune } from "../Rune.ts"
import { emit } from "./emit.ts"
import { reflect } from "./reflect.ts"

/**
 * Adds a new message to the current context's message list.
 * Emits a message append event to observers.
 */
export function* message(role: MessageRole, content: Array<Content>): Generator<Rune<LEvent>, void> {
  const { context: { messages } } = yield* reflect
  const message: Message = { role, parts: content }
  yield* emit(new MessageAppended(message))
  messages.push(message)
}
