import type { Tool } from "./Action/Tool.js"
import type { ExecConfig } from "./ExecConfig.js"
import type { Actor } from "./common/Actor.js"
import type { Message } from "./Action/Action.js"
import type { Events } from "./ActionEventSource.js"

export interface ExecState<R = any> {
  kind: "Context" | "Branch"
  key: string
  config: ExecConfig
  actor: Actor
  model: {
    language?: string
    embedding?: string
  }
  messages: Array<Message>
  tools: Set<Tool>
  system?: string
  next?: any
  events: Events
  result: R
  children: Array<ExecState>
}

export function ExecState<R = any>(execState: ExecState<R>) {
  return {
    ...execState,
    toJSON() {
      const { kind, system, messages, key, events, children, result } = execState
      return { kind, key, system, messages, events, children, result }
    },
  }
}
