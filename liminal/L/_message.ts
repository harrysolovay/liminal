import type { MessageRole } from "../Message.ts"
import type { Rune } from "../Rune.ts"
import { MessageRegistry } from "../state/MessageRegistry.ts"
import { state } from "./state.ts"

export interface _message extends Generator<Rune, void> {}

export function* _message(role: MessageRole, content: string): _message {
  const [messageRegistry] = yield* state(MessageRegistry)
  messageRegistry.append({ role, content })
}
