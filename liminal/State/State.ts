import type { Actor } from "../Actor/Actor.js"
import type { ModelAdapters } from "../Config.js"
import type { Events } from "../Events.js"
import type { Message } from "../Message/Message.js"
import type { Tool } from "../Tool/Tool.js"

export interface State<R = any> {
  kind: "Context" | "Branch"
  key?: keyof any
  models: ModelAdapters
  actor: Actor
  model: {
    language?: string
    embedding?: string
  }
  messages: Array<Message>
  tools: Set<Tool>
  next?: any
  events: Events
  result: R
  children: Array<State>
}

export function State<R = any>(state: State<R>) {
  return {
    ...state,
    toJSON() {
      const { kind, messages, key, events, children, result } = state
      return { kind, key, messages, events, children, result }
    },
  }
}
