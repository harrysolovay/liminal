import type { Schema } from "liminal-schema"
import type { Message } from "./Message.ts"

export interface Model {
  resolve(messages: Array<Message>, schema?: Schema): Promise<string>
}
