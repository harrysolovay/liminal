import type { tag } from "../L/tag.ts"
import type { MessageAppended } from "../LEvent/MessageAppended.ts"
import type { RuneBase } from "./_RuneBase.ts"

export interface AppendMessage extends RuneBase<"append_message", MessageAppended> {
  tags: Array<tag>
}
