import type { Schema } from "liminal-schema"
import { attachCustomInspect } from "liminal-util"
import type { Message } from "./Message.ts"

export class Model {
  constructor(
    readonly vendor: string,
    readonly resolve: (messages: Array<Message>, schema?: Schema) => Promise<string>,
  ) {}

  static {
    attachCustomInspect(this, ({ vendor }) => ({ vendor }))
  }
}
