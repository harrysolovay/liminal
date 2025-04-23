import { type LEvent, LEventTag, type MessageAppended } from "../LEvent.ts"
import type { ContentPart, Message, MessageRole } from "../Message.ts"
import type { Rune } from "../Rune.ts"
import { MessageRegistry } from "../state/MessageRegistry.ts"
import { emit } from "./emit.ts"
import { state } from "./state.ts"

export interface _message extends Generator<Rune<LEvent>, void> {}

export function* _message(role: MessageRole, content: Array<ContentPart>): _message {
  const [messageRegistry] = yield* state(MessageRegistry)
  const message: Message = { role, content }
  yield* emit<MessageAppended>({
    [LEventTag]: true,
    type: "message_appended",
    message,
  })
  messageRegistry.append(message)
}
