import type { Events } from "../ActionEventSource.js"
import type { Actor } from "../Actor/Actor.js"
import type { Config } from "../Config.js"
import type { Message } from "../Message/Message.js"
import type { Tool } from "../Tool/Tool.js"

export interface State<R = any> {
  kind: "Context" | "Branch"
  key: string
  config: Config
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
  children: Array<State>
}

export function State<R = any>(state: State<R>) {
  return {
    ...state,
    toJSON() {
      const { kind, system, messages, key, events, children, result } = state
      return { kind, key, system, messages, events, children, result }
    },
  }
}
