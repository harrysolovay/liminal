import type { Message } from "../Message.ts"
import type { GetMessages } from "../Rune/GetMessages.ts"
import type { LBase } from "./_LBase.ts"

export interface messages extends LBase<GetMessages, Array<Message>> {}

export declare const messages: messages
