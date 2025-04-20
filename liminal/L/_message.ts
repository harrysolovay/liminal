import type { MessageRole } from "../Message.ts"
import type { StateRune } from "../Rune.ts"
import { MessageRegistry } from "../states/MessageRegistry.ts"
import { state } from "./state.ts"

export interface _message extends Generator<StateRune, void> {}

export function* _message(role: MessageRole, content: string): _message {
  const [messageRegistry] = yield* state(MessageRegistry)
  messageRegistry.append({ role, content })
}
