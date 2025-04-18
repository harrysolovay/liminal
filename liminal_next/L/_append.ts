import type { MessageRole } from "../Message.ts"
import { RuneBase } from "../runes/_RuneBase.ts"
import type { AppendMessage } from "../runes/AppendMessage.ts"
import type { LBase } from "./_LBase.ts"

export interface _append extends LBase<AppendMessage, void> {}

export function _append(role: MessageRole, content: string): _append {
  return {
    *[Symbol.iterator]() {
      return yield RuneBase("append_message", { role, content })
    },
  }
}
