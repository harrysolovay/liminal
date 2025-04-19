import type { Message } from "../Message.ts"
import type { RuneBase } from "./_RuneBase.ts"

export interface AppendMessage extends RuneBase<"append_message">, Message {}
