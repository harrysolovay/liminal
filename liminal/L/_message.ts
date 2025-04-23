import { type LEvent, MessageAppended } from "../LEvent.ts"
import type { ContentPart, Message, MessageRole } from "../Message.ts"
import type { Rune } from "../Rune.ts"
import { context } from "../state/Context.ts"
import { MessageRegistry } from "../state/MessageRegistry.ts"
import { emit } from "./emit.ts"

export interface _message extends Generator<Rune<LEvent>, void> {}

export function* _message(role: MessageRole, content: Array<ContentPart>): _message {
  const state = context.get()
  const messageRegistry = state.getOrInit(MessageRegistry.make)
  const message: Message = { role, content }
  yield* emit(new MessageAppended(message))
  messageRegistry.append(message)
}
