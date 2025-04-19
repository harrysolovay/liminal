import type { MessageRole } from "../Message.ts"
import { MessageRegistry } from "../MessageRegistry.ts"
import type { State } from "../Rune.ts"
import { state } from "./state.ts"

export function* _message(role: MessageRole, content: string): Generator<State, void> {
  const messageRegistry = yield* state(MessageRegistry)
  messageRegistry.push({ role, content })
}
