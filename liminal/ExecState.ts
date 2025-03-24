import type { Tool } from "./Action/Tool.js"
import type { AgentSource } from "./AgentSource.js"
import type { Event } from "./Event.js"
import type { Agent } from "./common/Agent.js"

export interface ExecState<Model = any, Message = any> {
  models: Record<string, Model>
  source: AgentSource
  agent: Agent
  modelKey: string
  messages: Array<Message>
  tools: Set<Tool>
  system: string | undefined
  next: any
  parent: ExecState<Model, Message> | undefined
  handler: (event: Event) => unknown
  result?: any
}
