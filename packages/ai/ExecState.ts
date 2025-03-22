import { unwrapDeferred, type Flow, type FlowLike } from "liminal"
import type { CoreMessage } from "ai"
import type { ExecConfig } from "./ExecConfig.js"

export class ExecState {
  config: ExecConfig
  flow: Flow
  model: string
  messages: Array<CoreMessage>
  next: unknown
  constructor(config: ExecConfig, flowLike: FlowLike, model: string, messages: Array<CoreMessage> = []) {
    this.config = config
    this.flow = unwrapDeferred(flowLike)
    this.model = model
    this.messages = messages
  }
}
