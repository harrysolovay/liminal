import type { Message } from "./Message.ts"
import type { Schema } from "./Schema2/Schema.ts"

export interface Model {
  resolve(messages: Array<Message>, schema?: Schema): Promise<string>
}
