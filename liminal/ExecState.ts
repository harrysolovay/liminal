import type { Tool } from "./Action/Tool.js"
import type { ActorSource } from "./common/ActorSource.js"
import type { ExecConfig } from "./ExecConfig.js"
import type { Actor } from "./common/Actor.js"
import type { ActionEvent } from "./Action/ActionEvent.js"
import type { Message } from "./Message.js"

export interface ExecState {
  config: ExecConfig
  source: ActorSource
  actor: Actor
  languageModelKey?: string
  embeddingModelKey?: string
  messages: Array<Message>
  tools: Set<Tool>
  system: string | undefined
  next: any
  parent: ExecState | undefined
  handler: (event: ActionEvent) => unknown
  result?: any
  aborted?: boolean
}
