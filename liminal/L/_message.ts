import { AgentContext } from "../AgentContext.ts"
import { type LEvent, MessageAppended } from "../LEvent.ts"
import type { ContentPart, Message, MessageRole } from "../Message.ts"
import type { Rune } from "../Rune.ts"
import { emit } from "./emit.ts"

export interface _message extends Generator<Rune<LEvent>, void> {}

export function* _message(role: MessageRole, content: Array<ContentPart>): _message {
  const { messages } = AgentContext.get()
  const message: Message = { role, content }
  yield* emit(new MessageAppended(message))
  messages.append(message)
}
