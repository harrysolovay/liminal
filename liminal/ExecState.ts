import type { Tool } from "./Action/Tool.js"
import type { AgentSource } from "./AgentSource.js"
// import type { Event } from "./Action/Scope.js"
import type { ExecConfig } from "./ExecConfig.js"
import type { ExecSpec } from "./ExecSpec.js"
import type { Agent } from "./common/Agent.js"

export interface ExecState<S extends ExecSpec = ExecSpec> {
  config: ExecConfig<S>
  source: AgentSource
  agent: Agent
  languageModelKey: string
  embeddingModelKey: string | undefined
  messages: Array<S["Message"]>
  tools: Set<Tool>
  system: string | undefined
  next: any
  parent: ExecState<S> | undefined
  handler: (event: any) => unknown // TODO
  result?: any
}
