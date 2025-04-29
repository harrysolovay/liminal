import type { SchemaObject } from "liminal-schema"
import { attachCustomInspect } from "liminal-util"
import type { Message } from "./Message.ts"
import type { Tool } from "./Tool.ts"

export class Model {
  constructor(
    readonly vendor: string,
    readonly seal: (envelope: Envelope) => SealedEnvelope,
  ) {}

  static {
    attachCustomInspect(this, ({ vendor }) => ({ vendor }))
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
