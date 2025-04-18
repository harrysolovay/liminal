import type { LSchema } from "liminal-schema"
import type { Message } from "./Message.ts"

export interface Provider {
  resolve(messages: Array<Message>, schema?: LSchema): Promise<string>
}
