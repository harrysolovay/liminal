import type { MessageRole } from "../Message.ts"
import type { Rune } from "../Rune.ts"
import { MessageRegistry } from "../state/MessageRegistry.ts"
import { states } from "./states.ts"

export function* _message(role: MessageRole, content: string): Generator<Rune, void> {
  const [messageRegistry] = yield* states(MessageRegistry)
  messageRegistry.append({ role, content })
}
