import type { Tool } from "./Action/Tool.js"
import type { ActorSource } from "./common/ActorSource.js"
// import type { Event } from "./Action/Scope.js"
import type { ExecConfig } from "./ExecConfig.js"
import type { ExecSpec } from "./ExecSpec.js"
import type { Actor } from "./common/Actor.js"

export interface ExecState<S extends ExecSpec = ExecSpec> {
  config: ExecConfig<S>
  source: ActorSource
  actor: Actor
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
