import { assert } from "liminal-util"
import { type LEvent, MessageAppended } from "../LEvent.ts"
import type { ContentPart, Message, MessageRole } from "../Message.ts"
import { MessageRegistryContext } from "../MessageRegistry.ts"
import type { Rune } from "../Rune.ts"
import { emit } from "./emit.ts"

export interface message extends Generator<Rune<LEvent>, void> {}

export function* message(role: MessageRole, content: Array<ContentPart>): message {
  const messageRegistry = MessageRegistryContext.get()
  assert(messageRegistry)
  const message: Message = { role, content }
  yield* emit(new MessageAppended(message))
  messageRegistry.append(message)
}
