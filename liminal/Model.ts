import type { Message } from "./Message.ts"
import type { SchemaObject } from "./Schema.ts"
import type { Tool } from "./Tool.ts"
import { attachCustomInspect } from "./util/attachCustomInspect.ts"

export class Model {
  constructor(
    readonly client: string,
    readonly seal: (envelope: Envelope) => SealedEnvelope,
  ) {}

  static {
    attachCustomInspect(this, ({ client }) => ({ client }))
  }
}

export interface Envelope {
  messages: Array<Message>
  schema?: SchemaObject | undefined
  signal: AbortSignal
  tools?: Set<Tool> | undefined
}

export interface SealedEnvelope {
  resolve(): Promise<string>
  stream(): ReadableStream<string>
}
