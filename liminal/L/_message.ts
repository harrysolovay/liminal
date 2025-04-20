import type { MessageRole } from "../Message.ts"
import type { Rune, StateRune } from "../Rune.ts"
import { MessageRegistry } from "../states/MessageRegistry.ts"
import { state } from "./state.ts"

export function* _message(role: MessageRole, content: string): Generator<StateRune, void> {
  const [messageRegistry] = yield* state(MessageRegistry)
  messageRegistry.append({ role, content })
}
