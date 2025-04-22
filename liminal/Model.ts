import type { Schema } from "liminal-schema"
import type { Message } from "./Message.ts"

export interface Model {
  resolve(messages: Array<Message>, schema?: Schema): Promise<string>
}

// export interface ModelCapabilities {
//   readonly url: boolean
//   readonly mimes: Set<string>
//   readonly reasoning: boolean
//   readonly structures: boolean
// }
