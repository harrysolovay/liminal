import { LEvent, MessageAppended } from "../LEvent.ts"
import type { ContentPart, Message, MessageRole } from "../Message.ts"
import type { Rune } from "../Rune.ts"
import { emit } from "./emit.ts"
import { reflect } from "./reflect.ts"

export function* message(role: MessageRole, content: Array<ContentPart>): Generator<Rune<LEvent>, void> {
  const { context } = yield* reflect
  const { messages } = context
  const message: Message = { role, content }
  yield* emit(new MessageAppended(message))
  messages.push(message)
}
