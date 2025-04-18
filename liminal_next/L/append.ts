import type { MessageRole } from "../Message.ts"
import { RuneBase } from "../runes/_RuneBase.ts"
import type { AppendMessage } from "../runes/AppendMessage.ts"

export interface append extends Iterable<AppendMessage, void> {}

export function append(role: MessageRole, content: string): append {
  return {
    *[Symbol.iterator]() {
      return yield RuneBase("append_message", { role, content })
    },
  }
}
