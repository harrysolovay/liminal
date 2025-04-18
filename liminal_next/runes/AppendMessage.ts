import type { MessageAppended } from "../events/MessageAppended.ts"
import type { MessageRole } from "../Message.ts"
import type { RuneBase } from "./_RuneBase.ts"

export interface AppendMessage extends RuneBase<"append_message", MessageAppended> {
  role: MessageRole
  content: string
}
