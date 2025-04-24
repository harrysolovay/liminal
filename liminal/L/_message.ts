import { assert } from "liminal-util"
import { Context } from "../Context.ts"
import { type LEvent, MessageAppended } from "../LEvent.ts"
import type { ContentPart, Message, MessageRole } from "../Message.ts"
import { MessageRegistryContext } from "../MessageRegistry.ts"
import type { Rune } from "../Rune.ts"
import { emit } from "./emit.ts"

export interface _message extends Generator<Rune<LEvent>, void> {}

export function* _message(role: MessageRole, content: Array<ContentPart>): _message {
  const context = Context.ensure()
  const messageRegistry = context.get(MessageRegistryContext)
  assert(messageRegistry)
  const message: Message = { role, content }
  yield* emit(new MessageAppended(message))
  messageRegistry.append(message)
}
