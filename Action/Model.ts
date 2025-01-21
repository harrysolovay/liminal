import type { Message } from "./Message.ts"
import type { Type } from "./Type/mod.ts"

export interface Model {
  kind: "Model"
  complete(messages: Array<Message>, outputType: Type): Promise<Message>
}
